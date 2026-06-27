import os
from datetime import datetime, timezone

from flask import Flask, jsonify, request
from flask_cors import CORS
from dotenv import load_dotenv
from Repositories.ExerciceSessionsRepository import ExerciceSessionsRepository
from Repositories.DietRecommandationsRepository import DietRecommandationsRepository
from Repositories.DietRecommandationTypesRepository import DietRecommandationTypesRepository
from Repositories.UtilisateursRepository import UtilisateursRepository
from Repositories.UtilisateursAllergiesRepository import UtilisateursAllergiesRepository
from Repositories.UtilisateursPathologiesRepository import UtilisateursPathologiesRepository
from Repositories.UtilisateursBlessuresRepository import UtilisateursBlessuresRepository
from Repositories.ReferencesRepository import ReferencesRepository
from Repositories.CoachMessagesRepository import CoachMessagesRepository
from Services.sante_calculator import calculate_imc, get_imc_categorie, calculate_tdee, calculate_age_from_dob

MSG_UTILISATEUR_INTROUVABLE = "Utilisateur introuvable"
from Repositories.PublicationsRepository import PublicationsRepository
from Repositories.CommentairesRepository import CommentairesRepository
from Models.Utilisateur import Utilisateur
from Models.Publication import Publication
from Models.Commentaire import Commentaire
from Models.DietRecommandation import DietRecommandation

# Charge les variables d'environnement depuis le fichier .env
load_dotenv()

# Initialisation de l'application Flask
app = Flask(__name__)

# CORS restreint aux origines déclarées dans CORS_ALLOWED_ORIGINS
# Valeur par défaut : frontend Vite en développement local
_allowed_origins = os.getenv("CORS_ALLOWED_ORIGINS", "http://localhost:5173").split(",")
CORS(app, origins=_allowed_origins)


