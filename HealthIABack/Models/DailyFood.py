from Models.MealType import MealType
from Models.DailyFoodCategory import DailyFoodCategory


class DailyFood:

    def __init__(self,
                 id: int= None,
                 name : str= None,
                 category: DailyFoodCategory= None,
                 calories_kcal : int = None,
                 protein_g: float = None,
                 carbs_g: float= None,
                 fat_g: float= None,
                 fiber_g: float= None,
                 sugar_g: float= None,
                 sodium: int = None,
                 cholesterol: int= None,
                 meal_type: MealType= None,
                 water_intake_ml: int= None,
    ):
        self.id = id
        self.name = name
        self.category = category
        self.calories_kcal = calories_kcal
        self.protein_g = protein_g
        self.carbs_g = carbs_g
        self.fat_g = fat_g
        self.fiber_g = fiber_g
        self.sugar_g = sugar_g
        self.sodium = sodium
        self.cholesterol = cholesterol
        self.meal_type = meal_type
        self.water_intake_ml = water_intake_ml

    @staticmethod
    def to_model(row: dict):
        if not row:
            return None
        return DailyFood(
            id=row['id'],
            name=row['name'],
            category=row['category'],
            calories_kcal=row['calories_kcal'],
            protein_g=row['protein_g'],
            carbs_g=row['carbs_g'],
            fat_g=row['fat_g'],
            fiber_g=row['fiber_g'],
            sugar_g=row['sugar_g'],
            sodium=row['sodium'],
            cholesterol=row['cholesterol'],
            meal_type=row['meal_type'],
            water_intake_ml=row['water_intake_ml'],
        )

    def getId(self):
        return self._id

    def setId(self, value):
        self._id = value

    def getName(self):
        return self._name

    def setName(self, value):
        self._name = value

    def getCategory(self):
        return self._category

    def setCategory(self, value):
        self._category = value

    def getCaloriesKcal(self):
        return self._calories_kcal

    def setCaloriesKcal(self, value):
        self._calories_kcal = value

    def getProteinG(self):
        return self._protein_g

    def setProteinG(self, value):
        self._protein_g = value

    def getCarbsG(self):
        return self._carbs_g

    def setCarbsG(self, value):
        self._carbs_g = value

    def getFatG(self):
        return self._fat_g

    def setFatG(self, value):
        self._fat_g = value

    def getFiberG(self):
        return self._fiber_g

    def setFiberG(self, value):
        self._fiber_g = value

    def getSugarG(self):
        return self._sugar_g

    def setSugarG(self, value):
        self._sugar_g = value

    def getSodium(self):
        return self._sodium

    def setSodium(self, value):
        self._sodium = value

    def getCholesterol(self):
        return self._cholesterol

    def setCholesterol(self, value):
        self._cholesterol = value

    def getMealType(self):
        return self._meal_type

    def setMealType(self, value):
        self._meal_type = value

    def getWaterIntakeMl(self):
        return self._water_intake_ml

    def setWaterIntakeMl(self, value):
        self._water_intake_ml = value
