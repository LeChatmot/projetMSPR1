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
from Repositories.GendersRepository import GendersRepository
from Repositories.AllergiesRepository import AllergiesRepository
from Repositories.DietaryRestrictionsRepository import DietaryRestrictionsRepository
from Repositories.DiseaseTypesRepository import DiseaseTypesRepository
from Repositories.SeverityTypesRepository import SeverityTypesRepository
from Repositories.PhysicalActivityLevelsRepository import PhysicalActivityLevelsRepository
from Repositories.PreferredCuisineTypesRepository import PreferredCuisineTypesRepository
from Repositories.DietRecommandationTypesRepository import DietRecommandationTypesRepository
from Repositories.DietRecommandationsRepository import DietRecommandationsRepository
from Models.Gender import Gender
from Models.Allergie import Allergie
from Models.DietaryRestriction import DietaryRestriction
from Models.DiseaseType import DiseaseType
from Models.SeverityType import SeverityType
from Models.PhysicalActivityLevel import PhysicalActivityLevel
from Models.PreferredCuisineType import PreferredCuisineType
from Models.DietRecommandationType import DietRecommandationType
from Models.DietRecommandation import DietRecommandation

# Remonte depuis le fichier DAG jusqu'au dossier Datasets
DATASETS_PATH = os.path.join(os.path.dirname(__file__), '../../Datasets')

