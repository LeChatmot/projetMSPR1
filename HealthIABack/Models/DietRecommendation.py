from Models.Allergie import Allergie
from Models.DietRecommandationType import DietRecommandationType
from Models.DietaryRestriction import DietaryRestriction
from Models.DiseaseType import DiseaseType
from Models.Gender import Gender
from Models.PhysicalActivityLevel import PhysicalActivityLevel
from Models.PreferredCuisineType import PreferredCuisineType
from Models.ServerityType import SeverityType


class DietRecommendation:

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
                 blood_preassure_mmhg: int= None,
                 glucose_mg_dl: float = None,
                 dietary_restrictions: DietaryRestriction= None,
                 allergie: Allergie= None,
                 preferred_cuisine: PreferredCuisineType= None,
                 weekly_exercice_hours: float= None,
                 adherence_to_diet_plan: float= None,
                 dietary_nutrinent_imbalance_score: float= None,
    ):
        self.id = id
        self.age = age
        self.gender = gender
        self.height_cm = height_cm
        self.current_weight_kg = current_weight_kg
        self.BMI = BMI
        self.disease_type = disease_type
        self.severity = severity
        self.diet_recommandation = diet_recommandation
        self.daily_caloric_target = daily_caloric_target
        self.activity_level = activity_level
        self.created_at = created_at
        self.cholesterol_mg = cholesterol_mg
        self.blood_preassure_mmhg = blood_preassure_mmhg
        self.glucose_mg_dl = glucose_mg_dl
        self.dietary_restrictions = dietary_restrictions
        self.allergie = allergie
        self.preferred_cuisine = preferred_cuisine
        self.weekly_exercice_hours = weekly_exercice_hours
        self.adherence_to_diet_plan = adherence_to_diet_plan
        self.dietary_nutrinent_imbalance_score = dietary_nutrinent_imbalance_score

    def getId(self):
        return self._id

    def setId(self, value):
        self._id = value

    def getAge(self):
        return self._age

    def setAge(self, value):
        self._age = value

    def getGender(self):
        return self._gender

    def setGender(self, value):
        self._gender = value

    def getHeightCm(self):
        return self._height_cm

    def setHeightCm(self, value):
        self._height_cm = value

    def getCurrentWeightKg(self):
        return self._current_weight_kg

    def setCurrentWeightKg(self, value):
        self._current_weight_kg = value

    def getBMI(self):
        return self._BMI

    def setBMI(self, value):
        self._BMI = value

    def getDiseaseType(self):
        return self._disease_type

    def setDiseaseType(self, value):
        self._disease_type = value

    def getSeverity(self):
        return self._severity

    def setSeverity(self, value):
        self._severity = value

    def getDietRecommandation(self):
        return self._diet_recommandation

    def setDietRecommandation(self, value):
        self._diet_recommandation = value

    def getDailyCaloricTarget(self):
        return self._daily_caloric_target

    def setDailyCaloricTarget(self, value):
        self._daily_caloric_target = value

    def getActivityLevel(self):
        return self._activity_level

    def setActivityLevel(self, value):
        self._activity_level = value

    def getCreatedAt(self):
        return self._created_at

    def setCreatedAt(self, value):
        self._created_at = value

    def getCholesterolMg(self):
        return self._cholesterol_mg

    def setCholesterolMg(self, value):
        self._cholesterol_mg = value

    def getBloodPreassureMmhg(self):
        return self._blood_preassure_mmhg

    def setBloodPreassureMmhg(self, value):
        self._blood_preassure_mmhg = value

    def getGlucoseMgDl(self):
        return self._glucose_mg_dl

    def setGlucoseMgDl(self, value):
        self._glucose_mg_dl = value

    def getDietaryRestrictions(self):
        return self._dietary_restrictions

    def setDietaryRestrictions(self, value):
        self._dietary_restrictions = value

    def getAllergie(self):
        return self._allergie

    def setAllergie(self, value):
        self._allergie = value

    def getPreferredCuisine(self):
        return self._preferred_cuisine

    def setPreferredCuisine(self, value):
        self._preferred_cuisine = value

    def getWeeklyExerciceHours(self):
        return self._weekly_exercice_hours

    def setWeeklyExerciceHours(self, value):
        self._weekly_exercice_hours = value

    def getAdherenceToDietPlan(self):
        return self._adherence_to_diet_plan

    def setAdherenceToDietPlan(self, value):
        self._adherence_to_diet_plan = value

    def getDietaryNutrinentImbalanceScore(self):
        return self._dietary_nutrinent_imbalance_score

    def setDietaryNutrinentImbalanceScore(self, value):
        self._dietary_nutrinent_imbalance_score = value