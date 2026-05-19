import time
from datetime import datetime
import os
from werkzeug.utils import secure_filename

from flask import Flask, jsonify
from flask import Flask, jsonify, request
from flask_cors import CORS
from dotenv import load_dotenv
from Repositories.ExerciceSessionsRepository import ExerciceSessionsRepository
from Repositories.DietRecommandationsRepository import DietRecommandationsRepository
from Repositories.DietRecommandationTypesRepository import DietRecommandationTypesRepository
from Repositories.DailyFoodsRepository import DailyFoodsRepository

# Charge les variables d'environnement depuis le fichier .env
load_dotenv()

# Initialisation de l'application Flask
app = Flask(__name__)

# Dossier de stockage pour les images/vidéos du forum
UPLOAD_FOLDER = 'uploads/forum'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Configuration de CORS pour autoriser les requêtes depuis le frontend
# Permet à http://localhost:5173 de communiquer avec http://localhost:5000
CORS(app)


def create_api_response(data, success=True, message=""):
    """Crée une réponse API standardisée."""
    return jsonify({
        "data": data,
        "success": success,
        "message": message,
        "timestamp": datetime.utcnow().isoformat() + "Z"
    })


# --- ROUTES DE BASE ---

@app.route("/api/health", methods=["GET"])
def health_check():
    """
    Endpoint de santé pour que le frontend puisse vérifier si le backend est en ligne.
    """
    return jsonify({"status": "ok"}), 200


# --- ROUTES POUR LE DASHBOARD ---

@app.route("/api/dashboard/kpis", methods=["GET"])
def get_dashboard_kpis():
    """Retourne les KPIs pour le dashboard."""
    try:
        repo = ExerciceSessionsRepository() # Le repo gère sa propre connexion
        kpis_data = repo.get_kpis()

        # Formattage des résultats
        kpis_data['avgCaloriesBurned'] = round(kpis_data.get('avgCaloriesBurned') or 0, 1)
        kpis_data['avgSessionDuration'] = round(kpis_data.get('avgSessionDuration') or 0, 1)

        # L'alerte santé reste une valeur à définir selon vos règles
        kpis_data['healthAlerts'] = 5 

        return create_api_response(kpis_data)
    except Exception as e:
        print(f"❌ ERREUR API /dashboard/kpis: {e}")
        return create_api_response({}, success=False, message=str(e)), 500


@app.route("/api/dashboard/sport-distribution", methods=["GET"])
def get_sport_distribution():
    """Retourne la distribution des sessions de sport."""
    try:
        repo = ExerciceSessionsRepository()
        distribution_data = repo.get_sport_distribution()
        return create_api_response(distribution_data)
    except Exception as e:
        print(f"❌ ERREUR API /dashboard/sport-distribution: {e}")
        return create_api_response([], success=False, message=str(e)), 500


@app.route("/api/dashboard/weight-evolution", methods=["GET"])
def get_weight_evolution():
    """Retourne l'évolution du poids."""
    try:
        repo = ExerciceSessionsRepository()
        raw_data = repo.get_weight_by_experience()
        
        # Transformation des données pour le frontend
        # On utilise le niveau d'expérience comme "temps" ou "catégorie"
        formatted_data = []
        for row in raw_data:
            formatted_data.append({
                "month": f"Niveau {row['experience_level']}", # On réutilise la clé 'month' pour l'axe X
                "averageWeight": round(row['averageWeight'], 1)
            })
            
        return create_api_response(formatted_data)
    except Exception as e:
        print(f"❌ ERREUR API /dashboard/weight-evolution: {e}")
        return create_api_response([], success=False, message=str(e)), 500

# --- ROUTES ADMIN / NUTRITION ---

@app.route("/api/nutrition/recommendations", methods=["GET"])
def get_diet_recommendations():
    """Récupère la liste des recommandations (Admin)."""
    try:
        repo = DietRecommandationsRepository()
        data = repo.getAll()
        return create_api_response(data)
    except Exception as e:
        print(f"❌ ERREUR API /nutrition/recommendations: {e}")
        return create_api_response([], success=False, message=str(e)), 500

