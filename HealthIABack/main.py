import csv
import os
from dotenv import load_dotenv

# Charge les variables d'environnement depuis le fichier .env
load_dotenv()

from Models.ExerciceSession import ExerciseSession
from Models.DietRecommendation import DietRecommendation
from Repositories.ExerciceSessionsRepository import ExerciceSessionsRepository
from Repositories.BaseRepository import BaseRepository
from Repositories.DietRecommendationsRepository import DietRecommendationsRepository
from Repositories.GenericReferenceRepository import GenericReferenceRepository

def safe_int(value, default=0):
    """Convertit une valeur en int de manière sécurisée (gère '34.0' et les vides)."""
    try:
        if not value or value.strip() == '':
            return default
        # int(float("34.0")) fonctionne, alors que int("34.0") plante
        return int(float(value))
    except (ValueError, TypeError):
        return default

def safe_float(value, default=0.0):
    """Convertit une valeur en float de manière sécurisée."""
    try:
        if not value or value.strip() == '':
            return default
        return float(value)
    except (ValueError, TypeError):
        return default

def get_or_create_id(repo, cache, name):
    """Récupère l'ID depuis le cache ou crée l'entrée en base si elle n'existe pas."""
    if not name:
        return None
    
    clean_name = name.strip()
    if clean_name in cache:
        return cache[clean_name]
    
    # Création si n'existe pas
    new_id = repo.create(clean_name)
    cache[clean_name] = new_id
    return new_id

def import_exercise_sessions(csv_path):
    """
    Lit un fichier CSV et importe les données dans la table exercice_sessions.
    """
    if not os.path.exists(csv_path):
        print(f"❌ Fichier introuvable : {csv_path}")
        return

    repo = None
    count = 0
    
    print(f"🔄 Début de l'importation depuis {csv_path}...")
    
    try:
        repo = ExerciceSessionsRepository()
        gender_repo = GenericReferenceRepository('genders')
        workout_repo = GenericReferenceRepository('workout_types')

        # Pré-chargement des caches pour éviter de requêter la DB à chaque ligne
        genders_cache = {item['name']: item['id'] for item in gender_repo.getAll()}
        workouts_cache = {item['name']: item['id'] for item in workout_repo.getAll()}

        print("🗑️  Vidage de la table existante...")
        repo.truncate()

        with open(csv_path, mode='r', encoding='utf-8') as csvfile:
            reader = csv.DictReader(csvfile)
            
            for row in reader:
                # Création de l'objet modèle
                session = ExerciseSession()
                
                # Mapping des colonnes CSV vers l'objet (Adaptez les clés selon vos CSV !)
                # Utilisation des fonctions safe_ pour éviter les crashs sur les données vides
                session.age = safe_int(row.get('Age'))
                
                # Gestion intelligente des Foreign Keys (Texte -> ID)
                gender_str = row.get('Gender', 'Other') or 'Other'
                session.gender = get_or_create_id(gender_repo, genders_cache, gender_str)
                
                session.weightKg = safe_float(row.get('Weight (kg)'))
                session.heightCm = safe_float(row.get('Height (m)')) * 100 # Conversion m en cm
                session.maxBPM = safe_int(row.get('Max_BPM'))
                session.avgBPM = safe_int(row.get('Avg_BPM'))
                session.restingBPM = safe_int(row.get('Resting_BPM'))
                session.sessionDurationHours = safe_float(row.get('Session_Duration (hours)'))
                session.caloriesBurned = safe_float(row.get('Calories_Burned'))
                
                # Gestion intelligente des Foreign Keys (Texte -> ID)
                workout_str = row.get('Workout_Type', 'Cardio') or 'Cardio'
                session.workoutType = get_or_create_id(workout_repo, workouts_cache, workout_str)
                
                session.fatPercentage = safe_float(row.get('Fat_Percentage'))
                session.waterIntakeLiters = safe_float(row.get('Water_Intake (liters)'))
                session.workoutFrequency = safe_int(row.get('Workout_Frequency (days/week)'))
                session.experienceLevel = safe_int(row.get('Experience_Level'))
                session.bmi = safe_float(row.get('BMI'))

                # Insertion en base
                repo.create(session)
                count += 1
                
                if count % 10 == 0:
                    print(f"   -> {count} lignes importées...", end='\r')

        print(f"\n✅ Importation terminée ! {count} sessions ajoutées.")
        
    except Exception as e:
        print(f"\n❌ Erreur lors de l'importation : {e}")
    finally:
        if repo: repo.close()
        if gender_repo: gender_repo.close()
        if workout_repo: workout_repo.close()
        print("   -> Tâche 'import_exercise_sessions' terminée.")

