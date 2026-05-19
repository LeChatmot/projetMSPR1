from Models.Allergie import Allergie
from Models.DietRecommandationType import DietRecommandationType
from Models.DietaryRestriction import DietaryRestriction
from Models.DiseaseType import DiseaseType
from Models.Gender import Gender
from Models.PhysicalActivityLevel import PhysicalActivityLevel
from Models.PreferredCuisineType import PreferredCuisineType
from Models.SeverityType import SeverityType

class DietRecommandation:

    def __init__(self,
                 id: int= None,
                 age : int= None,
                 gender: Gender= None,
                 height_cm : int = None,
                 current_weight_kg: float = None,
                 BMI: float= None,
                 disease_type: DiseaseType= None,
                 severity: SeverityType= None,
                 diet_recommandation: DietRecommandationType= None,
                 daily_caloric_target: int = None,
                 activity_level: PhysicalActivityLevel= None,
                 created_at: int= None,
                 cholesterol_mg: float= None,
                 blood_pressure_mmhg: int= None,
                 glucose_mg_dl: float = None,
                 dietary_restrictions: DietaryRestriction= None,
                 allergie: Allergie= None,
                 preferred_cuisine: PreferredCuisineType= None,
                 weekly_exercice_hours: float= None,
                 adherence_to_diet_plan: float= None,
                 dietary_nutrient_imbalance_score: float= None,
                 gender_name: str = None,
                 disease_name: str = None,
                 allergy_name: str = None,
                 diet_name: str = None,
    ):
        self.id = id
        self.age = age
        self.gender = gender
        self.height_cm = height_cm
        self.current_weight_kg = current_weight_kg
        self.bmi = BMI
        self.disease_type = disease_type
        self.severity = severity
        self.diet_recommandation = diet_recommandation
        self.daily_caloric_target = daily_caloric_target
        self.activity_level = activity_level
        self.created_at = created_at
        self.cholesterol_mg = cholesterol_mg
        self.blood_pressure_mmhg = blood_pressure_mmhg
        self.glucose_mg_dl = glucose_mg_dl
        self.dietary_restrictions = dietary_restrictions
        self.allergy = allergie
        self.preferred_cuisine = preferred_cuisine
        self.weekly_exercise_hours = weekly_exercice_hours
        self.adherence_to_diet_plan = adherence_to_diet_plan
        self.dietary_nutrient_imbalance_score = dietary_nutrient_imbalance_score
        self.gender_name = gender_name
        self.disease_name = disease_name
        self.allergy_name = allergy_name
        self.diet_name = diet_name

    @staticmethod
    def to_model(row: dict):
        if not row:
            return None
        return DietRecommandation(
            id=row['id'],
            age=row['age'],
            gender=row['gender'],
            height_cm=row['height_cm'],
            current_weight_kg=row['current_weight_kg'],
            BMI=row['bmi'],
            disease_type=row['disease_type'],
            severity=row['severity'],
            diet_recommandation=row['diet_recommandation'],
            daily_caloric_target=row['daily_caloric_target'],
            activity_level=row['activity_level'],
            created_at=row['created_at'],
            cholesterol_mg=row['cholesterol_mg'],
            blood_pressure_mmhg=row['blood_pressure_mmhg'],
            glucose_mg_dl=row['glucose_mg_dl'],
            dietary_restrictions=row['dietary_restrictions'],
            allergie=row['allergy'],
            preferred_cuisine=row['preferred_cuisine'],
            weekly_exercice_hours=row['weekly_exercise_hours'],
            adherence_to_diet_plan=row['adherence_to_diet_plan'],
            dietary_nutrient_imbalance_score=row['dietary_nutrient_imbalance_score'],
            gender_name=row.get('gender_name'),
            disease_name=row.get('disease_name'),
            allergy_name=row.get('allergy_name'),
            diet_name=row.get('diet_name'),
        )
