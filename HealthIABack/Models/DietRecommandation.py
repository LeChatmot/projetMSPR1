from Models.Allergie import Allergie
from Models.DietRecommandationType import DietRecommandationType
from Models.DietaryRestriction import DietaryRestriction
from Models.DiseaseType import DiseaseType
from Models.Gender import Gender
from Models.PhysicalActivityLevel import PhysicalActivityLevel
from Models.PreferredCuisineType import PreferredCuisineType
from Models.SeverityType import SeverityType
from Models.IdNameTableGeneric import IdNameTableGeneric


class DietRecommandation(IdNameTableGeneric):

    id_field = "id_diet_recommandations"

    def __init__(self,
                 id: int = None,
                 age: int = None,
                 gender: Gender = None,
                 height_cm: int = None,
                 current_weight_kg: float = None,
                 bmi: float = None,
                 disease_type: DiseaseType = None,
                 severity: SeverityType = None,
                 diet_recommandation: DietRecommandationType = None,
                 daily_caloric_target: int = None,
                 activity_level: PhysicalActivityLevel = None,
                 created_at: int = None,
                 cholesterol_mg: float = None,
                 blood_pressure_mmhg: int = None,
                 glucose_mg_dl: float = None,
                 dietary_restrictions: DietaryRestriction = None,
                 allergy: Allergie = None,
                 preferred_cuisine: PreferredCuisineType = None,
                 weekly_exercise_hours: float = None,
                 adherence_to_diet_plan: float = None,
                 dietary_nutrient_imbalance_score: float = None,
                 ):
        super().__init__(id, None)
        self.age = age
        self.gender = gender
        self.height_cm = height_cm
        self.current_weight_kg = current_weight_kg
        self.bmi = bmi
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
        self.allergy = allergy
        self.preferred_cuisine = preferred_cuisine
        self.weekly_exercise_hours = weekly_exercise_hours
        self.adherence_to_diet_plan = adherence_to_diet_plan
        self.dietary_nutrient_imbalance_score = dietary_nutrient_imbalance_score

    @classmethod
    def from_dict(cls, data: dict):
        if not data:
            return None
        return cls(
            id=data.get(cls.id_field),
            age=data.get('age'),
            gender=data.get('gender'),
            height_cm=data.get('height_cm'),
            current_weight_kg=data.get('current_weight_kg'),
            bmi=data.get('bmi'),
            disease_type=data.get('disease_type'),
            severity=data.get('severity'),
            diet_recommandation=data.get('diet_recommandation'),
            daily_caloric_target=data.get('daily_caloric_target'),
            activity_level=data.get('activity_level'),
            created_at=data.get('created_at'),
            cholesterol_mg=data.get('cholesterol_mg'),
            blood_pressure_mmhg=data.get('blood_pressure_mmhg'),
            glucose_mg_dl=data.get('glucose_mg_dl'),
            dietary_restrictions=data.get('dietary_restrictions'),
            allergy=data.get('allergy'),
            preferred_cuisine=data.get('preferred_cuisine'),
            weekly_exercise_hours=data.get('weekly_exercise_hours'),
            adherence_to_diet_plan=data.get('adherence_to_diet_plan'),
            dietary_nutrient_imbalance_score=data.get('dietary_nutrient_imbalance_score'),
        )

    def getAge(self):
        return self.age

    def setAge(self, value):
        self.age = value

    def getGender(self):
        return self.gender

    def setGender(self, value):
        self.gender = value

    def getHeightCm(self):
        return self.height_cm

    def setHeightCm(self, value):
        self.height_cm = value

    def getCurrentWeightKg(self):
        return self.current_weight_kg

    def setCurrentWeightKg(self, value):
        self.current_weight_kg = value

    def getBmi(self):
        return self.bmi

    def setBmi(self, value):
        self.bmi = value

    def getDiseaseType(self):
        return self.disease_type

    def setDiseaseType(self, value):
        self.disease_type = value

    def getSeverity(self):
        return self.severity

    def setSeverity(self, value):
        self.severity = value

    def getDietRecommandation(self):
        return self.diet_recommandation

    def setDietRecommandation(self, value):
        self.diet_recommandation = value

    def getDailyCaloricTarget(self):
        return self.daily_caloric_target

    def setDailyCaloricTarget(self, value):
        self.daily_caloric_target = value

    def getActivityLevel(self):
        return self.activity_level

    def setActivityLevel(self, value):
        self.activity_level = value

    def getCreatedAt(self):
        return self.created_at

    def setCreatedAt(self, value):
        self.created_at = value

    def getCholesterolMg(self):
        return self.cholesterol_mg

    def setCholesterolMg(self, value):
        self.cholesterol_mg = value

    def getBloodPressureMmhg(self):
        return self.blood_pressure_mmhg

    def setBloodPressureMmhg(self, value):
        self.blood_pressure_mmhg = value

    def getGlucoseMgDl(self):
        return self.glucose_mg_dl

    def setGlucoseMgDl(self, value):
        self.glucose_mg_dl = value

    def getDietaryRestrictions(self):
        return self.dietary_restrictions

    def setDietaryRestrictions(self, value):
        self.dietary_restrictions = value

    def getAllergy(self):
        return self.allergy

    def setAllergy(self, value):
        self.allergy = value

    def getPreferredCuisine(self):
        return self.preferred_cuisine

    def setPreferredCuisine(self, value):
        self.preferred_cuisine = value

    def getWeeklyExerciseHours(self):
        return self.weekly_exercise_hours

    def setWeeklyExerciseHours(self, value):
        self.weekly_exercise_hours = value

    def getAdherenceToDietPlan(self):
        return self.adherence_to_diet_plan

    def setAdherenceToDietPlan(self, value):
        self.adherence_to_diet_plan = value

    def getDietaryNutrientImbalanceScore(self):
        return self.dietary_nutrient_imbalance_score

    def setDietaryNutrientImbalanceScore(self, value):
        self.dietary_nutrient_imbalance_score = value
