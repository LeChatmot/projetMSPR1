from Models.DietRecommandation import DietRecommandation
from Repositories.BaseRepository import BaseRepository

class DietRecommandationsRepository(BaseRepository):

    TABLE = 'diet_recommandations'

    def __init__(self):
        super().__init__()

    def create(self, d: DietRecommandation) -> DietRecommandation:
        last_id = self._execute(
            f"""INSERT INTO {self.TABLE}
            (age, gender, height_cm, current_weight_kg, BMI, disease_type, severity,
            diet_recommandation, daily_caloric_target, activity_level, cholesterol_mg,
            blood_preassure_mmhg, glucose_mg_dl, dietary_restrictions, allergie,
            preferred_cuisine, weekly_exercice_hours, adherence_to_diet_plan,
            dietary_nutrinent_imbalance_score)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)""",
            (d.age, d.gender, d.height_cm, d.current_weight_kg, d.BMI, d.disease_type, d.severity,
             d.diet_recommandation, d.daily_caloric_target, d.activity_level, d.cholesterol_mg,
             d.blood_preassure_mmhg, d.glucose_mg_dl, d.dietary_restrictions, d.allergie,
             d.preferred_cuisine, d.weekly_exercice_hours, d.adherence_to_diet_plan,
             d.dietary_nutrinent_imbalance_score)
        )
        d.id = last_id
        return d

    def getAll(self) -> list[dict]:
        # On fait des JOIN pour récupérer les noms (ex: 'Arachides') au lieu des IDs (ex: 1)
        # C'est utile pour l'affichage Admin
        query = f"""
            SELECT dr.*, 
                   g.name as gender_name,
                   dt.name as disease_name,
                   a.name as allergy_name,
                   drt.name as diet_name
            FROM {self.TABLE} dr
            LEFT JOIN genders g ON dr.gender = g.id
            LEFT JOIN disease_types dt ON dr.disease_type = dt.id
            LEFT JOIN allergies a ON dr.allergy = a.id
            LEFT JOIN diet_recommandation_types drt ON dr.diet_recommendation = drt.id
            LIMIT 100
        """
        return self._fetch_all(query)

    def delete(self, id: int) -> bool:
        """Fonctionnalité Admin : Supprimer une recommandation"""
        self._execute(f"DELETE FROM {self.TABLE} WHERE id = %s", (id,))
        return True

    def truncate(self) -> None:
        """Vide la table"""
        self._execute(f"TRUNCATE TABLE {self.TABLE}")

    def get_diet_distribution(self) -> list[dict]:
        """Calcule la répartition des régimes recommandés."""
        query = f"""
            SELECT
                drt.name AS name,
                COUNT(dr.id) AS value
            FROM {self.TABLE} dr
            JOIN diet_recommandation_types drt ON dr.diet_recommendation = drt.id
            GROUP BY drt.name
            ORDER BY value DESC
        """
        return self._fetch_all(query)

    def get_nutrition_stats(self) -> dict:
        """Calcule les statistiques de nutrition."""
        query = f"""
            SELECT
                COUNT(DISTINCT diet_recommendation) as totalDietTypes,
                AVG(daily_caloric_target) as averageCaloriesPerDay
            FROM {self.TABLE}
        """
        stats = self._fetch_one(query)
        if not stats or stats.get('totalDietTypes') is None:
            return {'totalDietTypes': 0, 'activePlans': 0, 'averageCaloriesPerDay': 0, 'availableRecipes': 0}
        
        stats['activePlans'] = stats.get('totalDietTypes', 0)
        stats['availableRecipes'] = (stats.get('totalDietTypes', 0) or 0) * 3
        return stats
