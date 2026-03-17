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
from Repositories.DailyFoodCategoriesRepository import DailyFoodCategoriesRepository
from Repositories.MealTypesRepository import MealTypesRepository
from Repositories.DailyFoodsRepository import DailyFoodsRepository
from Models.DailyFoodCategory import DailyFoodCategory
from Models.MealType import MealType
from Models.DailyFood import DailyFood

# Remonte depuis le fichier DAG jusqu'au dossier Datasets
DATASETS_PATH = '/opt/airflow/Datasets/'

with DAG(
    dag_id="daily_food_pipeline",
    start_date=datetime(2026, 2, 14),
    schedule=None,
    catchup=False,
) as dag:

    @task
    def extract():

        df_daily_food = pd.read_csv(os.path.join(DATASETS_PATH, 'daily_food_nutrition_dataset.csv'), on_bad_lines='skip')

        output_path = os.path.join(DATASETS_PATH, 'daily_foods.csv')

        df_daily_food.to_csv(output_path, index=False)

        return output_path

    @task
    def transform(file_path):

        df_daily_food = pd.read_csv(file_path)

        df_daily_food['Calories (kcal)'] = df_daily_food['Calories (kcal)'].astype(int)

        output_path = os.path.join(DATASETS_PATH, 'daily_food_clean.csv')

        df_daily_food.to_csv(output_path, index=False)

        return output_path


    @task
    def load(file_path):

        df_daily_food = pd.read_csv(file_path)

        dailyFoodCategories_repo = DailyFoodCategoriesRepository()
        mealTypes_repo = MealTypesRepository()
        dailyFoods_repo = DailyFoodsRepository()

        all_daily_food_categories = dailyFoodCategories_repo.getAll()
        daily_food_categorie_dict = {d['name']: d['id'] for d in all_daily_food_categories}
        daily_food_categorie_names = [d['name'] for d in all_daily_food_categories]

        all_meal_types = mealTypes_repo.getAll()
        meal_type_dict = {m['name']: m['id'] for m in all_meal_types}
        meal_type_names = [m['name'] for m in all_meal_types]

        for _, row in df_daily_food.iterrows():
            dailyFoodCategorie_name = row["Category"]
            mealType_name = row["Food_Item"]

            if dailyFoodCategorie_name not in daily_food_categorie_names:
                daily_food_categorie_id = dailyFoodCategories_repo.create(dailyFoodCategorie_name)
                daily_food_categorie_names.append(dailyFoodCategorie_name)
                daily_food_categorie_dict[dailyFoodCategorie_name] = daily_food_categorie_id

            if mealType_name not in meal_type_names:
                meal_type_id = mealTypes_repo.create(mealType_name)
                meal_type_names.append(mealType_name)
                meal_type_dict[mealType_name] = meal_type_id

            daily_food_categorie_id = daily_food_categorie_dict[dailyFoodCategorie_name]
            meal_type_id = meal_type_dict[mealType_name]

            dailyFood = DailyFood(
                name=row["Food_Item"],
                category=daily_food_categorie_id,
                calories_kcal=row["Calories (kcal)"],
                protein_g=row["Protein (g)"],
                carbs_g=row["Carbohydrates (g)"],
                fat_g=row["Fat (g)"],
                fiber_g=row["Fiber (g)"],
                sugar_g=row["Sugars (g)"],
                sodium=row["Sodium (mg)"],
                cholesterol=row["Cholesterol (mg)"],
                meal_type=meal_type_id,
                water_intake_ml=row["Water_Intake (ml)"],
            )

            dailyFoods_repo.create(dailyFood)

        dailyFoodCategories_repo.close()
        mealTypes_repo.close()
        dailyFoods_repo.close()

    data = extract()
    cleaned = transform(data)
    load(cleaned)