def create_api_response(data, success=True, message=""):
    """Crée une réponse API standardisée."""
    return jsonify({
        "data": data,
        "success": success,
        "message": message,
        "timestamp": datetime.now(timezone.utc).isoformat()
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
        sessions = repo.getAll()
        
        patients_data = []
        # On simule une liste de patients à partir des sessions (limité à 50 pour la démo)
        for i, session in enumerate(sessions[:50]):
            # Déterminer le risque basé sur le BMI
            risk = "None"
            if session.bmi > 30:
                risk = "Obesity"
            elif session.bmi > 25:
                risk = "Overweight"
            elif session.bmi < 18.5:
                risk = "Underweight"
            
            patients_data.append({
                "id": f"P{i+1}",
                "name": f"Patient {i+1}",
                "age": session.age,
                "gender": "Homme" if session.gender == 1 else "Femme",
                "weight": session.weightKg,
                "height": session.heightCm,
                "riskDisease": risk,
                "dietRecommendation": "Balanced"
            })
            
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
        sessions = repo.get_sessions_with_workout_names(limit=50)
        sessions_data = [
            {
                "id": f"S{row['id_exercice_sessions']}",
                "date": "2024-05-20",
                "type": row['workout_type_name'],
                "duration": round(row['session_duration_hours'] * 60),
                "caloriesBurned": row['calories_burned']
            } for row in sessions
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
        stats_data = {
            "totalSessions": kpis.get('totalPatients', 0),
            "totalCalories": round(kpis.get('totalCalories', 0) or 0),
            "totalDuration": round(kpis.get('totalDuration', 0) or 0),
            "averageDuration": round(kpis.get('avgSessionDuration', 0), 1),
            "averageCalories": round(kpis.get('avgCaloriesBurned', 0), 1)
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

# --- EVOLUTION FONCTIONNELLE : Recherche et filtres sur les sessions sport ---

@app.route("/api/sport/search", methods=["GET"])
def search_sport_sessions():
    """Recherche paginée avec filtres sur les sessions de sport.

    Paramètres de requête (tous optionnels) :
      - workout_type      : int   — ID du type de sport
      - experience_level  : int   — Niveau d'expérience (1, 2 ou 3)
      - min_calories      : float — Calories brûlées minimum
      - max_calories      : float — Calories brûlées maximum
      - page              : int   — Numéro de page (défaut : 1)
      - per_page          : int   — Résultats par page (défaut : 20, max : 100)
    """
    def _parse_int(value):
        try:
            return int(value) if value is not None else None
        except (ValueError, TypeError):
            return None

    def _parse_float(value):
        try:
            return float(value) if value is not None else None
        except (ValueError, TypeError):
            return None

    workout_type     = _parse_int(request.args.get("workout_type"))
    experience_level = _parse_int(request.args.get("experience_level"))
    min_calories     = _parse_float(request.args.get("min_calories"))
    max_calories     = _parse_float(request.args.get("max_calories"))
    page             = max(1, _parse_int(request.args.get("page")) or 1)
    per_page         = min(100, max(5, _parse_int(request.args.get("per_page")) or 20))

    try:
        repo = ExerciceSessionsRepository()
        result = repo.search(
            workout_type=workout_type,
            experience_level=experience_level,
            min_calories=min_calories,
            max_calories=max_calories,
            page=page,
            per_page=per_page,
        )
        return create_api_response(result)
    except Exception as e:
        print(f"❌ ERREUR API /sport/search: {e}")
        return create_api_response({}, success=False, message=str(e)), 500

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
    try:
        repo = DietRecommandationsRepository()
        stats = repo.get_nutrition_stats()
        stats_data = {
            "totalDietTypes": stats.get('totalDietTypes', 0),
            "activePlans": stats.get('activePlans', 0),
            "averageCaloriesPerDay": round(stats.get('averageCaloriesPerDay', 0) or 0, 1),
            "availableRecipes": stats.get('availableRecipes', 0)
        }
        return create_api_response(stats_data)
    except Exception as e:
        print(f"❌ ERREUR API /nutrition/stats: {e}")
        return create_api_response({}, success=False, message=str(e)), 500

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
                "id": p['id_diet_recommandation_types'],
                "name": p['name'],
                "description": f"Un plan de régime de type {p['name']} pour améliorer votre santé.",
                "targetAudience": "Tous publics"
            } for p in plans
        ]
        return create_api_response(plans_data)
    except Exception as e:
        print(f"❌ ERREUR API /nutrition/plans: {e}")
        return create_api_response([], success=False, message=str(e)), 500

# --- ROUTES AUTHENTIFICATION ---

@app.route("/api/auth/register", methods=["POST"])
def register():
    """Crée un nouveau compte utilisateur avec son profil santé optionnel."""
    body = request.get_json(silent=True) or {}
    nom = (body.get("nom") or "").strip()
    prenom = (body.get("prenom") or "").strip()
    pseudo = (body.get("pseudo") or "").strip()
    email = (body.get("email") or "").strip().lower()
    mot_de_passe = body.get("mot_de_passe") or ""

    if not all([nom, prenom, pseudo, email, mot_de_passe]):
        return create_api_response({}, success=False, message="Tous les champs sont requis"), 400

    try:
        repo = UtilisateursRepository()
        if repo.email_exists(email):
            return create_api_response({}, success=False, message="Cet email est déjà utilisé"), 409
        if repo.pseudo_exists(pseudo):
            return create_api_response({}, success=False, message="Ce pseudo est déjà pris"), 409

        nouvel_utilisateur = Utilisateur()
        nouvel_utilisateur.nom = nom
        nouvel_utilisateur.prenom = prenom
        nouvel_utilisateur.pseudo = pseudo
        nouvel_utilisateur.email = email
        nouvel_utilisateur.mot_de_passe = mot_de_passe
        nouvel_utilisateur.date_of_birth = body.get("date_of_birth")
        nouvel_utilisateur.height_cm = body.get("height_cm")
        nouvel_utilisateur.weight_kg = body.get("weight_kg")
        nouvel_utilisateur.id_gender = body.get("id_gender")
        nouvel_utilisateur.id_activity_level = body.get("id_activity_level")
        nouvel_utilisateur.experience_level = body.get("experience_level")
        nouvel_utilisateur.objectif = body.get("objectif")

        repo.create(nouvel_utilisateur)

        allergie_ids = body.get("allergie_ids") or []
        if allergie_ids:
            allergies_repo = UtilisateursAllergiesRepository()
            allergies_repo.replace_all(nouvel_utilisateur.id, allergie_ids)

        pathologie_ids = body.get("pathologie_ids") or []
        if pathologie_ids:
            pathologies_repo = UtilisateursPathologiesRepository()
            pathologies_repo.replace_all(nouvel_utilisateur.id, pathologie_ids)

        return create_api_response(nouvel_utilisateur.to_public_dict(), message="Compte créé avec succès"), 201
    except Exception as e:
        print(f"❌ ERREUR API /auth/register: {e}")
        return create_api_response({}, success=False, message=str(e)), 500


@app.route("/api/auth/login", methods=["POST"])
def login():
    """Vérifie les identifiants et retourne les données utilisateur."""
    body = request.get_json(silent=True) or {}
    email = (body.get("email") or "").strip().lower()
    mot_de_passe = body.get("mot_de_passe") or ""

    if not email or not mot_de_passe:
        return create_api_response({}, success=False, message="Email et mot de passe requis"), 400

    try:
        repo = UtilisateursRepository()
        utilisateur = repo.find_by_email(email)

        if not utilisateur or not repo.verify_password(utilisateur, mot_de_passe):
            return create_api_response({}, success=False, message="Identifiants incorrects"), 401

        return create_api_response(utilisateur.to_public_dict())
    except Exception as e:
        print(f"❌ ERREUR API /auth/login: {e}")
        return create_api_response({}, success=False, message=str(e)), 500


# --- ROUTES FORUM COMMUNAUTAIRE ---

@app.route("/api/publications", methods=["GET"])
def get_publications():
    """Retourne toutes les publications avec auteur et nb de commentaires."""
    try:
        repo = PublicationsRepository()
        return create_api_response(repo.getAll())
    except Exception as e:
        print(f"❌ ERREUR API GET /publications: {e}")
        return create_api_response([], success=False, message=str(e)), 500


@app.route("/api/publications", methods=["POST"])
def create_publication():
    """Crée une nouvelle publication."""
    body = request.get_json(silent=True) or {}
    libelle = (body.get("libelle") or "").strip()
    contenu = (body.get("contenu") or "").strip()
    id_utilisateurs = body.get("id_utilisateurs")

    if not contenu or not id_utilisateurs:
        return create_api_response({}, success=False, message="contenu et id_utilisateurs sont requis"), 400

    try:
        nouvelle_publication = Publication()
        nouvelle_publication.libelle = libelle or None
        nouvelle_publication.contenu = contenu
        nouvelle_publication.id_utilisateurs = id_utilisateurs

        repo = PublicationsRepository()
        repo.create(nouvelle_publication)
        publication_dict = repo.getById(nouvelle_publication.id)
        return create_api_response(publication_dict), 201
    except Exception as e:
        print(f"❌ ERREUR API POST /publications: {e}")
        return create_api_response({}, success=False, message=str(e)), 500


@app.route("/api/publications/<int:publication_id>", methods=["DELETE"])
def delete_publication(publication_id):
    """Supprime une publication (et ses commentaires via CASCADE)."""
    try:
        repo = PublicationsRepository()
        publication = repo.getById(publication_id)
        if not publication:
            return create_api_response({}, success=False, message="Publication introuvable"), 404
        repo.delete(publication_id)
        return create_api_response({"id": publication_id}, message="Publication supprimée")
    except Exception as e:
        print(f"❌ ERREUR API DELETE /publications/{publication_id}: {e}")
        return create_api_response({}, success=False, message=str(e)), 500


@app.route("/api/publications/<int:publication_id>/commentaires", methods=["GET"])
def get_commentaires(publication_id):
    """Retourne tous les commentaires d'une publication (liste plate triée par date)."""
    try:
        repo = CommentairesRepository()
        return create_api_response(repo.get_by_publication(publication_id))
    except Exception as e:
        print(f"❌ ERREUR API GET /publications/{publication_id}/commentaires: {e}")
        return create_api_response([], success=False, message=str(e)), 500


@app.route("/api/publications/<int:publication_id>/commentaires", methods=["POST"])
def create_commentaire(publication_id):
    """Ajoute un commentaire (ou une réponse à un commentaire) sur une publication."""
    body = request.get_json(silent=True) or {}
    contenu = (body.get("contenu") or "").strip()
    id_utilisateurs = body.get("id_utilisateurs")
    id_commentaires_parent = body.get("id_commentaires_parent")  # None = commentaire racine

    if not contenu or not id_utilisateurs:
        return create_api_response({}, success=False, message="contenu et id_utilisateurs sont requis"), 400

    try:
        nouveau_commentaire = Commentaire()
        nouveau_commentaire.contenu = contenu
        nouveau_commentaire.id_publications = publication_id
        nouveau_commentaire.id_utilisateurs = id_utilisateurs
        nouveau_commentaire.id_commentaires_parent = id_commentaires_parent

        repo = CommentairesRepository()
        repo.create(nouveau_commentaire)

        tous_les_commentaires = repo.get_by_publication(publication_id)
        nouveau = next((c for c in tous_les_commentaires if c["id"] == nouveau_commentaire.id), None)
        return create_api_response(nouveau), 201
    except Exception as e:
        print(f"❌ ERREUR API POST /publications/{publication_id}/commentaires: {e}")
        return create_api_response({}, success=False, message=str(e)), 500


# --- ROUTES ADMIN ---

@app.route("/api/admin/patients", methods=["GET"])
def get_admin_patients():
    """Retourne les patients (diet_recommendations) paginés pour l'admin."""
    page = max(1, int(request.args.get("page", 1)))
    per_page = min(100, max(10, int(request.args.get("per_page", 50))))
    try:
        repo = DietRecommandationsRepository()
        total = repo.count()
        items = repo.getPage(page, per_page)
        return create_api_response({
            "items": items,
            "total": total,
            "page": page,
            "per_page": per_page,
            "total_pages": max(1, -(-total // per_page)),
        })
    except Exception as e:
        print(f"❌ ERREUR API GET /admin/patients: {e}")
        return create_api_response({}, success=False, message=str(e)), 500


@app.route("/api/admin/nutrition", methods=["GET"])
def get_admin_nutrition():
    """Retourne les recommandations nutritionnelles paginées pour l'admin."""
    page = max(1, int(request.args.get("page", 1)))
    per_page = min(100, max(10, int(request.args.get("per_page", 50))))
    try:
        repo = DietRecommandationsRepository()
        total = repo.count()
        items = repo.getPage(page, per_page)
        return create_api_response({
            "items": items,
            "total": total,
            "page": page,
            "per_page": per_page,
            "total_pages": max(1, -(-total // per_page)),
        })
    except Exception as e:
        print(f"❌ ERREUR API GET /admin/nutrition: {e}")
        return create_api_response({}, success=False, message=str(e)), 500


@app.route("/api/admin/reference-data", methods=["GET"])
def get_reference_data():
    """Retourne toutes les données de référence pour les menus déroulants."""
    try:
        from Repositories.IdNameGenericRepository import IdNameGenericRepository
        repo = IdNameGenericRepository()
        return create_api_response({
            "genders":               repo.readAllIdName("genders"),
            "disease_types":         repo.readAllIdName("disease_types"),
            "severity_types":        repo.readAllIdName("severity_types"),
            "diet_types":            repo.readAllIdName("diet_recommandation_types"),
            "activity_levels":       repo.readAllIdName("physical_activity_levels"),
            "dietary_restrictions":  repo.readAllIdName("dietary_restrictions"),
            "allergies":             repo.readAllIdName("allergies"),
            "cuisine_types":         repo.readAllIdName("preferred_cuisine_types"),
        })
    except Exception as e:
        print(f"❌ ERREUR API GET /admin/reference-data: {e}")
        return create_api_response({}, success=False, message=str(e)), 500


@app.route("/api/admin/nutrition", methods=["POST"])
def create_admin_nutrition():
    """Crée une nouvelle recommandation nutritionnelle."""
    body = request.get_json(silent=True) or {}
    try:
        d = DietRecommandation()
        d.age = body.get("age")
        d.gender = body.get("gender")
        d.height_cm = body.get("height_cm")
        d.current_weight_kg = body.get("current_weight_kg")
        d.bmi = body.get("bmi")
        d.disease_type = body.get("disease_type")
        d.severity = body.get("severity")
        d.diet_recommandation = body.get("diet_recommendation")
        d.daily_caloric_target = body.get("daily_caloric_target")
        d.activity_level = body.get("activity_level")
        d.cholesterol_mg = body.get("cholesterol_mg")
        d.blood_pressure_mmhg = body.get("blood_pressure_mmhg")
        d.glucose_mg_dl = body.get("glucose_mg_dl")
        d.dietary_restrictions = body.get("dietary_restrictions")
        d.allergy = body.get("allergy")
        d.preferred_cuisine = body.get("preferred_cuisine")
        d.weekly_exercise_hours = body.get("weekly_exercise_hours")
        d.adherence_to_diet_plan = body.get("adherence_to_diet_plan")
        d.dietary_nutrient_imbalance_score = body.get("dietary_nutrient_imbalance_score")

        repo = DietRecommandationsRepository()
        repo.create(d)
        created = repo.getById(d.id)
        return create_api_response(created), 201
    except Exception as e:
        print(f"❌ ERREUR API POST /admin/nutrition: {e}")
        return create_api_response({}, success=False, message=str(e)), 500


@app.route("/api/admin/nutrition/<int:rec_id>", methods=["PUT"])
def update_admin_nutrition(rec_id):
    """Met à jour une recommandation nutritionnelle."""
    body = request.get_json(silent=True) or {}
    try:
        repo = DietRecommandationsRepository()
        existing = repo.getById(rec_id)
        if not existing:
            return create_api_response({}, success=False, message="Recommandation introuvable"), 404

        d = DietRecommandation()
        d.age = body.get("age", existing["age"])
        d.gender = body.get("gender", existing["gender"])
        d.height_cm = body.get("height_cm", existing["height_cm"])
        d.current_weight_kg = body.get("current_weight_kg", existing["current_weight_kg"])
        d.bmi = body.get("bmi", existing["bmi"])
        d.disease_type = body.get("disease_type", existing["disease_type"])
        d.severity = body.get("severity", existing["severity"])
        d.diet_recommandation = body.get("diet_recommendation", existing["diet_recommendation"])
        d.daily_caloric_target = body.get("daily_caloric_target", existing["daily_caloric_target"])
        d.activity_level = body.get("activity_level", existing["activity_level"])
        d.cholesterol_mg = body.get("cholesterol_mg", existing["cholesterol_mg"])
        d.blood_pressure_mmhg = body.get("blood_pressure_mmhg", existing["blood_pressure_mmhg"])
        d.glucose_mg_dl = body.get("glucose_mg_dl", existing["glucose_mg_dl"])
        d.dietary_restrictions = body.get("dietary_restrictions", existing["dietary_restrictions"])
        d.allergy = body.get("allergy", existing["allergy"])
        d.preferred_cuisine = body.get("preferred_cuisine", existing["preferred_cuisine"])
        d.weekly_exercise_hours = body.get("weekly_exercise_hours", existing["weekly_exercise_hours"])
        d.adherence_to_diet_plan = body.get("adherence_to_diet_plan", existing["adherence_to_diet_plan"])
        d.dietary_nutrient_imbalance_score = body.get("dietary_nutrient_imbalance_score", existing["dietary_nutrient_imbalance_score"])

        repo.update(rec_id, d)
        return create_api_response(repo.getById(rec_id), message="Recommandation mise à jour")
    except Exception as e:
        print(f"❌ ERREUR API PUT /admin/nutrition/{rec_id}: {e}")
        return create_api_response({}, success=False, message=str(e)), 500


@app.route("/api/admin/nutrition/<int:rec_id>", methods=["DELETE"])
def delete_admin_nutrition(rec_id):
    """Supprime une recommandation nutritionnelle."""
    try:
        repo = DietRecommandationsRepository()
        if not repo.getById(rec_id):
            return create_api_response({}, success=False, message="Recommandation introuvable"), 404
        repo.delete(rec_id)
        return create_api_response({"id": rec_id}, message="Recommandation supprimée")
    except Exception as e:
        print(f"❌ ERREUR API DELETE /admin/nutrition/{rec_id}: {e}")
        return create_api_response({}, success=False, message=str(e)), 500


# --- ROUTES PROFIL UTILISATEUR ---

@app.route("/api/profile/<int:user_id>", methods=["GET"])
def get_profil_sante(user_id):
    """Retourne le profil santé complet avec IMC, TDEE, allergies, pathologies et blessures."""
    try:
        utilisateur = UtilisateursRepository().find_by_id(user_id)
        if not utilisateur:
            return create_api_response({}, success=False, message=MSG_UTILISATEUR_INTROUVABLE), 404

        profil = utilisateur.to_public_dict()

        imc = None
        imc_categorie = None
        tdee_kcal = None

        if utilisateur.weight_kg and utilisateur.height_cm:
            imc = calculate_imc(utilisateur.weight_kg, utilisateur.height_cm)
            imc_categorie = get_imc_categorie(imc)

        age_calcule = calculate_age_from_dob(utilisateur.date_of_birth) if utilisateur.date_of_birth else None

        if utilisateur.weight_kg and utilisateur.height_cm and age_calcule and utilisateur.id_gender and utilisateur.id_activity_level:
            tdee_kcal = calculate_tdee(
                utilisateur.weight_kg, utilisateur.height_cm,
                age_calcule, utilisateur.id_gender, utilisateur.id_activity_level
            )

        allergies = UtilisateursAllergiesRepository().find_by_user(user_id)
        pathologies = UtilisateursPathologiesRepository().find_by_user(user_id)
        blessures = UtilisateursBlessuresRepository().find_by_user(user_id)

        return create_api_response({
            "profil": profil,
            "age": age_calcule,
            "imc": imc,
            "imc_categorie": imc_categorie,
            "tdee_kcal": tdee_kcal,
            "allergies": allergies,
            "pathologies": pathologies,
            "blessures": blessures,
        })
    except Exception as e:
        print(f"❌ ERREUR API GET /profile/{user_id}: {e}")
        return create_api_response({}, success=False, message=str(e)), 500

@app.route("/api/profile/<int:user_id>/sante", methods=["PUT"])
def update_sante_utilisateur(user_id):
    """Met à jour les données de santé d'un utilisateur."""
    body = request.get_json(silent=True) or {}
    try:
        repo = UtilisateursRepository()
        if not repo.find_by_id(user_id):
            return create_api_response({}, success=False, message=MSG_UTILISATEUR_INTROUVABLE), 404

        repo.update_profil_sante(
            user_id,
            body.get("date_of_birth"),
            body.get("height_cm"),
            body.get("weight_kg"),
            body.get("id_gender"),
            body.get("id_activity_level"),
            body.get("experience_level"),
            body.get("objectif"),
        )

        allergie_ids = body.get("allergie_ids")
        if allergie_ids is not None:
            UtilisateursAllergiesRepository().replace_all(user_id, allergie_ids)

        pathologie_ids = body.get("pathologie_ids")
        if pathologie_ids is not None:
            UtilisateursPathologiesRepository().replace_all(user_id, pathologie_ids)

        utilisateur_updated = repo.find_by_id(user_id)
        return create_api_response(utilisateur_updated.to_public_dict(), message="Profil santé mis à jour")
    except Exception as e:
        print(f"❌ ERREUR API PUT /profile/{user_id}/sante: {e}")
        return create_api_response({}, success=False, message=str(e)), 500


@app.route("/api/references/sante", methods=["GET"])
def get_sante_references():
    """Retourne les listes de référence pour le profil santé."""
    try:
        ref = ReferencesRepository()
        return create_api_response({
            "allergies": ref.get_allergies(),
            "disease_types": ref.get_disease_types(),
            "genders": ref.get_genders(),
            "activity_levels": ref.get_activity_levels(),
        })
    except Exception as e:
        print(f"❌ ERREUR API GET /references/sante: {e}")
        return create_api_response({}, success=False, message=str(e)), 500


@app.route("/api/utilisateurs/<int:user_id>", methods=["PUT"])
def update_utilisateur(user_id):
    """Met à jour le nom, prénom et email d'un utilisateur."""
    body = request.get_json(silent=True) or {}
    nom = (body.get("nom") or "").strip()
    prenom = (body.get("prenom") or "").strip()
    email = (body.get("email") or "").strip().lower()

    if not all([nom, prenom, email]):
        return create_api_response({}, success=False, message="nom, prenom et email sont requis"), 400

    try:
        repo = UtilisateursRepository()
        utilisateur = repo.find_by_id(user_id)
        if not utilisateur:
            return create_api_response({}, success=False, message=MSG_UTILISATEUR_INTROUVABLE), 404
        if repo.email_exists_for_other(email, user_id):
            return create_api_response({}, success=False, message="Cet email est déjà utilisé"), 409

        repo.update_info(user_id, nom, prenom, email)
        utilisateur.nom = nom
        utilisateur.prenom = prenom
        utilisateur.email = email
        return create_api_response(utilisateur.to_public_dict(), message="Profil mis à jour")
    except Exception as e:
        print(f"❌ ERREUR API PUT /utilisateurs/{user_id}: {e}")
        return create_api_response({}, success=False, message=str(e)), 500


@app.route("/api/utilisateurs/<int:user_id>/password", methods=["PUT"])
def update_utilisateur_password(user_id):
    """Vérifie l'ancien mot de passe et enregistre le nouveau hashé."""
    body = request.get_json(silent=True) or {}
    ancien_mot_de_passe = body.get("ancien_mot_de_passe") or ""
    nouveau_mot_de_passe = body.get("nouveau_mot_de_passe") or ""

    if not ancien_mot_de_passe or not nouveau_mot_de_passe:
        return create_api_response({}, success=False, message="Les deux mots de passe sont requis"), 400
    if len(nouveau_mot_de_passe) < 6:
        return create_api_response({}, success=False, message="Le nouveau mot de passe doit faire au moins 6 caractères"), 400

    try:
        repo = UtilisateursRepository()
        utilisateur = repo.find_by_id(user_id)
        if not utilisateur:
            return create_api_response({}, success=False, message=MSG_UTILISATEUR_INTROUVABLE), 404
        if not repo.verify_password(utilisateur, ancien_mot_de_passe):
            return create_api_response({}, success=False, message="Mot de passe actuel incorrect"), 401

        repo.update_password(user_id, nouveau_mot_de_passe)
        return create_api_response({}, message="Mot de passe mis à jour")
    except Exception as e:
        print(f"❌ ERREUR API PUT /utilisateurs/{user_id}/password: {e}")
        return create_api_response({}, success=False, message=str(e)), 500


MISTRAL_SYSTEM_PROMPT = """Tu es un coach sportif et nutritionnel personnalisé intégré à l'application Santé & Fit.
Tu fournis des conseils courts, bienveillants et adaptés au profil de l'utilisateur.
Réponds toujours en français. Maximum 150 mots par réponse."""


@app.route("/api/coach/chat", methods=["POST"])
def coach_chat():
    """Envoie un message au Coach IA Mistral et retourne sa réponse."""
    body = request.get_json(silent=True) or {}
    user_message = (body.get("message") or "").strip()
    user_id = body.get("user_id")

    if not user_message:
        return create_api_response({}, success=False, message="Message requis"), 400

    mistral_api_key = os.getenv("MISTRAL_API_KEY", "")
    if not mistral_api_key:
        return create_api_response({}, success=False, message="MISTRAL_API_KEY non configurée"), 503

    try:
        import requests as http_requests

        system_prompt = MISTRAL_SYSTEM_PROMPT
        if user_id:
            profil = UtilisateursRepository().find_by_id(int(user_id))
            if profil and profil.weight_kg and profil.height_cm:
                imc = calculate_imc(profil.weight_kg, profil.height_cm)
                system_prompt += f"\n\nProfil utilisateur : IMC {imc} ({get_imc_categorie(imc)}), objectif : {profil.objectif or 'non renseigné'}, expérience : niveau {profil.experience_level or 'non renseigné'}."

        mistral_response = http_requests.post(
            "https://api.mistral.ai/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {mistral_api_key}",
                "Content-Type": "application/json",
            },
            json={
                "model": os.getenv("MISTRAL_MODEL", "mistral-small-latest"),
                "messages": [
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_message},
                ],
            },
            timeout=30,
        )
        mistral_response.raise_for_status()
        reply = mistral_response.json()["choices"][0]["message"]["content"]

        if user_id:
            coach_repo = CoachMessagesRepository()
            coach_repo.save_message(int(user_id), "user", user_message)
            coach_repo.save_message(int(user_id), "assistant", reply)

        return create_api_response({"reply": reply})
    except Exception as e:
        print(f"❌ ERREUR API /coach/chat: {e}")
        return create_api_response({}, success=False, message=str(e)), 500


@app.route("/api/coach/history/<int:user_id>", methods=["GET"])
def get_coach_history(user_id):
    """Retourne l'historique des messages du Coach IA pour un utilisateur."""
    try:
        messages = CoachMessagesRepository().find_by_user(user_id)
        return create_api_response(messages)
    except Exception as e:
        print(f"❌ ERREUR API GET /coach/history/{user_id}: {e}")
        return create_api_response({}, success=False, message=str(e)), 500


@app.route("/api/coach/history/<int:user_id>", methods=["DELETE"])
def clear_coach_history(user_id):
    """Efface l'historique des messages du Coach IA pour un utilisateur."""
    try:
        CoachMessagesRepository().clear_history(user_id)
        return create_api_response({}, message="Historique effacé")
    except Exception as e:
        print(f"❌ ERREUR API DELETE /coach/history/{user_id}: {e}")
        return create_api_response({}, success=False, message=str(e)), 500


if __name__ == "__main__":
    # FLASK_HOST vaut "0.0.0.0" dans Docker (nécessaire pour exposer le port du conteneur)
    # et "127.0.0.1" en développement local pour limiter l'exposition réseau
    flask_host = os.getenv("FLASK_HOST", "127.0.0.1")
    app.run(host=flask_host, port=5000, debug=True)
