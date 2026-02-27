class Patient:

    def __init__(self,
                 id: int = None,
                 age: int = None,
                 gender: str = None,
                 height: int = None,
                 weight: int = None,
                 disease_type: str = None,
                 diet_recommendation: str = None,
                 daily_caloric_target: str = None):
        self.id = id
        self.age = age
        self.gender = gender
        self.height = height
        self.weight = weight
        self.disease_type = disease_type
        self.diet_recommendation = diet_recommendation
        self.daily_caloric_target = daily_caloric_target

    @staticmethod
    def from_dict(data: dict) -> 'Patient':
        p = Patient()
        p._id = data['id']
        p._age = data['age']
        p._gender = data['gender']
        p._height = data['height_cm']
        p._weight = data['current_weight_kg']
        p._disease_type = data['disease_type']
        p._diet_recommendation = data['diet_recommendation']
        p._daily_caloric_target = data['daily_caloric_target']
        return p

    def getId(self):
        return self.id

    def setId(self, id: int):
        self.id = id

    def getAge(self):
        return self.age

    def setAge(self, age: int):
        self.age = age

    def getGender(self):
        return self.gender

    def setGender(self, gender: str):
        self.gender = gender

    def getHeight(self):
        return self.height

    def setHeight(self, height: int):
        self.height = height

    def getWeight(self):
        return self.weight

    def setWeight(self, weight: int):
        self.weight = weight

    def getDiseaseType(self):
        return self.disease_type

    def setDiseaseType(self, disease_type: str):
        self.disease_type = disease_type

    def getDietRecommendation(self):
        return self.diet_recommendation

    def setDietRecommendation(self, diet_recommendation: str):
        self.diet_recommendation = diet_recommendation

    def getDailyCaloricTarget(self):
        return self.daily_caloric_target

    def setDailyCaloricTarget(self, daily_caloric_target: str):
        self.daily_caloric_target = daily_caloric_target