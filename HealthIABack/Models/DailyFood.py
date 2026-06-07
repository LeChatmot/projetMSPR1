from Models.MealType import MealType
from Models.DailyFoodCategory import DailyFoodCategory
from Models.IdNameTableGeneric import IdNameTableGeneric


class DailyFood(IdNameTableGeneric):

    id_field = "id_daily_foods"

    def __init__(self,
                 id: int = None,
                 name: str = None,
                 category: DailyFoodCategory = None,
                 calories_kcal: int = None,
                 protein_g: float = None,
                 carbs_g: float = None,
                 fat_g: float = None,
                 fiber_g: float = None,
                 sugar_g: float = None,
                 sodium: int = None,
                 cholesterol: int = None,
                 meal_type: MealType = None,
                 water_intake_ml: int = None,
                 ):
        super().__init__(id, name)
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

    @classmethod
    def from_dict(cls, data: dict):
        if not data:
            return None
        return cls(
            id=data[cls.id_field],
            name=data['name'],
            category=data.get('category'),
            calories_kcal=data.get('calories_kcal'),
            protein_g=data.get('protein_g'),
            carbs_g=data.get('carbs_g'),
            fat_g=data.get('fat_g'),
            fiber_g=data.get('fiber_g'),
            sugar_g=data.get('sugar_g'),
            sodium=data.get('sodium'),
            cholesterol=data.get('cholesterol'),
            meal_type=data.get('meal_type'),
            water_intake_ml=data.get('water_intake_ml'),
        )

    def getCategory(self):
        return self.category

    def setCategory(self, value):
        self.category = value

    def getCaloriesKcal(self):
        return self.calories_kcal

    def setCaloriesKcal(self, value):
        self.calories_kcal = value

    def getProteinG(self):
        return self.protein_g

    def setProteinG(self, value):
        self.protein_g = value

    def getCarbsG(self):
        return self.carbs_g

    def setCarbsG(self, value):
        self.carbs_g = value

    def getFatG(self):
        return self.fat_g

    def setFatG(self, value):
        self.fat_g = value

    def getFiberG(self):
        return self.fiber_g

    def setFiberG(self, value):
        self.fiber_g = value

    def getSugarG(self):
        return self.sugar_g

    def setSugarG(self, value):
        self.sugar_g = value

    def getSodium(self):
        return self.sodium

    def setSodium(self, value):
        self.sodium = value

    def getCholesterol(self):
        return self.cholesterol

    def setCholesterol(self, value):
        self.cholesterol = value

    def getMealType(self):
        return self.meal_type

    def setMealType(self, value):
        self.meal_type = value

    def getWaterIntakeMl(self):
        return self.water_intake_ml

    def setWaterIntakeMl(self, value):
        self.water_intake_ml = value