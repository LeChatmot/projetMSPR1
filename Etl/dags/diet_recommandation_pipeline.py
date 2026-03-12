import sys
import os

sys.path.append(os.path.join(os.path.dirname(__file__), '../../HealthIABack'))

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

    @task
    def extract():

        df_diet = pd.read_csv(os.path.join(DATASETS_PATH, 'diet_recommendations_dataset.csv'), on_bad_lines='skip')

        output_path = os.path.join(DATASETS_PATH, 'diet_recommendations.csv')

        df_diet.to_csv(output_path, index=False)

        return output_path

    @task
    def transform(file_path):

        df_diet = pd.read_csv(file_path)

        df_diet['Disease_Type'] = df_diet['Disease_Type'].fillna('Unknown')

        df_diet['Dietary_Restrictions'] = df_diet['Dietary_Restrictions'].fillna('Unknown')

        df_diet['Allergies'] = df_diet['Allergies'].fillna('Unknown')

        output_path = os.path.join(DATASETS_PATH, 'diet_clean.csv')

        df_diet.to_csv(output_path, index=False)

        return output_path


    @task
    def load(file_path):

        df_diet = pd.read_csv(file_path)

        genders_repo = GendersRepository()
        allergies_repo = AllergiesRepository()
        dietaryRestrictions_repo = DietaryRestrictionsRepository()
        diseaseTypes_repo = DiseaseTypesRepository()
        severityTypes_repo = SeverityTypesRepository()
        physicalActivityLevels_repo = PhysicalActivityLevelsRepository()
        preferredCuisineTypes_repo = PreferredCuisineTypesRepository()
        dietRecommandationTypes_repo = DietRecommandationTypesRepository()
        dietRecommandations_repo = DietRecommandationsRepository()

        all_genders = genders_repo.getAll()
        gender_dict = {g['name']: g['id'] for g in all_genders}
        gender_names = [g['name'] for g in all_genders]

        all_allergies = allergies_repo.getAll()
        allergie_dict = {a['name']: a['id'] for a in all_allergies}
        allergie_names = [a['name'] for a in all_allergies]

        all_dietary_restrictions = dietaryRestrictions_repo.getAll()
        dietary_restriction_dict = {dir['name']: dir['id'] for dir in all_dietary_restrictions}
        dietary_restriction_names = [dir['name'] for dir in all_dietary_restrictions]

        all_disease_types = diseaseTypes_repo.getAll()
        disease_type_dict = {dt['name']: dt['id'] for dt in all_disease_types}
        disease_type_names = [dt['name'] for dt in all_disease_types]

        all_severity_types = severityTypes_repo.getAll()
        severity_type_dict = {s['name']: s['id'] for s in all_severity_types}
        severity_type_names = [s['name'] for s in all_severity_types]

        all_physical_activity_levels = physicalActivityLevels_repo.getAll()
        physical_activity_level_dict = {pa['name']: pa['id'] for pa in all_physical_activity_levels}
        physical_activity_level_names = [pa['name'] for pa in all_physical_activity_levels]

        all_preferred_cuisine_types = preferredCuisineTypes_repo.getAll()
        preferred_cuisine_type_dict = {pc['name']: pc['id'] for pc in all_preferred_cuisine_types}
        preferred_cuisine_type_names = [pc['name'] for pc in all_preferred_cuisine_types]

        all_diet_recommandation_types = dietRecommandationTypes_repo.getAll()
        diet_recommandation_type_dict = {dier['name']: dier['id'] for dier in all_diet_recommandation_types}
        diet_recommandation_type_names = [dier['name'] for dier in all_diet_recommandation_types]

        for _, row in df_diet.iterrows():
            gender_name = row["Gender"]
            allergie_name = row["Allergies"]
            dietaryRestriction_name = row["Dietary_Restrictions"]
            diseaseType_name = row["Disease_Type"]
            severityType_name = row["Severity"]
            physicalActivityLevel_name = row["Physical_Activity_Level"]
            preferredCuisineType_name = row["Preferred_Cuisine"]
            dietRecommandationType_name = row["Diet_Recommendation"]

            if gender_name not in gender_names:
                gender_id = genders_repo.create(gender_name)
                gender_names.append(gender_name)
                gender_dict[gender_name] = gender_id

            if allergie_name not in allergie_names:
                allergie_id = allergies_repo.create(allergie_name)
                allergie_names.append(allergie_name)
                allergie_dict[allergie_name] = allergie_id

            if dietaryRestriction_name not in dietary_restriction_names:
                dietary_restriction_id = dietaryRestrictions_repo.create(dietaryRestriction_name)
                dietary_restriction_names.append(dietaryRestriction_name)
                dietary_restriction_dict[dietaryRestriction_name] = dietary_restriction_id

            if diseaseType_name not in disease_type_names:
                disease_type_id = diseaseTypes_repo.create(diseaseType_name)
                disease_type_names.append(diseaseType_name)
                disease_type_dict[diseaseType_name] = disease_type_id

            if severityType_name not in severity_type_names:
                severity_type_id = severityTypes_repo.create(severityType_name)
                severity_type_names.append(severityType_name)
                severity_type_dict[severityType_name] = severity_type_id

            if physicalActivityLevel_name not in physical_activity_level_names:
                physical_activity_level_id = physicalActivityLevels_repo.create(physicalActivityLevel_name)
                physical_activity_level_names.append(physicalActivityLevel_name)
                physical_activity_level_dict[physicalActivityLevel_name] = physical_activity_level_id

            if preferredCuisineType_name not in preferred_cuisine_type_names:
                preferred_cuisine_type_id = preferredCuisineTypes_repo.create(preferredCuisineType_name)
                preferred_cuisine_type_names.append(preferredCuisineType_name)
                preferred_cuisine_type_dict[preferredCuisineType_name] = preferred_cuisine_type_id

            if dietRecommandationType_name not in diet_recommandation_type_names:
                diet_recommandation_type_id = dietRecommandationTypes_repo.create(dietRecommandationType_name)
                diet_recommandation_type_names.append(dietRecommandationType_name)
                diet_recommandation_type_dict[dietRecommandationType_name] = diet_recommandation_type_id

            gender_id = gender_dict[gender_name]
            allergie_id = allergie_dict[allergie_name]
            dietary_restriction_id = dietary_restriction_dict[dietaryRestriction_name]
            disease_type_id = disease_type_dict[diseaseType_name]
            severity_type_id = severity_type_dict[severityType_name]
            physical_activity_level_id = physical_activity_level_dict[physicalActivityLevel_name]
            preferred_cuisine_type_id = preferred_cuisine_type_dict[preferredCuisineType_name]
            diet_recommandation_type_id = diet_recommandation_type_dict[dietRecommandationType_name]

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

            dietRecommandations_repo.create(dietRecommandation)

        genders_repo.close()
        allergies_repo.close()
        dietaryRestrictions_repo.close()
        diseaseTypes_repo.close()
        severityTypes_repo.close()
        physicalActivityLevels_repo.close()
        preferredCuisineTypes_repo.close()
        dietRecommandationTypes_repo.close()
        dietRecommandations_repo.close()

    data = extract()
    cleaned = transform(data)
    load(cleaned)
