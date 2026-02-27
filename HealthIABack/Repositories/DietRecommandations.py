from Models.DietRecommendation import DietRecommendation
from Repositories.BaseRepository import BaseRepository


class DietRecommandationsRepository(BaseRepository):

    TABLE = 'diet_recommandations'

    def __init__(self):
        super().__init__()

    def create(self, d: DietRecommendation) -> DietRecommendation:
        last_id = self._execute(
            f"""INSERT INTO {self.TABLE} 
                    (age, gender, height_cm, current_weight_kg, BMI, disease_type, severity,
                    diet_recommandation, daily_caloric_target, activity_level, created_at,
                    cholesterol_mg, blood_preassure_mmhg, glucose_mg_dl, dietary_restrictions,
                    allergie, preferred_cuisine, weekly_exercice_hours, adherence_to_diet_plan,
                    dietary_nutrinent_imbalance_score)
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)""",
            (d.age, d.gender, d.height_cm, d.current_weight_kg, d.BMI, d.disease_type,
             d.severity, d.diet_recommandation, d.daily_caloric_target, d.activity_level,
             d.created_at, d.cholesterol_mg, d.blood_preassure_mmhg, d.glucose_mg_dl,
             d.dietary_restrictions, d.allergie, d.preferred_cuisine, d.weekly_exercice_hours,
             d.adherence_to_diet_plan, d.dietary_nutrinent_imbalance_score)
        )
        d.id = last_id
        return d

    def getById(self, id: int) -> dict | None:
        d = DietRecommendation()
        row = self._fetch_one(f"SELECT * FROM {self.TABLE} WHERE id = %s", (id,))
        return d.to_model(row)

    def getAll(self) -> list:
        res = list()
        rows = self._fetch_all(f"SELECT * FROM {self.TABLE}")
        for row in rows:
            d = DietRecommendation()
            res.append(d.to_model(row))
        return res

    def update(self, d: DietRecommendation) -> None:
        self._execute(
            f"""UPDATE {self.TABLE} SET
                    age = %s, gender = %s, height_cm = %s, current_weight_kg = %s, BMI = %s,
                    disease_type = %s, severity = %s, diet_recommandation = %s, daily_caloric_target = %s,
                    activity_level = %s, created_at = %s, cholesterol_mg = %s, blood_preassure_mmhg = %s,
                    glucose_mg_dl = %s, dietary_restrictions = %s, allergie = %s, preferred_cuisine = %s,
                    weekly_exercice_hours = %s, adherence_to_diet_plan = %s,
                    dietary_nutrinent_imbalance_score = %s
                    WHERE id = %s""",
            (d.age, d.gender, d.height_cm, d.current_weight_kg, d.BMI, d.disease_type,
             d.severity, d.diet_recommandation, d.daily_caloric_target, d.activity_level,
             d.created_at, d.cholesterol_mg, d.blood_preassure_mmhg, d.glucose_mg_dl,
             d.dietary_restrictions, d.allergie, d.preferred_cuisine, d.weekly_exercice_hours,
             d.adherence_to_diet_plan, d.dietary_nutrinent_imbalance_score, d.id)
        )
        return d

    def delete(self, id: int) -> bool:
        self._execute(f"DELETE FROM {self.TABLE} WHERE id = %s", (id,))
        return True