def import_diet_recommendations(csv_path):
    """Importe les données de nutrition (Source 2)."""
    if not os.path.exists(csv_path):
        print(f"❌ Fichier introuvable : {csv_path}")
        return

    print(f"🔄 Début de l'importation Nutrition depuis {csv_path}...")
    
    repo = None
    
    # Initialisation des repos génériques pour les clés étrangères
    refs = {
        'gender': GenericReferenceRepository('genders'),
        'disease': GenericReferenceRepository('disease_types'),
        'severity': GenericReferenceRepository('severity_types'),
        'diet_type': GenericReferenceRepository('diet_recommandation_types'),
        'activity': GenericReferenceRepository('physical_activity_levels'),
        'restriction': GenericReferenceRepository('dietary_restrictions'),
        'allergy': GenericReferenceRepository('allergies'),
        'cuisine': GenericReferenceRepository('preferred_cuisine_types'),
    }

    count = 0
    try:
        repo = DietRecommendationsRepository()
        # Chargement des caches
        caches = {key: {r['name']: r['id'] for r in repo_ref.getAll()} for key, repo_ref in refs.items()}

        print("🗑️  Vidage de la table diet_recommendations...")
        repo.truncate()

        with open(csv_path, mode='r', encoding='utf-8') as csvfile:
            reader = csv.DictReader(csvfile)
            for row in reader:
                d = DietRecommendation()
                
                # Mapping simple
                d.age = safe_int(row.get('Age'))
                d.height_cm = safe_int(row.get('Height (cm)')) or safe_int(row.get('Height'))
                d.current_weight_kg = safe_float(row.get('Weight (kg)')) or safe_float(row.get('Weight'))
                d.bmi = safe_float(row.get('BMI'))
                d.daily_caloric_target = safe_int(row.get('Daily Caloric Target'))
                d.cholesterol_mg = safe_float(row.get('Cholesterol (mg)'))
                d.blood_pressure_mmhg = safe_int(row.get('Blood Pressure (mmHg)')) # Suppose format simple
                d.glucose_mg_dl = safe_float(row.get('Glucose (mg/dL)'))
                d.weekly_exercise_hours = safe_float(row.get('Weekly Exercise Hours'))
                d.adherence_to_diet_plan = safe_float(row.get('Adherence to Diet Plan (%)'))
                d.dietary_nutrient_imbalance_score = safe_float(row.get('Dietary Nutrient Imbalance Score'))

                # Mapping avec gestion des Clés Étrangères (FK)
                d.gender = get_or_create_id(refs['gender'], caches['gender'], row.get('Gender'))
                d.disease_type = get_or_create_id(refs['disease'], caches['disease'], row.get('Disease'))
                d.severity = get_or_create_id(refs['severity'], caches['severity'], row.get('Severity'))
                d.diet_recommendation = get_or_create_id(refs['diet_type'], caches['diet_type'], row.get('Diet Recommendation'))
                d.activity_level = get_or_create_id(refs['activity'], caches['activity'], row.get('Activity Level'))
                d.dietary_restrictions = get_or_create_id(refs['restriction'], caches['restriction'], row.get('Dietary Restriction'))
                d.allergy = get_or_create_id(refs['allergy'], caches['allergy'], row.get('Allergy'))
                d.preferred_cuisine = get_or_create_id(refs['cuisine'], caches['cuisine'], row.get('Preferred Cuisine'))

                repo.create(d)
                count += 1
                if count % 10 == 0: print(f"   -> {count} lignes nutrition...", end='\r')

        print(f"\n✅ Importation Nutrition terminée ! {count} lignes ajoutées.")

    except Exception as e:
        print(f"\n❌ Erreur Import Nutrition : {e}")
    finally:
        if repo: repo.close()
        for r in refs.values():
            r.close()
        print("   -> Tâche 'import_diet_recommendations' terminée.")

if __name__ == "__main__":
    # Construction du chemin vers le dossier Datasets (qui est au même niveau que HealthIABack)
    base_dir = os.path.dirname(os.path.dirname(__file__))
    
    csv_file = os.path.join(base_dir, "Datasets", "gym_members_exercise_tracking_synthetic_data.csv")
    diet_csv_file = os.path.join(base_dir, "Datasets", "diet_recommendations_dataset.csv")
    
    # Si le chemin relatif échoue, on tente le chemin absolu fourni
    if not os.path.exists(csv_file):
        csv_file = r"C:\Users\GreGY\Documents\TP Bachelor\projetMSPR1-main\Datasets\gym_members_exercise_tracking_synthetic_data.csv"
    
    # Lancement des imports
    import_exercise_sessions(csv_file)
    
    if os.path.exists(diet_csv_file):
        import_diet_recommendations(diet_csv_file)
    else:
        print(f"⚠️ Fichier nutrition introuvable : {diet_csv_file}")