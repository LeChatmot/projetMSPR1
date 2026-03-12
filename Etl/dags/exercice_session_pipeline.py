# les différents import
import sys
import os

# Détermine le chemin pour trouver les repositories et les models
sys.path.append(os.path.join(os.path.dirname(__file__), '../../HealthIABack'))

# des imports
from airflow import DAG
from airflow.decorators import task
from datetime import datetime
import os
import pandas as pd
from sqlalchemy import create_engine
from sqlalchemy.types import String, Integer, Float, DateTime
#from Repositories.PatientRepository import PatientRepository
from Repositories.GendersRepository import GendersRepository
from Repositories.WorkoutTypesRepository import WorkoutTypesRepository
from Repositories.ExerciceSessionsRepository import ExerciceSessionsRepository
#from Models.Patient import Patient
from Models.Gender import Gender
from Models.WorkoutType import WorkoutType
from Models.ExerciceSession import ExerciceSession

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
        df_members_synthetic = pd.read_csv("/home/maxime/airflow/data/gym_members_exercise_tracking_synthetic_data.csv", on_bad_lines='skip')

        # lit le fichier gym_members_exercise_tracking.csv et évite toutes mauvaises lignes
        df_members_tracking = pd.read_csv("/home/maxime/airflow/data/gym_members_exercise_tracking.csv", on_bad_lines='skip')

        # concatene le contenu des deux fichiers différents en 1 seul contenu en fusionnant les informations similaires
        df_members = pd.concat([df_members_tracking, df_members_synthetic])

        # stocke le fichier avec le chemin dans la variable output_path
        output_path = "/home/maxime/airflow/data/members_exercise.csv"

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

        output_path = "/home/maxime/airflow/data/members_clean.csv"

        df_members.to_csv(output_path, index=False)

        return output_path


    @task
    def load(file_path):

        df_members = pd.read_csv(file_path)

        #patient_repo = PatientRepository()
        genders_repo = GendersRepository()
        workoutTypes_repo = WorkoutTypesRepository()
        exerciceSessions_repo = ExerciceSessionsRepository()

        all_genders = genders_repo.getAll()
        gender_dict = {g['name']: g['id'] for g in all_genders}
        gender_names = [g['name'] for g in all_genders]

        all_workout_types = workoutTypes_repo.getAll()
        workout_type_dict = {w['name']: w['id'] for w in all_workout_types}
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
                weightKg=row["Weight (kg)"],
                heightCm=row["Height (m)"],
                maxBPM=row["Max_BPM"],
                avgBPM=row["Avg_BPM"],
                restingBPM=row["Resting_BPM"],
                sessionDurationHours=row["Session_Duration (hours)"],
                caloriesBurned=row["Calories_Burned"],
                workoutType=workout_type_id,
                fatPercentage=row["Fat_Percentage"],
                waterIntakeLiters=row["Water_Intake (liters)"],
                workoutFrequency=row["Workout_Frequency (days/week)"],
                experienceLevel=row["Experience_Level"],
                bmi=row["BMI"]
            )

            exerciceSessions_repo.create(exerciceSession)

        #patient_repo.close()
        genders_repo.close()
        workoutTypes_repo.close()
        exerciceSessions_repo.close()

    data = extract()
    cleaned = transform(data)
    load(cleaned)