with DAG(
    dag_id="diet_recommandation_pipeline",
    start_date=datetime(2026, 2, 14),
    schedule=None,
    catchup=False,
) as dag:

    # Une tâche qui permet d'extraire les données du fichier excel pour transmettre aux autres tâches
    @task
    def extract():

        # lit le fichier diet_recommendations_dataset.csv et évite toutes mauvaises lignes
        df_diet = pd.read_csv(os.path.join(DATASETS_PATH, 'diet_recommendations_dataset.csv'), on_bad_lines='skip')

        # stocke le fichier avec le chemin dans la variable output_path
        output_path = os.path.join(DATASETS_PATH, 'diet_recommendations.csv')

        # export dans un autre fichier contenu dans le output_path
        df_diet.to_csv(output_path, index=False)

        # retourne le fichier
        return output_path

    # Une tâche qui permet de transformer les données extraites pour que les données soit plus cohérentes et plus propres pour les autres tâches
    @task
    def transform(file_path):

        # lit le fichier csv à partir du chemin fourni et stocke le contenu dans un DataFrame pandas
        df_diet = pd.read_csv(file_path)

        # remplace les valeurs manquantes dans les colonnes "Disease_Type", "Dietary_Restrictions" et "Allergies" par la valeur "Unknown"
        df_diet['Disease_Type'] = df_diet['Disease_Type'].fillna('Unknown')

        df_diet['Dietary_Restrictions'] = df_diet['Dietary_Restrictions'].fillna('Unknown')

        df_diet['Allergies'] = df_diet['Allergies'].fillna('Unknown')

        # stocke le fichier transformé avec le chemin dans la variable output_path
        output_path = os.path.join(DATASETS_PATH, 'diet_clean.csv')

        # export dans un autre fichier contenu dans le output_path
        df_diet.to_csv(output_path, index=False)

        # retourne le fichier transformé
        return output_path

    # Une tâche qui permet de charger les données transformées dans la base de données pour que les données soit exploitables pour les autres tâches
    @task
    def load(file_path):

        # lit le fichier csv à partir du chemin fourni et stocke le contenu dans un DataFrame pandas
        df_diet = pd.read_csv(file_path)

        # crée des instances des repositories pour les différentes tables de la base de données
        genders_repo = GendersRepository()
        allergies_repo = AllergiesRepository()
        dietaryRestrictions_repo = DietaryRestrictionsRepository()
        diseaseTypes_repo = DiseaseTypesRepository()
        severityTypes_repo = SeverityTypesRepository()
        physicalActivityLevels_repo = PhysicalActivityLevelsRepository()
        preferredCuisineTypes_repo = PreferredCuisineTypesRepository()
        dietRecommandationTypes_repo = DietRecommandationTypesRepository()
        dietRecommandations_repo = DietRecommandationsRepository()

        # récupère toutes les entrées existantes dans les tables de la base de données pour éviter les doublons lors de l'insertion des nouvelles données
        all_genders = genders_repo.getAll()

        # crée un dictionnaire de mapping des noms d'allergies vers leurs identifiants dans la base de données pour faciliter l'insertion des nouvelles données
        gender_dict = {g['name']: g['id'] for g in all_genders}

        # crée une liste des noms de genres existants pour éviter les doublons lors de l'insertion des nouvelles données
        gender_names = [g['name'] for g in all_genders]

        # récupère toutes les entrées existantes dans les tables de la base de données pour éviter les doublons lors de l'insertion des nouvelles données
        all_allergies = allergies_repo.getAll()

        # crée un dictionnaire de mapping des noms d'allergies vers leurs identifiants dans la base de données pour faciliter l'insertion des nouvelles données
        allergie_dict = {a['name']: a['id'] for a in all_allergies}

        # crée une liste des noms d'allergies existants pour éviter les doublons lors de l'insertion des nouvelles données
        allergie_names = [a['name'] for a in all_allergies]

        # récupère toutes les entrées existantes dans les tables de la base de données pour éviter les doublons lors de l'insertion des nouvelles données
        all_dietary_restrictions = dietaryRestrictions_repo.getAll()

        # crée un dictionnaire de mapping des noms de restrictions alimentaires vers leurs identifiants dans la base de données pour faciliter l'insertion des nouvelles données
        dietary_restriction_dict = {dir['name']: dir['id'] for dir in all_dietary_restrictions}

        # crée une liste des noms de restrictions alimentaires existants pour éviter les doublons lors de l'insertion des nouvelles données
        dietary_restriction_names = [dir['name'] for dir in all_dietary_restrictions]

        # récupère toutes les entrées existantes dans les tables de la base de données pour éviter les doublons lors de l'insertion des nouvelles données
        all_disease_types = diseaseTypes_repo.getAll()

        # crée un dictionnaire de mapping des noms de types de maladies vers leurs identifiants dans la base de données pour faciliter l'insertion des nouvelles données
        disease_type_dict = {dt['name']: dt['id'] for dt in all_disease_types}

        # crée une liste des noms de types de maladies existants pour éviter les doublons lors de l'insertion des nouvelles données
        disease_type_names = [dt['name'] for dt in all_disease_types]

        # récupère toutes les entrées existantes dans les tables de la base de données pour éviter les doublons lors de l'insertion des nouvelles données
        all_severity_types = severityTypes_repo.getAll()

        # crée un dictionnaire de mapping des noms de types de sévérité vers leurs identifiants dans la base de données pour faciliter l'insertion des nouvelles données
        severity_type_dict = {s['name']: s['id'] for s in all_severity_types}

        # crée une liste des noms de types de sévérité existants pour éviter les doublons lors de l'insertion des nouvelles données
        severity_type_names = [s['name'] for s in all_severity_types]

        # récupère toutes les entrées existantes dans les tables de la base de données pour éviter les doublons lors de l'insertion des nouvelles données
        all_physical_activity_levels = physicalActivityLevels_repo.getAll()

        # crée un dictionnaire de mapping des noms de niveaux d'activité physique vers leurs identifiants dans la base de données pour faciliter l'insertion des nouvelles données
        physical_activity_level_dict = {pa['name']: pa['id'] for pa in all_physical_activity_levels}

        # crée une liste des noms de niveaux d'activité physique existants pour éviter les doublons lors de l'insertion des nouvelles données
        physical_activity_level_names = [pa['name'] for pa in all_physical_activity_levels]

        # récupère toutes les entrées existantes dans les tables de la base de données pour éviter les doublons lors de l'insertion des nouvelles données
        all_preferred_cuisine_types = preferredCuisineTypes_repo.getAll()

        # crée un dictionnaire de mapping des noms de types de cuisine préférés vers leurs identifiants dans la base de données pour faciliter l'insertion des nouvelles données
        preferred_cuisine_type_dict = {pc['name']: pc['id'] for pc in all_preferred_cuisine_types}

        # crée une liste des noms de types de cuisine préférés existants pour éviter les doublons lors de l'insertion des nouvelles données
        preferred_cuisine_type_names = [pc['name'] for pc in all_preferred_cuisine_types]

        # récupère toutes les entrées existantes dans les tables de la base de données pour éviter les doublons lors de l'insertion des nouvelles données
        all_diet_recommandation_types = dietRecommandationTypes_repo.getAll()

        # crée un dictionnaire de mapping des noms de types de recommandations diététiques vers leurs identifiants dans la base de données pour faciliter l'insertion des nouvelles données
        diet_recommandation_type_dict = {dier['name']: dier['id'] for dier in all_diet_recommandation_types}

        # crée une liste des noms de types de recommandations diététiques existants pour éviter les doublons lors de l'insertion des nouvelles données
        diet_recommandation_type_names = [dier['name'] for dier in all_diet_recommandation_types]

        # parcourt chaque ligne du DataFrame df_diet en utilisant la méthode iterrows de pandas, et pour chaque ligne, il effectue les opérations suivantes :
        for _, row in df_diet.iterrows():

            # récupère les valeurs des différentes colonnes de la ligne courante et les stocke dans des variables
            gender_name = row["Gender"]
            allergie_name = row["Allergies"]
            dietaryRestriction_name = row["Dietary_Restrictions"]
            diseaseType_name = row["Disease_Type"]
            severityType_name = row["Severity"]
            physicalActivityLevel_name = row["Physical_Activity_Level"]
            preferredCuisineType_name = row["Preferred_Cuisine"]
            dietRecommandationType_name = row["Diet_Recommendation"]

            # vérifie si le nom de genre n'existe pas déjà dans la liste des noms de genres existants
            if gender_name not in gender_names:

                # si le nom de genre n'existe pas, il crée une nouvelle entrée dans la table des genres en utilisant la méthode create du repository des genres, et stocke l'identifiant de la nouvelle entrée dans la variable
                gender_id = genders_repo.create(gender_name)

                # ajoute le nom de genre à la liste des noms de genres existants pour éviter les doublons lors de l'insertion des prochaines données
                gender_names.append(gender_name)

                # ajoute une entrée dans le dictionnaire de mapping des genres pour associer le nom de genre à son identifiant dans la base de données
                gender_dict[gender_name] = gender_id

            # vérifie si le nom d'allergie n'existe pas déjà dans la liste des noms d'allergies existants
            if allergie_name not in allergie_names:

                # si le nom d'allergie n'existe pas, il crée une nouvelle entrée dans la table des allergies en utilisant la méthode create du repository des allergies, et stocke l'identifiant de la nouvelle entrée dans la variable
                allergie_id = allergies_repo.create(allergie_name)

                # ajoute le nom d'allergie à la liste des noms d'allergies existants pour éviter les doublons lors de l'insertion des prochaines données
                allergie_names.append(allergie_name)

                # ajoute une entrée dans le dictionnaire de mapping des allergies pour associer le nom d'allergie à son identifiant dans la base de données
                allergie_dict[allergie_name] = allergie_id

            # vérifie si le nom de restriction alimentaire n'existe pas déjà dans la liste des noms de restrictions alimentaires existants
            if dietaryRestriction_name not in dietary_restriction_names:

                # si le nom de restriction alimentaire n'existe pas, il crée une nouvelle entrée dans la table des restrictions alimentaires en utilisant la méthode create du repository des restrictions alimentaires, et stocke l'identifiant de la nouvelle entrée dans la variable
                dietary_restriction_id = dietaryRestrictions_repo.create(dietaryRestriction_name)
                
                # ajoute le nom de restriction alimentaire à la liste des noms de restrictions alimentaires existants pour éviter les doublons lors de l'insertion des prochaines données
                dietary_restriction_names.append(dietaryRestriction_name)
                
                # ajoute une entrée dans le dictionnaire de mapping des restrictions alimentaires pour associer le nom de restriction alimentaire à son identifiant dans la base de données
                dietary_restriction_dict[dietaryRestriction_name] = dietary_restriction_id

            # vérifie si le nom de type de maladie n'existe pas déjà dans la liste des noms de types de maladies existants
            if diseaseType_name not in disease_type_names:
                
                # si le nom de type de maladie n'existe pas, il crée une nouvelle entrée dans la table des types de maladies en utilisant la méthode create du repository des types de maladies, et stocke l'identifiant de la nouvelle entrée dans la variable
                disease_type_id = diseaseTypes_repo.create(diseaseType_name)
                
                # ajoute le nom de type de maladie à la liste des noms de types de maladies existants pour éviter les doublons lors de l'insertion des prochaines données
                disease_type_names.append(diseaseType_name)
                
                # ajoute une entrée dans le dictionnaire de mapping des types de maladies pour associer le nom de type de maladie à son identifiant dans la base de données
                disease_type_dict[diseaseType_name] = disease_type_id

            # vérifie si le nom de type de sévérité n'existe pas déjà dans la liste des noms de types de sévérité existants
            if severityType_name not in severity_type_names:
                
                # si le nom de type de sévérité n'existe pas, il crée une nouvelle entrée dans la table des types de sévérité en utilisant la méthode create du repository des types de sévérité, et stocke l'identifiant de la nouvelle entrée dans la variable
                severity_type_id = severityTypes_repo.create(severityType_name)
                
                # ajoute le nom de type de sévérité à la liste des noms de types de sévérité existants pour éviter les doublons lors de l'insertion des prochaines données
                severity_type_names.append(severityType_name)
                
                # ajoute une entrée dans le dictionnaire de mapping des types de sévérité pour associer le nom de type de sévérité à son identifiant dans la base de données
                severity_type_dict[severityType_name] = severity_type_id

            # vérifie si le nom de niveau d'activité physique n'existe pas déjà dans la liste des noms de niveaux d'activité physique existants
            if physicalActivityLevel_name not in physical_activity_level_names:
                
                # si le nom de niveau d'activité physique n'existe pas, il crée une nouvelle entrée dans la table des niveaux d'activité physique en utilisant la méthode create du repository des niveaux d'activité physique, et stocke l'identifiant de la nouvelle entrée dans la variable
                physical_activity_level_id = physicalActivityLevels_repo.create(physicalActivityLevel_name)
                
                # ajoute le nom de niveau d'activité physique à la liste des noms de niveaux d'activité physique existants pour éviter les doublons lors de l'insertion des prochaines données
                physical_activity_level_names.append(physicalActivityLevel_name)
                
                # ajoute une entrée dans le dictionnaire de mapping des niveaux d'activité physique pour associer le nom de niveau d'activité physique à son identifiant dans la base de données
                physical_activity_level_dict[physicalActivityLevel_name] = physical_activity_level_id

            # vérifie si le nom de type de cuisine préféré n'existe pas déjà dans la liste des noms de types de cuisine préférés existants
            if preferredCuisineType_name not in preferred_cuisine_type_names:
                
                # si le nom de type de cuisine préféré n'existe pas, il crée une nouvelle entrée dans la table des types de cuisine préférés en utilisant la méthode create du repository des types de cuisine préférés, et stocke l'identifiant de la nouvelle entrée dans la variable
                preferred_cuisine_type_id = preferredCuisineTypes_repo.create(preferredCuisineType_name)
                
                # ajoute le nom de type de cuisine préféré à la liste des noms de types de cuisine préférés existants pour éviter les doublons lors de l'insertion des prochaines données
                preferred_cuisine_type_names.append(preferredCuisineType_name)
                
                # ajoute une entrée dans le dictionnaire de mapping des types de cuisine préférés pour associer le nom de type de cuisine préféré à son identifiant dans la base de données
                preferred_cuisine_type_dict[preferredCuisineType_name] = preferred_cuisine_type_id

            # vérifie si le nom de type de recommandation diététique n'existe pas déjà dans la liste des noms de types de recommandations diététiques existants
            if dietRecommandationType_name not in diet_recommandation_type_names:
                
                # si le nom de type de recommandation diététique n'existe pas, il crée une nouvelle entrée dans la table des types de recommandations diététiques en utilisant la méthode create du repository des types de recommandations diététiques, et stocke l'identifiant de la nouvelle entrée dans la variable
                diet_recommandation_type_id = dietRecommandationTypes_repo.create(dietRecommandationType_name)
                
                # ajoute le nom de type de recommandation diététique à la liste des noms de types de recommandations diététiques existants pour éviter les doublons lors de l'insertion des prochaines données
                diet_recommandation_type_names.append(dietRecommandationType_name)
                
                # ajoute une entrée dans le dictionnaire de mapping des types de recommandations diététiques pour associer le nom de type de recommandation diététique à son identifiant dans la base de données
                diet_recommandation_type_dict[dietRecommandationType_name] = diet_recommandation_type_id

            # récupère les identifiants correspondants aux noms de genre, d'allergie, de restriction alimentaire, de type de maladie, de type de sévérité, de niveau d'activité physique, de type de cuisine préféré et de type de recommandation diététique à partir des dictionnaires de mapping, et les stocke dans les variables
            gender_id = gender_dict[gender_name]
            allergie_id = allergie_dict[allergie_name]
            dietary_restriction_id = dietary_restriction_dict[dietaryRestriction_name]
            disease_type_id = disease_type_dict[diseaseType_name]
            severity_type_id = severity_type_dict[severityType_name]
            physical_activity_level_id = physical_activity_level_dict[physicalActivityLevel_name]
            preferred_cuisine_type_id = preferred_cuisine_type_dict[preferredCuisineType_name]
            diet_recommandation_type_id = diet_recommandation_type_dict[dietRecommandationType_name]

            # crée une instance de la classe DietRecommandation en utilisant les valeurs des différentes colonnes de la ligne courante, ainsi que les identifiants récupérés précédemment, et stocke cette instance dans la variable
            dietRecommandation = DietRecommandation(
                age=row["Age"],
                gender=gender_id,
                height_cm=row["Height_cm"],
                current_weight_kg=row["Weight_kg"],
                BMI=row["BMI"],
                disease_type=disease_type_id,
                severity=severity_type_id,
                diet_recommandation=diet_recommandation_type_id,
                daily_caloric_target=row["Daily_Caloric_Intake"],
                activity_level=physical_activity_level_id,
                cholesterol_mg=row["Cholesterol_mg/dL"],
                blood_preassure_mmhg=row["Blood_Pressure_mmHg"],
                glucose_mg_dl=row["Glucose_mg/dL"],
                dietary_restrictions=dietary_restriction_id,
                allergie=allergie_id,
                preferred_cuisine=preferred_cuisine_type_id,
                weekly_exercice_hours=row["Weekly_Exercise_Hours"],
                adherence_to_diet_plan=row["Adherence_to_Diet_Plan"],
                dietary_nutrinent_imbalance_score=row["Dietary_Nutrient_Imbalance_Score"],
            )

            # insère l'instance de la classe DietRecommandation dans la base de données en utilisant la méthode create du repository des recommandations diététiques
            dietRecommandations_repo.create(dietRecommandation)

        # ferme les connexions aux repositories pour libérer les ressources utilisées
        genders_repo.close()
        allergies_repo.close()
        dietaryRestrictions_repo.close()
        diseaseTypes_repo.close()
        severityTypes_repo.close()
        physicalActivityLevels_repo.close()
        preferredCuisineTypes_repo.close()
        dietRecommandationTypes_repo.close()
        dietRecommandations_repo.close()

    # définit l'ordre d'exécution des tâches dans le DAG
    data = extract()
    cleaned = transform(data)
    load(cleaned)