@app.route("/api/nutrition/recommendations/<int:id>", methods=["DELETE"])
def delete_diet_recommendation(id):
    """Supprime une recommandation (Admin)."""
    try:
        repo = DietRecommandationsRepository()
        success = repo.delete(id)
        if success:
            return create_api_response({"id": id}, message="Supprimé avec succès")
        else:
            return create_api_response({}, success=False, message="Non trouvé"), 404
    except Exception as e:
        print(f"❌ ERREUR API /nutrition/recommendations/DELETE: {e}")
        return create_api_response({}, success=False, message=str(e)), 500

# --- ROUTES POUR LES PATIENTS ---

@app.route("/api/patients", methods=["GET"])
def get_patients():
    """Retourne une liste simplifiée de 'patients' basée sur les sessions d'exercice."""
    try:
        repo = ExerciceSessionsRepository()
        patients_data = repo.get_patients_summary(limit=50)
        return create_api_response(patients_data)
    except Exception as e:
        print(f"❌ ERREUR API /patients: {e}")
        return create_api_response([], success=False, message=str(e)), 500

@app.route("/api/patients/stats", methods=["GET"])
def get_patient_stats():
    """Retourne les statistiques des patients."""
    try:
        repo = ExerciceSessionsRepository()
        sessions = repo.getAll()
        stats_data = {
            "totalPatients": len(sessions),
            "patientsWithRisk": sum(1 for s in sessions if s.bmi > 25),
            "averageAge": round(sum(s.age for s in sessions) / len(sessions)) if sessions else 0,
            "averageWeight": round(sum(s.weightKg for s in sessions) / len(sessions), 1) if sessions else 0
        }
        return create_api_response(stats_data)
    except Exception as e:
        print(f"❌ ERREUR API /patients/stats: {e}")
        return create_api_response({}, success=False, message=str(e)), 500

# --- ROUTES POUR LA PAGE SPORT ---

@app.route("/api/sport/sessions", methods=["GET"])
def get_sport_sessions():
    """Retourne les sessions de sport (similaire à la page patients)."""
    try:
        repo = ExerciceSessionsRepository()
        sessions = repo.get_sessions_with_types(limit=50)
        
        # On adapte le format pour le frontend
        sessions_data = [
            {
                "id": f"S{s['id']}",
                "date": "2024-05-20", # Le CSV n'a pas de date, on en met une fausse
                "type": s['activity_name'],
                "duration": round(s['session_duration_hours'] * 60),
                "caloriesBurned": s['calories_burned']
            } for s in sessions
        ]
        return create_api_response(sessions_data)
    except Exception as e:
        print(f"❌ ERREUR API /sport/sessions: {e}")
        return create_api_response([], success=False, message=str(e)), 500

@app.route("/api/sport/stats", methods=["GET"])
def get_sport_stats():
    """Retourne les statistiques de sport."""
    try:
        repo = ExerciceSessionsRepository()
        kpis = repo.get_kpis()

        total_sessions = kpis.get('totalPatients', 0)
        avg_calories = kpis.get('avgCaloriesBurned', 0)
        avg_duration_hours = kpis.get('avgSessionDuration', 0)

        stats_data = {
            "totalSessions": total_sessions,
            "totalCalories": round(total_sessions * avg_calories),
            "totalDuration": round(total_sessions * avg_duration_hours * 60),
            "averageDuration": round(avg_duration_hours * 60, 1),
            "averageCalories": round(avg_calories, 1)
        }
        return create_api_response(stats_data)
    except Exception as e:
        print(f"❌ ERREUR API /sport/stats: {e}")
        return create_api_response({}, success=False, message=str(e)), 500

@app.route("/api/sport/distribution", methods=["GET"])
def get_sport_distribution_direct():
    """Retourne la distribution des sports (alias de /dashboard/sport-distribution)."""
    try:
        repo = ExerciceSessionsRepository()
        distribution_data = repo.get_sport_distribution()
        return create_api_response(distribution_data)
    except Exception as e:
        print(f"❌ ERREUR API /sport/distribution: {e}")
        return create_api_response([], success=False, message=str(e)), 500

