import csv
import os
from dotenv import load_dotenv

# Charge les variables d'environnement depuis le fichier .env
load_dotenv()

from Models.ExerciceSession import ExerciceSession
from Models.DietRecommandation import DietRecommandation
from Repositories.ExerciceSessionsRepository import ExerciceSessionsRepository
from Repositories.BaseRepository import BaseRepository
from Repositories.DietRecommandationsRepository import DietRecommandationsRepository
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

        print("🗑️  Vidage des tables existantes...")
        repo.truncate()           # exercice_sessions d'abord (supprime les FK)
        workout_repo.truncate()   # workout_types ensuite (données corrompues nettoyées)

        # Pré-chargement des caches APRÈS vidage pour repartir d'un état propre
        genders_cache = {item['name']: item['id'] for item in gender_repo.getAll()}
        workouts_cache = {item['name']: item['id'] for item in workout_repo.getAll()}

        with open(csv_path, mode='r', encoding='utf-8') as csvfile:
            reader = csv.DictReader(csvfile)
            
            for row in reader:
                # Création de l'objet modèle
                session = ExerciceSession()
                
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
                # Nettoyage des caractères d'échappement littéraux (\t, \n) présents dans le CSV
                workout_str = row.get('Workout_Type', 'Cardio') or 'Cardio'
                workout_str = workout_str.replace('\\t', '').replace('\\n', '').replace('\t', '').replace('\n', '').strip()
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
        repo = DietRecommandationsRepository()
        # Chargement des caches
        caches = {key: {r['name']: r['id'] for r in repo_ref.getAll()} for key, repo_ref in refs.items()}

        print("🗑️  Vidage de la table diet_recommendations...")
        repo.truncate()

        with open(csv_path, mode='r', encoding='utf-8') as csvfile:
            reader = csv.DictReader(csvfile)
            for row in reader:
                d = DietRecommandation()
                
                # Mapping simple (noms de colonnes réels du CSV)
                d.age = safe_int(row.get('Age'))
                d.height_cm = safe_int(row.get('Height_cm'))
                d.current_weight_kg = safe_float(row.get('Weight_kg'))
                d.bmi = safe_float(row.get('BMI'))
                d.daily_caloric_target = safe_int(row.get('Daily_Caloric_Intake'))
                d.cholesterol_mg = safe_float(row.get('Cholesterol_mg/dL'))
                d.blood_pressure_mmhg = safe_int(row.get('Blood_Pressure_mmHg'))
                d.glucose_mg_dl = safe_float(row.get('Glucose_mg/dL'))
                d.weekly_exercise_hours = safe_float(row.get('Weekly_Exercise_Hours'))
                d.adherence_to_diet_plan = safe_float(row.get('Adherence_to_Diet_Plan'))
                d.dietary_nutrient_imbalance_score = safe_float(row.get('Dietary_Nutrient_Imbalance_Score'))

                # Mapping avec gestion des Clés Étrangères (FK)
                d.gender = get_or_create_id(refs['gender'], caches['gender'], row.get('Gender'))
                d.disease_type = get_or_create_id(refs['disease'], caches['disease'], row.get('Disease_Type'))
                d.severity = get_or_create_id(refs['severity'], caches['severity'], row.get('Severity'))
                d.diet_recommandation = get_or_create_id(refs['diet_type'], caches['diet_type'], row.get('Diet_Recommendation'))
                d.activity_level = get_or_create_id(refs['activity'], caches['activity'], row.get('Physical_Activity_Level'))
                d.dietary_restrictions = get_or_create_id(refs['restriction'], caches['restriction'], row.get('Dietary_Restrictions'))
                d.allergy = get_or_create_id(refs['allergy'], caches['allergy'], row.get('Allergies'))
                d.preferred_cuisine = get_or_create_id(refs['cuisine'], caches['cuisine'], row.get('Preferred_Cuisine'))

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
