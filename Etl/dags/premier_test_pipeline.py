# les différents import
import sys
import os

# Détermine le chemin pour trouver les repositories et les models
sys.path.append(os.path.join(os.path.dirname(__file__), '../../HealthIABack'))

# des imports pour Airflow, la manipulation de données et les interactions avec la base de données
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

# Remonte depuis le fichier DAG jusqu'au dossier Datasets
DATASETS_PATH = os.path.join(os.path.dirname(__file__), '../../Datasets')

with DAG(
    dag_id="premier_test_pipeline",
    start_date=datetime(2026, 2, 14),
    schedule=None,
    catchup=False,
) as dag:

    # Une tâche qui permet d'extraire les données du fichier excel pour transmettre aux autres tâches
    @task
    def extract():

        # lit le fichier gym_members_exercise_tracking_synthetic_data.csv et évite toutes mauvaises lignes
        df_members_synthetic = pd.read_csv(os.path.join(DATASETS_PATH, 'gym_members_exercise_tracking_synthetic_data.csv'), on_bad_lines='skip')
        
        # lit le fichier gym_members_exercise_tracking.csv et évite toutes mauvaises lignes
        df_members_tracking = pd.read_csv(os.path.join(DATASETS_PATH, 'gym_members_exercise_tracking.csv'), on_bad_lines='skip')
        
        # concatene le contenu des deux fichiers différents en 1 seul contenu en fusionnant les informations similaires
        df_members = pd.concat([df_members_tracking, df_members_synthetic])

        # stocke le fichier avec le chemin dans la variable output_path
        output_path = os.path.join(DATASETS_PATH, 'members_exercise.csv')

        # export dans un autre fichier contenu dans le output_path
        df_members.to_csv(output_path, index=False)

        # retourne le fichier
        return output_path

    # Une tâche qui permet de transformer les données extraites pour que les données soit plus cohérentes et plus propres pour les autres tâches
    @task
    def transform(file_path):

        # lit le fichier csv à partir du chemin file_path et stocke le contenu dans la variable df_members
        df_members = pd.read_csv(file_path)

        # supprime les espaces et les caractères de tabulation dans la colonne 'Workout_Type' en utilisant la méthode replace avec une expression régulière
        df_members['Workout_Type'] = df_members['Workout_Type'].replace({
            r'\\t': '',      # supprime \t
            r'\\n': '',
            r'\n': '',
            r'\t': ''
        }, regex=True)

        # supprime les espaces et les caractères de tabulation dans la colonne 'Experience_Level' en utilisant la méthode replace avec une expression régulière
        df_members['Max_BPM'] = df_members['Max_BPM'].replace({
            r'\\t': '',      # supprime \t
            r'\\n': ''
        }, regex=True)

        # convertit les valeurs de la colonne 'Max_BPM' en numérique en utilisant la méthode to_numeric de pandas, en remplaçant les valeurs non convertibles par NaN
        df_members['Max_BPM'] = pd.to_numeric(df_members['Max_BPM'])

        # remplace les valeurs manquantes dans la colonne par 'Other' en utilisant la méthode fillna de pandas
        df_members['Gender'] = df_members['Gender'].fillna('Other')

        # calcule la moyenne de la colonne 'Age' en utilisant la méthode mean de pandas et arrondit le résultat à l'entier le plus proche en utilisant la fonction round
        mean_age = round(df_members['Age'].mean())

        # remplace les valeurs manquantes dans la colonne par 'Unknown' en utilisant la méthode fillna de pandas
        df_members['Age'] = df_members['Age'].fillna(mean_age)

        # calcule la moyenne de la colonne 'Weight (kg)' en utilisant la méthode mean de pandas et arrondit le résultat à l'entier le plus proche en utilisant la fonction round
        mean_Weight = round(df_members['Weight (kg)'].mean())

        # remplace les valeurs manquantes dans la colonne par la moyenne calculé juste au dessus en utilisant la méthode fillna de pandas
        df_members['Weight (kg)'] = df_members['Weight (kg)'].fillna(mean_Weight)

        # calcule la moyenne de la colonne 'Height (m)' en utilisant la méthode mean de pandas et arrondit le résultat à 2 décimales en utilisant la fonction round
        mean_Height = round(df_members['Height (m)'].mean(), 2)

        # remplace les valeurs manquantes dans la colonne par la moyenne calculé juste au dessus en utilisant la méthode fillna de pandas
        df_members['Height (m)'] = df_members['Height (m)'].fillna(mean_Height)

        # calcule la moyenne de la colonne 'Max_BPM' en utilisant la méthode mean de pandas et arrondit le résultat à l'entier le plus proche en utilisant la fonction round
        mean_MaxBPM = round(df_members['Max_BPM'].mean())

        # remplace les valeurs manquantes dans la colonne par la moyenne calculé juste au dessus en utilisant la méthode fillna de pandas
        df_members['Max_BPM'] = df_members['Max_BPM'].fillna(mean_MaxBPM)

        # calcule la moyenne de la colonne 'Avg_BPM' en utilisant la méthode mean de pandas et arrondit le résultat à l'entier le plus proche en utilisant la fonction round
        mean_AvgBPM = round(df_members['Avg_BPM'].mean())

        # remplace les valeurs manquantes dans la colonne par la moyenne calculé juste au dessus en utilisant la méthode fillna de pandas
        df_members['Avg_BPM'] = df_members['Avg_BPM'].fillna(mean_AvgBPM)

        # calcule la moyenne de la colonne 'Resting_BPM' en utilisant la méthode mean de pandas et arrondit le résultat à l'entier le plus proche en utilisant la fonction round
        mean_RestingBPM = round(df_members['Resting_BPM'].mean())

        # remplace les valeurs manquantes dans la colonne par la moyenne calculé juste au dessus en utilisant la méthode fillna de pandas
        df_members['Resting_BPM'] = df_members['Resting_BPM'].fillna(mean_RestingBPM)

        # calcule la moyenne de la colonne 'Session_Duration (hours)' en utilisant la méthode mean de pandas et arrondit le résultat à 2 décimales en utilisant la fonction round
        mean_SessionDuration = round(df_members['Session_Duration (hours)'].mean(), 2)

        # remplace les valeurs manquantes dans la colonne par la moyenne calculé juste au dessus en utilisant la méthode fillna de pandas
        df_members['Session_Duration (hours)'] = df_members['Session_Duration (hours)'].fillna(mean_SessionDuration)

        # calcule la moyenne de la colonne 'Fat_Percentage' en utilisant la méthode mean de pandas et arrondit le résultat à 1 décimale en utilisant la fonction round
        mean_FatPourcentage = round(df_members['Fat_Percentage'].mean(), 1)

        # remplace les valeurs manquantes dans la colonne par la moyenne calculé juste au dessus en utilisant la méthode fillna de pandas
        df_members['Fat_Percentage'] = df_members['Fat_Percentage'].fillna(mean_FatPourcentage)

        # calcule la moyenne de la colonne 'Water_Intake (liters)' en utilisant la méthode mean de pandas et arrondit le résultat à 1 décimale en utilisant la fonction round
        mean_Water_Intake = round(df_members['Water_Intake (liters)'].mean(), 1)

        # remplace les valeurs manquantes dans la colonne par la moyenne calculé juste au dessus en utilisant la méthode fillna de pandas
        df_members['Water_Intake (liters)'] = df_members['Water_Intake (liters)'].fillna(mean_Water_Intake)

        # supprime les lignes où la colonne 'Workout_Type' a des valeurs manquantes en utilisant la méthode dropna de pandas avec l'argument subset pour spécifier la colonne à vérifier
        df_members = df_members.dropna(subset=['Workout_Type'])

        # remplace les valeurs manquantes dans la colonne 'Workout_Frequency (days/week)' par 1 en utilisant la méthode fillna de pandas
        df_members['Workout_Frequency (days/week)'] = df_members['Workout_Frequency (days/week)'].fillna(1)

        # supprime les lignes où la colonne 'Experience_Level' a des valeurs manquantes en utilisant la méthode dropna de pandas avec l'argument subset pour spécifier la colonne à vérifier
        df_members = df_members.dropna(subset=['Experience_Level'])

        # calcule la moyenne de la colonne 'Calories_Burned' en utilisant la méthode mean de pandas et arrondit le résultat à l'entier le plus proche en utilisant la fonction round
        mean_CaloriesBurned = round(df_members['Calories_Burned'].mean())

        # remplace les valeurs manquantes dans la colonne par la moyenne calculé juste au dessus en utilisant la méthode fillna de pandas
        df_members['Calories_Burned'] = df_members['Calories_Burned'].fillna(mean_CaloriesBurned)

        # calcule la moyenne de la colonne 'BMI' en utilisant la méthode mean de pandas et arrondit le résultat à 2 décimales en utilisant la fonction round
        mean_BMI = round(df_members['BMI'].mean(), 2)

        # remplace les valeurs manquantes dans la colonne par la moyenne calculé juste au dessus en utilisant la méthode fillna de pandas
        df_members['BMI'] = df_members['BMI'].fillna(mean_BMI)

        # stocke le fichier avec le chemin dans la variable output_path
        output_path = os.path.join(DATASETS_PATH, 'members_clean.csv')

        # export dans un autre fichier contenu dans le output_path
        df_members.to_csv(output_path, index=False)

        # retourne le fichier
        return output_path

    # Une tâche qui permet de charger les données transformées dans la base de données pour que les données soit exploitables pour les autres tâches
    @task
    def load(file_path):

        # lit le fichier csv à partir du chemin file_path et stocke le contenu dans la variable df_members
        df_members = pd.read_csv(file_path)

        #patient_repo = PatientRepository()

        # crée des instances des repositories pour les différentes tables de la base de données
        genders_repo = GendersRepository()
        workoutTypes_repo = WorkoutTypesRepository()
        exerciceSessions_repo = ExerciceSessionsRepository()

        # récupère tous les genres et types d'entraînement existants dans la base de données pour éviter les doublons lors de l'insertion des nouvelles données
        all_genders = genders_repo.getAll()

        # crée un dictionnaire pour mapper les noms de genres aux identifiants correspondants dans la base de données
        gender_dict = {g['name']: g['id'] for g in all_genders}

        # crée une liste pour stocker les noms de genres existants
        gender_names = [g['name'] for g in all_genders]

        # récupère tous les types d'entraînement existants dans la base de données pour éviter les doublons lors de l'insertion des nouvelles données
        all_workout_types = workoutTypes_repo.getAll()

        # crée un dictionnaire pour mapper les noms de types d'entraînement aux identifiants correspondants dans la base de données, et une liste pour stocker les noms de types d'entraînement existants
        workout_type_dict = {w['name']: w['id'] for w in all_workout_types}

        # crée une liste pour stocker les noms de types d'entraînement existants
        workout_type_names = [w['name'] for w in all_workout_types]

        # parcourt chaque ligne du DataFrame df_members en utilisant la méthode iterrows de pandas, et pour chaque ligne, il effectue les opérations suivantes :
        for _, row in df_members.iterrows():

            # récupère les valeurs des colonnes "Gender" et "Workout_Type" de la ligne courante, et les stocke dans les variables
            gender_name = row["Gender"]
            workoutType_name = row["Workout_Type"]

            # vérifie si le nom de genre n'existe pas déjà dans la liste des noms de genres existants
            if gender_name not in gender_names:
                # si le nom de genre n'existe pas, il crée une nouvelle entrée dans la table des genres en utilisant la méthode create du repository des genres, et stocke l'identifiant de la nouvelle entrée dans la variable
                gender_id = genders_repo.create(gender_name)

                # ajoute le nom de genre à la liste des noms de genres existants pour éviter les doublons lors de l'insertion des prochaines données
                gender_names.append(gender_name)

                # ajoute une entrée dans le dictionnaire de mapping des genres pour associer le nom de genre à son identifiant dans la base de données
                gender_dict[gender_name] = gender_id

            # vérifie si le nom de type d'entraînement n'existe pas déjà dans la liste des noms de types d'entraînement existants
            if workoutType_name not in workout_type_names:

                # si le nom de type d'entraînement n'existe pas, il crée une nouvelle entrée dans la table des types d'entraînement en utilisant la méthode create du repository des types d'entraînement, et stocke l'identifiant de la nouvelle entrée dans la variable
                workout_type_id = workoutTypes_repo.create(workoutType_name)

                # ajoute le nom de type d'entraînement à la liste des noms de types d'entraînement existants pour éviter les doublons lors de l'insertion des prochaines données
                workout_type_names.append(workoutType_name)

                # ajoute une entrée dans le dictionnaire de mapping des types d'entraînement pour associer le nom de type d'entraînement à son identifiant dans la base de données
                workout_type_dict[workoutType_name] = workout_type_id

            # récupère les identifiants correspondants aux noms de genre et de type d'entraînement à partir des dictionnaires de mapping, et les stocke dans les variables
            gender_id = gender_dict[gender_name]
            workout_type_id = workout_type_dict[workoutType_name]

            # crée une instance de la classe ExerciceSession en utilisant les valeurs des différentes colonnes de la ligne courante, ainsi que les identifiants de genre et de type d'entraînement récupérés précédemment, et stocke cette instance dans la variable
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

            # insère l'instance de la classe ExerciceSession dans la base de données en utilisant la méthode create du repository des sessions d'exercice
            exerciceSessions_repo.create(exerciceSession)

        #patient_repo.close()

        # ferme les connexions aux repositories pour libérer les ressources utilisées
        genders_repo.close()
        workoutTypes_repo.close()
        exerciceSessions_repo.close()

    # définit l'ordre d'exécution des tâches dans le DAG 
    data = extract()
    cleaned = transform(data)
    load(cleaned)
