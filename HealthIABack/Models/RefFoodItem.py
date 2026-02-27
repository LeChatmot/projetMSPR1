class RefFoodItem:

    def __init__(self,
                 id: int,
                 name: str,
                 category: str,
                 calories_kcal: int,
                 proteins_g: float,
                 carbs_g: float,
                 fat_g: float
                 ):
        self.id = id
        self.name = name
        self.category = category
        self.calories_kcal = calories_kcal
        self.proteins_g = proteins_g
        self.carbs_g = carbs_g
        self.fat_g = fat_g

    def getId(self):
        return self.id

    def setId(self, id: int):
        self.id = id

    def getName(self):
        return self.name

    def setName(self, name: str):
        self.name = name

    def getCategory(self):
        return self.category

    def setCategory(self, category: str):
        self.category = category

    def getCalories_kcal(self):
        return self.calories_kcal

    def setCalories_kcal(self, calories_kcal: int):
        self.calories_kcal = calories_kcal

    def getProteins_g(self):
        return self.proteins_g

    def setProteins_g(self, proteins_g: float):
        self.proteins_g = proteins_g

    def getCarbs_g(self):
        return self.carbs_g

    def setCarbs_g(self, carbs_g: float):
        self.carbs_g = carbs_g

    def getFat_g(self):
        return self.fat_g

    def setFat_g(self, fat_g: float):
        self.fat_g = fat_g