"""
Extension de app.py avec les nouvelles routes pour le chat avec images.
Ajouter ces routes à app.py
"""

# À importer en haut du fichier app.py:
# from Repositories.ChatMessagesRepository import ChatMessagesRepository
# from Services.image_storage_service import ImageStorageService
# from werkzeug.utils import secure_filename

# --- ROUTES CHAT AVEC IMAGES ET ANALYSES ---

@app.route("/api/chat/upload", methods=["POST"])
def upload_image_for_chat():
    """
    Upload une image pour l'analyse (sans message pour l'instant).
    Retourne les métadonnées de l'image.
    """
    try:
        if "file" not in request.files:
            return create_api_response({}, success=False, message="Aucun fichier fourni"), 400
        
        file = request.files["file"]
        storage_service = ImageStorageService()
        
        image_metadata = storage_service.save_image(file)
        return create_api_response(image_metadata), 201
    except ValueError as ve:
        return create_api_response({}, success=False, message=str(ve)), 400
    except Exception as e:
        print(f"ERREUR API /chat/upload: {e}")
        return create_api_response({}, success=False, message=str(e)), 500


@app.route("/api/chat/message", methods=["POST"])
def send_chat_message_with_image():
    """
    Envoie un message au coach avec optionnellement une image.
    
    Flux:
    1. Sauvegarde le message utilisateur avec image (MongoDB)
    2. Analyse l'image si présente (IA service)
    3. Génère des recommandations (ML model)
    4. Envoie au coach Mistral
    5. Sauvegarde la réponse
    
    Paramètres (form ou JSON):
    - user_id: int
    - message: str (le message texte)
    - image_filename: str (unique_filename retourné par /upload)
    - objectif: str (maintien, perte_de_poids, etc.)
    - weight: float
    - height: float
    - age: int
    - experience_level: int
    """
    try:
        # Récupérer les données
        user_id = request.form.get("user_id")
        message = (request.form.get("message") or "").strip()
        image_filename = request.form.get("image_filename")
        
        if not user_id:
            return create_api_response({}, success=False, message="user_id requis"), 400
        
        user_id = int(user_id)
        
        # Vérifier que l'utilisateur existe
        utilisateur = UtilisateursRepository().find_by_id(user_id)
        if not utilisateur:
            return create_api_response({}, success=False, message=MSG_UTILISATEUR_INTROUVABLE), 404
        
        # Initialiser le repo MongoDB
        chat_repo = ChatMessagesRepository()
        storage_service = ImageStorageService()
        
        # 1. SAUVEGARDER LE MESSAGE UTILISATEUR
        image_metadata = None
        if image_filename and storage_service.image_exists(image_filename):
            image_metadata = {
                "unique_filename": image_filename,
                "upload_path": storage_service.get_image_path(image_filename),
            }
        
        user_message_doc = chat_repo.save_message_with_image(
            user_id=user_id,
            message_type="user",
            content=message,
            image_metadata=image_metadata
        )
        
        if not user_message_doc:
            return create_api_response({}, success=False, message="Erreur lors de la sauvegarde"), 500
        
        message_id = user_message_doc["_id"]
        
        # 2. ANALYSER L'IMAGE SI PRÉSENTE
        analysis = None
        if image_metadata:
            try:
                import requests
                response = requests.post(
                    "http://ia_service:8001/analyze",
                    files={"file": open(image_metadata["upload_path"], "rb")}
                )
                if response.status_code == 200:
                    analysis = response.json()
            except Exception as e:
                print(f"⚠️ Erreur analyse image : {e}")
        
        # 3. GÉNÉRER DES RECOMMANDATIONS
        recommendations = None
        try:
            import requests
            weight = float(request.form.get("weight", 70))
            height = float(request.form.get("height", 170))
            age = int(request.form.get("age", 30))
            experience_level = int(request.form.get("experience_level", 1))
            objectif = request.form.get("objectif", "maintien")
            
            response = requests.post(
                "http://ia_service:8001/recommander",
                json={
                    "objectif": objectif,
                    "user_weight_kg": weight,
                    "user_height_cm": height,
                    "user_age": age,
                    "experience_level": experience_level,
                    "problemes": "",
                }
            )
            if response.status_code == 200:
                recommendations = response.json()
        except Exception as e:
            print(f"⚠️ Erreur recommandations : {e}")
        
        # 4. APPEL À MISTRAL AVEC CONTEXTE COMPLET
        mistral_reply = None
        try:
            import requests
            
            prompt = f"""Message utilisateur: {message}
            
Analyse du repas photographié:
{json.dumps(analysis, ensure_ascii=False, indent=2) if analysis else "Pas d'image fournie."}
            
Exercices recommandés:
{json.dumps(recommendations, ensure_ascii=False, indent=2) if recommendations else "Aucune recommandation disponible."}
            
En tant que coach sportif et nutritionnel personnalisé, donne un conseil bienveillant et adapté au profil de l'utilisateur qui tient compte du repas analysé et des exercices recommandés. Réponds en français, maximum 150 mots."""
            
            mistral_api_key = os.getenv("MISTRAL_API_KEY")
            if mistral_api_key:
                mistral_response = requests.post(
                    "https://api.mistral.ai/v1/chat/completions",
                    headers={
                        "Authorization": f"Bearer {mistral_api_key}",
                        "Content-Type": "application/json",
                    },
                    json={
                        "model": os.getenv("MISTRAL_MODEL", "mistral-small-latest"),
                        "messages": [
                            {"role": "user", "content": prompt},
                        ],
                    },
                    timeout=30,
                )
                mistral_response.raise_for_status()
                mistral_reply = mistral_response.json()["choices"][0]["message"]["content"]
        except Exception as e:
            print(f"⚠️ Erreur Mistral : {e}")
            mistral_reply = "Désolé, je n'ai pas pu générer une réponse pour le moment."
        
        # 5. METTRE À JOUR LE MESSAGE AVEC LES ANALYSES
        chat_repo.update_message_with_analysis(
            message_id,
            analysis=analysis,
            recommendations=recommendations,
            mistral_reply=mistral_reply
        )
        
        # 6. SAUVEGARDER LA RÉPONSE
        assistant_doc = chat_repo.save_message_with_image(
            user_id=user_id,
            message_type="assistant",
            content=mistral_reply,
            analysis=analysis,
            recommendations=recommendations
        )
        
        return create_api_response({
            "user_message_id": message_id,
            "assistant_reply": mistral_reply,
            "analysis": analysis,
            "recommendations": recommendations,
        }), 201
    
    except Exception as e:
        print(f"ERREUR API /chat/message: {e}")
        return create_api_response({}, success=False, message=str(e)), 500