# La route /api/sport/distribution existe déjà via /api/dashboard/sport-distribution
# On peut la réutiliser ou créer un alias si nécessaire.

# --- ROUTES POUR LA PAGE NUTRITION (PUBLIQUE) ---
@app.route("/api/nutrition/distribution", methods=["GET"])
def get_nutrition_distribution():
    """Retourne la distribution des régimes pour le dashboard public."""
    try:
        repo = DietRecommandationsRepository()
        data = repo.get_diet_distribution()
        return create_api_response(data)
    except Exception as e:
        print(f"❌ ERREUR API /nutrition/distribution: {e}")
        return create_api_response([], success=False, message=str(e)), 500

@app.route("/api/nutrition/stats", methods=["GET"])
def get_nutrition_stats_public():
    """Retourne les statistiques de nutrition pour le dashboard public."""
    diet_repo = None
    food_repo = None
    try:
        diet_repo = DietRecommandationsRepository()
        food_repo = DailyFoodsRepository()

        # On récupère les stats depuis le repo des recommandations
        stats = diet_repo.get_nutrition_stats() or {}
        # On récupère le nombre de recettes depuis le repo des aliments
        # Utilisation de getAll() puis len() car count() n'existe peut-être pas dans le repository de base
        foods = food_repo.getAll()
        recipe_count = len(foods) if foods else 0

        stats_data = {
            "totalDietTypes": stats.get('totalDietTypes', 0),
            "activePlans": stats.get('activePlans', 0),
            "averageCaloriesPerDay": round(stats.get('averageCaloriesPerDay', 0) or 0, 1),
            "availableRecipes": recipe_count # On injecte la bonne valeur ici
        }
        return create_api_response(stats_data)
    except Exception as e:
        print(f"❌ ERREUR API /nutrition/stats: {e}")
        return create_api_response({}, success=False, message=str(e)), 500
    finally:
        if diet_repo: diet_repo.close()
        if food_repo: food_repo.close()

@app.route("/api/nutrition/plans", methods=["GET"])
def get_nutrition_plans():
    """Retourne les types de régimes disponibles."""
    try:
        repo = DietRecommandationTypesRepository()
        plans = repo.getAll()
        # Le frontend attend un format spécifique : { id, name, description, targetAudience }
        # Nous adaptons nos données à ce format.
        plans_data = [
            {
                "id": p['id'],
                "name": p['name'],
                "description": f"Un plan de régime de type {p['name']} pour améliorer votre santé.",
                "targetAudience": "Tous publics",
                # Ajout des données de repas que le frontend attend pour éviter le crash
                "meals": {
                    "breakfast": "Flocons d'avoine, fruits rouges et noix.",
                    "lunch": "Salade de quinoa avec poulet grillé et légumes.",
                    "dinner": "Soupe de lentilles corail et une tranche de pain complet."
                }
            } for p in plans
        ]
        return create_api_response(plans_data)
    except Exception as e:
        print(f"❌ ERREUR API /nutrition/plans: {e}")
        return create_api_response([], success=False, message=str(e)), 500

# --- ROUTES POUR LE FORUM ---

@app.route("/api/forum/posts", methods=["POST"])
def create_forum_post():
    """Crée un post sur le forum avec texte et média (image/vidéo)."""
    try:
        content = request.form.get('content')
        user_id = request.form.get('user_id', 'Anonyme')
        file = request.files.get('media')
        
        media_url = None
        if file:
            filename = secure_filename(f"{int(time.time())}_{file.filename}")
            file.save(os.path.join(UPLOAD_FOLDER, filename))
            media_url = f"/uploads/forum/{filename}"

        # Simulation d'enregistrement (à lier à un Repository plus tard)
        print(f"Nouveau post de {user_id}: {content}")
        
        return create_api_response({"status": "Success", "media_url": media_url})
    except Exception as e:
        print(f"❌ ERREUR API /forum/posts: {e}")
        return create_api_response({}, success=False, message=str(e)), 500

if __name__ == "__main__":
    # Lance le serveur en mode debug sur le port 5000
    app.run(host="0.0.0.0", port=5000, debug=True)
