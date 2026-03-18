import time
from datetime import datetime

from flask import Flask, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from Repositories.ExerciceSessionsRepository import ExerciceSessionsRepository
from Repositories.DietRecommandationsRepository import DietRecommandationsRepository
from Repositories.DietRecommandationTypesRepository import DietRecommandationTypesRepository

# Charge les variables d'environnement depuis le fichier .env
load_dotenv()

# Initialisation de l'application Flask
app = Flask(__name__)

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
        repo = DietRecommendationsRepository()
        data = repo.getAll()
        return create_api_response(data)
    except Exception as e:
        print(f"❌ ERREUR API /nutrition/recommendations: {e}")
        return create_api_response([], success=False, message=str(e)), 500

@app.route("/api/nutrition/recommendations/<int:id>", methods=["DELETE"])
def delete_diet_recommendation(id):
    """Supprime une recommandation (Admin)."""
    try:
        repo = DietRecommendationsRepository()
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
        sessions = repo.getAll()
        
        # On adapte le format pour le frontend
        sessions_data = [
            {
                "id": f"S{s.id}",
                "date": "2024-05-20", # Le CSV n'a pas de date, on en met une fausse
                "type": s.workoutType, # Le repo ne joint pas le nom, on pourrait l'améliorer
                "duration": round(s.sessionDurationHours * 60),
                "caloriesBurned": s.caloriesBurned
            } for s in sessions[:50] # Limité pour la démo
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
            "totalCalories": 0, # A calculer si besoin
            "totalDuration": 0, # A calculer si besoin
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

# La route /api/sport/distribution existe déjà via /api/dashboard/sport-distribution
# On peut la réutiliser ou créer un alias si nécessaire.

# --- ROUTES POUR LA PAGE NUTRITION (PUBLIQUE) ---
@app.route("/api/nutrition/distribution", methods=["GET"])
def get_nutrition_distribution():
    """Retourne la distribution des régimes pour le dashboard public."""
    try:
        repo = DietRecommendationsRepository()
        data = repo.get_diet_distribution()
        return create_api_response(data)
    except Exception as e:
        print(f"❌ ERREUR API /nutrition/distribution: {e}")
        return create_api_response([], success=False, message=str(e)), 500

@app.route("/api/nutrition/stats", methods=["GET"])
def get_nutrition_stats_public():
    """Retourne les statistiques de nutrition pour le dashboard public."""
    try:
        repo = DietRecommendationsRepository()
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
                "id": p['id'],
                "name": p['name'],
                "description": f"Un plan de régime de type {p['name']} pour améliorer votre santé.",
                "targetAudience": "Tous publics"
            } for p in plans
        ]
        return create_api_response(plans_data)
    except Exception as e:
        print(f"❌ ERREUR API /nutrition/plans: {e}")
        return create_api_response([], success=False, message=str(e)), 500

if __name__ == "__main__":
    # Lance le serveur en mode debug sur le port 5000
    app.run(host="0.0.0.0", port=5000, debug=True)
