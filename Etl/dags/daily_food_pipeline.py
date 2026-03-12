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
from Repositories.DailyFoodCategoriesRepository import DailyFoodCategoriesRepository
from Repositories.MealTypesRepository import MealTypesRepository
from Repositories.DailyFoodsRepository import DailyFoodsRepository
from Models.DailyFoodCategory import DailyFoodCategory
from Models.MealType import MealType
from Models.DailyFood import DailyFood

# Remonte depuis le fichier DAG jusqu'au dossier Datasets
DATASETS_PATH = os.path.join(os.path.dirname(__file__), '../../Datasets')

with DAG(
    dag_id="daily_food_pipeline",
    start_date=datetime(2026, 2, 14),
    schedule=None,
    catchup=False,
) as dag:

    # Une tâche qui permet d'extraire les données du fichier excel pour transmettre aux autres tâches
    @task
    def extract():

        # lit le fichier daily_food_nutrition_dataset.csv et évite toutes mauvaises lignes
        df_daily_food = pd.read_csv(os.path.join(DATASETS_PATH, 'daily_food_nutrition_dataset.csv'), on_bad_lines='skip')

        # stocke le fichier avec le chemin dans la variable output_path
        output_path = os.path.join(DATASETS_PATH, 'daily_foods.csv')

        # export dans un autre fichier contenu dans le output_path
        df_daily_food.to_csv(output_path, index=False)

         # retourne le fichier
        return output_path

    # Une tâche qui permet de transformer les données extraites pour que les données soit plus cohérentes et plus propres pour les autres tâches
    @task
    def transform(file_path):

        # # lit le fichier csv à partir du chemin file_path et stocke le contenu dans la variable df_daily_food
        df_daily_food = pd.read_csv(file_path)

        # convertit les colonnes "Calories (kcal)", "Protein (g)", "Carbohydrates (g)", "Fat (g)", "Fiber (g)", "Sugars (g)", "Sodium (mg)" et "Cholesterol (mg)" en type de données entier pour assurer que les valeurs soient traitées comme des nombres entiers
        df_daily_food['Calories (kcal)'] = df_daily_food['Calories (kcal)'].astype(int)

        # stocke le fichier avec le chemin dans la variable output_path
        output_path = os.path.join(DATASETS_PATH, 'daily_food_clean.csv')

        # export dans un autre fichier contenu dans le output_path
        df_daily_food.to_csv(output_path, index=False)

        # retourne le fichier
        return output_path

    # Une tâche qui permet de charger les données transformées dans la base de données pour que les données soit exploitables pour les autres tâches
    @task
    def load(file_path):

        # lit le fichier csv à partir du chemin file_path et stocke le contenu dans la variable df_daily_food
        df_daily_food = pd.read_csv(file_path)

        # crée des instances des repositories pour les différentes tables de la base de données
        dailyFoodCategories_repo = DailyFoodCategoriesRepository()
        mealTypes_repo = MealTypesRepository()
        dailyFoods_repo = DailyFoodsRepository()

        # récupère toutes les catégories de nourriture quotidienne et tous les types de repas existants dans la base de données pour éviter les doublons lors de l'insertion des nouvelles données
        all_daily_food_categories = dailyFoodCategories_repo.getAll()

        # crée des dictionnaires de mapping pour les catégories de nourriture quotidienne et les types de repas, associant les noms aux identifiants correspondants dans la base de données
        daily_food_categorie_dict = {d['name']: d['id'] for d in all_daily_food_categories}

        # crée des listes pour stocker les noms de catégories de nourriture quotidienne et de types de repas existants dans la base de données, afin d'éviter les doublons lors de l'insertion des nouvelles données
        daily_food_categorie_names = [d['name'] for d in all_daily_food_categories]

        # récupère tous les types de repas existants dans la base de données pour éviter les doublons lors de l'insertion des nouvelles données
        all_meal_types = mealTypes_repo.getAll()

        # crée un dictionnaire de mapping pour les types de repas, associant les noms aux identifiants correspondants dans la base de données
        meal_type_dict = {m['name']: m['id'] for m in all_meal_types}

        # crée une liste pour stocker les noms de types de repas existants dans la base de données, afin d'éviter les doublons lors de l'insertion des nouvelles données
        meal_type_names = [m['name'] for m in all_meal_types]

        # parcourt chaque ligne du DataFrame df_daily_food en utilisant la méthode iterrows de pandas, et pour chaque ligne, il effectue les opérations suivantes :
        for _, row in df_daily_food.iterrows():

            # récupère les valeurs des colonnes "Category" et "Food_Item" de la ligne courante, et les stocke dans les variables dailyFoodCategorie_name et mealType_name respectivement
            dailyFoodCategorie_name = row["Category"]
            mealType_name = row["Food_Item"]

            # vérifie si le nom de catégorie de nourriture quotidienne n'existe pas déjà dans la liste des noms de catégories de nourriture quotidienne existants
            if dailyFoodCategorie_name not in daily_food_categorie_names:

                # si le nom de catégorie de nourriture quotidienne n'existe pas, il crée une nouvelle entrée dans la table des catégories de nourriture quotidienne en utilisant la méthode create du repository des catégories de nourriture quotidienne, et stocke l'identifiant de la nouvelle entrée dans la variable
                daily_food_categorie_id = dailyFoodCategories_repo.create(dailyFoodCategorie_name)
                
                # ajoute le nom de catégorie de nourriture quotidienne à la liste des noms de catégories de nourriture quotidienne existants pour éviter les doublons lors de l'insertion des prochaines données
                daily_food_categorie_names.append(dailyFoodCategorie_name)

                # ajoute une entrée dans le dictionnaire de mapping des catégories de nourriture quotidienne pour associer le nom de catégorie de nourriture quotidienne à son identifiant dans la base de données
                daily_food_categorie_dict[dailyFoodCategorie_name] = daily_food_categorie_id

            # vérifie si le nom de type de repas n'existe pas déjà dans la liste des noms de types de repas existants
            if mealType_name not in meal_type_names:
                
                # si le nom de type de repas n'existe pas, il crée une nouvelle entrée dans la table des types de repas en utilisant la méthode create du repository des types de repas, et stocke l'identifiant de la nouvelle entrée dans la variable
                meal_type_id = mealTypes_repo.create(mealType_name)
                
                # ajoute le nom de type de repas à la liste des noms de types de repas existants pour éviter les doublons lors de l'insertion des prochaines données
                meal_type_names.append(mealType_name)
                
                # ajoute une entrée dans le dictionnaire de mapping des types de repas pour associer le nom de type de repas à son identifiant dans la base de données
                meal_type_dict[mealType_name] = meal_type_id

            # récupère les identifiants correspondants aux noms de catégorie de nourriture quotidienne et de type de repas à partir des dictionnaires de mapping, et les stocke dans les variables
            daily_food_categorie_id = daily_food_categorie_dict[dailyFoodCategorie_name]
            meal_type_id = meal_type_dict[mealType_name]

            # crée une instance de la classe DailyFood en utilisant les valeurs des différentes colonnes de la ligne courante, ainsi que les identifiants récupérés précédemment, et stocke cette instance dans la variable
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

            # insère l'instance de la classe DailyFood dans la base de données en utilisant la méthode create du repository des aliments quotidiens
            dailyFoods_repo.create(dailyFood)

        # ferme les connexions aux repositories pour libérer les ressources utilisées
        dailyFoodCategories_repo.close()
        mealTypes_repo.close()
        dailyFoods_repo.close()

    # définit l'ordre d'exécution des tâches dans le DAG
    data = extract()
    cleaned = transform(data)
    load(cleaned)
