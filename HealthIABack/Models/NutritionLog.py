from Models.Patient import Patient
from Models.RefFoodItem import RefFoodItem

class NutritionLog:

    def __init__(self,
                 id: int,
                 patient: Patient,
                 food: RefFoodItem,
                 meal_type: str,
                 date_consumed: int):
        self.id = id
        self.patient = patient
        self.food = food
        self.meal_type = meal_type
        self.date_consumed = date_consumed

    def getId(self):
        return self.id

    def setId(self, id: int):
        self.id = id

    def getPatient(self):
        return self.patient

    def setPatient(self, patient: Patient):
        self.patient = patient

    def getFood(self):
        return self.food

    def setFood(self, food: RefFoodItem):
        self.food = food

    def getMealType(self):
        return self.meal_type

    def setMealType(self, meal_type: str):
        self.meal_type = meal_type

    def getDateConsumed(self):
        return self.date_consumed

    def setDateConsumed(self, date_consumed: int):
        self.date_consumed = date_consumed