@app.route("/api/chat/history/<int:user_id>", methods=["GET"])
def get_chat_history(user_id: int):
    """
    Récupère l'historique complet du chat d'un utilisateur.
    Incluant les images, analyses et recommandations.
    """
    try:
        utilisateur = UtilisateursRepository().find_by_id(user_id)
        if not utilisateur:
            return create_api_response({}, success=False, message=MSG_UTILISATEUR_INTROUVABLE), 404
        
        chat_repo = ChatMessagesRepository()
        messages = chat_repo.get_chat_history(user_id)
        return create_api_response(messages)
    except Exception as e:
        print(f"ERREUR API /chat/history/{user_id}: {e}")
        return create_api_response([], success=False, message=str(e)), 500


@app.route("/api/chat/with-images/<int:user_id>", methods=["GET"])
def get_chat_messages_with_images(user_id: int):
    """
    Récupère seulement les messages qui ont des images attachées.
    """
    try:
        utilisateur = UtilisateursRepository().find_by_id(user_id)
        if not utilisateur:
            return create_api_response({}, success=False, message=MSG_UTILISATEUR_INTROUVABLE), 404
        
        chat_repo = ChatMessagesRepository()
        messages = chat_repo.get_messages_with_images(user_id)
        return create_api_response(messages)
    except Exception as e:
        print(f"ERREUR API /chat/with-images/{user_id}: {e}")
        return create_api_response([], success=False, message=str(e)), 500


@app.route("/api/chat/message/<message_id>", methods=["DELETE"])
def delete_chat_message(message_id: str):
    """
    Supprime un message du chat.
    """
    try:
        # Vérifier que l'utilisateur propriétaire du message le supprime
        user_id = request.args.get("user_id", type=int)
        if not user_id:
            return create_api_response({}, success=False, message="user_id requis"), 400
        
        utilisateur = UtilisateursRepository().find_by_id(user_id)
        if not utilisateur:
            return create_api_response({}, success=False, message=MSG_UTILISATEUR_INTROUVABLE), 404
        
        chat_repo = ChatMessagesRepository()
        if chat_repo.delete_message(message_id):
            return create_api_response({"id": message_id}, message="Message supprimé")
        else:
            return create_api_response({}, success=False, message="Message introuvable"), 404
    except Exception as e:
        print(f"ERREUR API DELETE /chat/message/{message_id}: {e}")
        return create_api_response({}, success=False, message=str(e)), 500


@app.route("/api/chat/history/<int:user_id>", methods=["DELETE"])
def clear_chat_history(user_id: int):
    """
    Supprime tout l'historique du chat d'un utilisateur.
    """
    try:
        utilisateur = UtilisateursRepository().find_by_id(user_id)
        if not utilisateur:
            return create_api_response({}, success=False, message=MSG_UTILISATEUR_INTROUVABLE), 404
        
        chat_repo = ChatMessagesRepository()
        chat_repo.clear_history(user_id)
        return create_api_response({}, message="Historique supprimé")
    except Exception as e:
        print(f"ERREUR API DELETE /chat/history/{user_id}: {e}")
        return create_api_response({}, success=False, message=str(e)), 500
