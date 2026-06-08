# les différents import
import sys
import os

# Détermine le chemin pour trouver les repositories et les models
sys.path.append(os.path.join(os.path.dirname(__file__), '../../HealthIABack'))

# des imports
from airflow import DAG
from airflow.decorators import task
from datetime import datetime
import csv
import os
import pandas as pd
from sqlalchemy import create_engine
from sqlalchemy.types import String, Integer, Float, DateTime
#from Repositories.PatientRepository import PatientRepository
from Repositories.GendersRepository import GendersRepository
from Repositories.WorkoutTypesRepository import WorkoutTypesRepository
from Repositories.ExerciceSessionsRepository import ExerciceSessionsRepository
from Repositories.DietRecommandationsRepository import DietRecommandationsRepository
from Repositories.GenericReferenceRepository import GenericReferenceRepository
#from Models.Patient import Patient
from Models.Gender import Gender
from Models.WorkoutType import WorkoutType
from Models.ExerciceSession import ExerciceSession
from Models.DietRecommandation import DietRecommandation

DATASETS_PATH = "/opt/airflow/Datasets/"

with DAG(
    dag_id="exercice_session_pipeline",
    start_date=datetime(2026, 2, 14),
    schedule=None,
    catchup=False,
) as dag:

    # Une tâche qui permet d'extraire les données du fichier excel pour transmettre aux autres tâches
    @task
    def extract():

        # lit le fichier gym_members_exercise_tracking_synthetic_data.csv et évite toutes mauvaises lignes
        df_members_synthetic = pd.read_csv(
            os.path.join(DATASETS_PATH, "gym_members_exercise_tracking_synthetic_data.csv"),
            on_bad_lines='skip'
        )

        # lit le fichier gym_members_exercise_tracking.csv et évite toutes mauvaises lignes
        df_members_tracking = pd.read_csv(
            os.path.join(DATASETS_PATH, "gym_members_exercise_tracking.csv"),
            on_bad_lines='skip'
        )

        # concatene le contenu des deux fichiers différents en 1 seul contenu en fusionnant les informations similaires
        df_members = pd.concat([df_members_tracking, df_members_synthetic])

        # stocke le fichier avec le chemin dans la variable output_path
        output_path = os.path.join(DATASETS_PATH, "members_exercise.csv")

        # export dans un autre fichier contenu dans le output_path
        df_members.to_csv(output_path, index=False)

        # retourne le fichier
        return output_path

    @task
    def transform(file_path):

        df_members = pd.read_csv(file_path)

        df_members['Workout_Type'] = df_members['Workout_Type'].replace({
            r'\\t': '',      # supprime \t
            r'\\n': '',
            r'\n': '',
            r'\t': ''
        }, regex=True)


        df_members['Max_BPM'] = df_members['Max_BPM'].replace({
            r'\\t': '',      # supprime \t
            r'\\n': ''
        }, regex=True)


        df_members['Max_BPM'] = pd.to_numeric(df_members['Max_BPM'])

        df_members['Gender'] = df_members['Gender'].fillna('Other')

        mean_age = round(df_members['Age'].mean())
        df_members['Age'] = df_members['Age'].fillna(mean_age)

        mean_Weight = round(df_members['Weight (kg)'].mean())
        df_members['Weight (kg)'] = df_members['Weight (kg)'].fillna(mean_Weight)

        mean_Height = round(df_members['Height (m)'].mean(), 2)
        df_members['Height (m)'] = df_members['Height (m)'].fillna(mean_Height)

        mean_MaxBPM = round(df_members['Max_BPM'].mean())
        df_members['Max_BPM'] = df_members['Max_BPM'].fillna(mean_MaxBPM)

        mean_AvgBPM = round(df_members['Avg_BPM'].mean())
        df_members['Avg_BPM'] = df_members['Avg_BPM'].fillna(mean_AvgBPM)

        mean_RestingBPM = round(df_members['Resting_BPM'].mean())
        df_members['Resting_BPM'] = df_members['Resting_BPM'].fillna(mean_RestingBPM)

        mean_SessionDuration = round(df_members['Session_Duration (hours)'].mean(), 2)
        df_members['Session_Duration (hours)'] = df_members['Session_Duration (hours)'].fillna(mean_SessionDuration)

        mean_FatPourcentage = round(df_members['Fat_Percentage'].mean(), 1)
        df_members['Fat_Percentage'] = df_members['Fat_Percentage'].fillna(mean_FatPourcentage)

        mean_Water_Intake = round(df_members['Water_Intake (liters)'].mean(), 1)
        df_members['Water_Intake (liters)'] = df_members['Water_Intake (liters)'].fillna(mean_Water_Intake)

        df_members = df_members.dropna(subset=['Workout_Type'])

        df_members['Workout_Frequency (days/week)'] = df_members['Workout_Frequency (days/week)'].fillna(1)

        df_members = df_members.dropna(subset=['Experience_Level'])

        mean_CaloriesBurned = round(df_members['Calories_Burned'].mean())
        df_members['Calories_Burned'] = df_members['Calories_Burned'].fillna(mean_CaloriesBurned)

        mean_BMI = round(df_members['BMI'].mean(), 2)
        df_members['BMI'] = df_members['BMI'].fillna(mean_BMI)

        output_path = os.path.join(DATASETS_PATH, "members_clean.csv")

        df_members.to_csv(output_path, index=False)

        return output_path


    @task
    def load(file_path):

        print("DB HOST:", os.getenv("DB_HOST"))
        print("DB NAME:", os.getenv("DB_NAME"))

        df_members = pd.read_csv(file_path)

        #patient_repo = PatientRepository()
        genders_repo = GendersRepository()
        workoutTypes_repo = WorkoutTypesRepository()
        exerciceSessions_repo = ExerciceSessionsRepository()

        all_genders = genders_repo.getAll()
        gender_dict = {g['name']: g['id_genders'] for g in all_genders}
        gender_names = [g['name'] for g in all_genders]

        all_workout_types = workoutTypes_repo.getAll()
        workout_type_dict = {w['name']: w['id_workout_types'] for w in all_workout_types}
        workout_type_names = [w['name'] for w in all_workout_types]

        for _, row in df_members.iterrows():

            gender_name = row["Gender"]
            workoutType_name = row["Workout_Type"]

            if gender_name not in gender_names:
                gender_id = genders_repo.create(gender_name)
                gender_names.append(gender_name)
                gender_dict[gender_name] = gender_id

            if workoutType_name not in workout_type_names:
                workout_type_id = workoutTypes_repo.create(workoutType_name)
                workout_type_names.append(workoutType_name)
                workout_type_dict[workoutType_name] = workout_type_id

            gender_id = gender_dict[gender_name]
            workout_type_id = workout_type_dict[workoutType_name]

            exerciceSession = ExerciceSession(
                age=row["Age"],
                gender=gender_id,
                weight_kg=row["Weight (kg)"],
                height_cm=row["Height (m)"] * 100 # Conversion m en cm,
                max_bpm=row["Max_BPM"],
                avg_bpm=row["Avg_BPM"],
                resting_bpm=row["Resting_BPM"],
                session_duration_hours=row["Session_Duration (hours)"],
                calories_burned=row["Calories_Burned"],
                workout_type=workout_type_id,
                fat_percentage=row["Fat_Percentage"],
                water_intake_liters=row["Water_Intake (liters)"],
                workout_frequency=row["Workout_Frequency (days/week)"],
                experience_level=row["Experience_Level"],
                bmi=row["BMI"]
            )

            exerciceSessions_repo.create(exerciceSession)

        #patient_repo.close()
        genders_repo.close()
        workoutTypes_repo.close()
        exerciceSessions_repo.close()

    @task
    def load_nutrition():
        # Fonctions utilitaires pour sécuriser les données
        def safe_int(value, default=0):
            try:
                if not value or str(value).strip() == '': return default
                return int(float(value))
            except: return default

        def safe_float(value, default=0.0):
            try:
                if not value or str(value).strip() == '': return default
                return float(value)
            except: return default

        def get_or_create_id(repo, cache, name):
            if not name: return None
            clean_name = str(name).strip()
            if clean_name in cache: return cache[clean_name]
            new_id = repo.create(clean_name)
            cache[clean_name] = new_id
            return new_id

        file_path = os.path.join(DATASETS_PATH, "diet_recommendations_dataset.csv")

        if not os.path.exists(file_path):
            print(f"❌ Fichier Nutrition introuvable : {file_path}")
            return

        # Initialisation des repositories
        repo = DietRecommandationsRepository()
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

        # Chargement des caches
        caches = {key: {r['name']: r['id'] for r in repo_ref.getAll()} for key, repo_ref in refs.items()}

        # Vidage et Import
        repo.truncate()

        with open(file_path, mode='r', encoding='utf-8') as csvfile:
            reader = csv.DictReader(csvfile)
            for row in reader:
                d = DietRecommandation()
                d.age = safe_int(row.get('Age'))
                d.height_cm = safe_int(row.get('Height (cm)')) or safe_int(row.get('Height'))
                d.current_weight_kg = safe_float(row.get('Weight (kg)')) or safe_float(row.get('Weight'))
                d.bmi = safe_float(row.get('BMI'))
                d.daily_caloric_target = safe_int(row.get('Daily Caloric Target'))
                d.cholesterol_mg = safe_float(row.get('Cholesterol (mg)'))
                d.blood_pressure_mmhg = safe_int(row.get('Blood Pressure (mmHg)'))
                d.glucose_mg_dl = safe_float(row.get('Glucose (mg/dL)'))
                d.weekly_exercise_hours = safe_float(row.get('Weekly Exercise Hours'))
                d.adherence_to_diet_plan = safe_float(row.get('Adherence to Diet Plan (%)'))
                d.dietary_nutrient_imbalance_score = safe_float(row.get('Dietary Nutrient Imbalance Score'))

                d.gender = get_or_create_id(refs['gender'], caches['gender'], row.get('Gender'))
                d.disease_type = get_or_create_id(refs['disease'], caches['disease'], row.get('Disease'))
                d.severity = get_or_create_id(refs['severity'], caches['severity'], row.get('Severity'))
                d.diet_recommandation = get_or_create_id(refs['diet_type'], caches['diet_type'], row.get('Diet Recommendation'))
                d.activity_level = get_or_create_id(refs['activity'], caches['activity'], row.get('Activity Level'))
                d.dietary_restrictions = get_or_create_id(refs['restriction'], caches['restriction'], row.get('Dietary Restriction'))
                d.allergy = get_or_create_id(refs['allergy'], caches['allergy'], row.get('Allergy'))
                d.preferred_cuisine = get_or_create_id(refs['cuisine'], caches['cuisine'], row.get('Preferred Cuisine'))

                repo.create(d)

        # Fermeture des connexions
        repo.close()
        for r in refs.values():
            r.close()

    data = extract()
    cleaned = transform(data)
    load(cleaned)
    load_nutrition()
