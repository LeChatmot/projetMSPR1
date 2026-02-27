from Models.Gender import Gender
from Models.WorkoutType import WorkoutType


class ExerciseSession:

    def __init__(self,
                 id: int = None,
                 age: int = None,
                 gender: Gender = None,
                 weightKg: int = None,
                 heightCm: int = None,
                 maxBPM: int = None,
                 avgBPM: int = None,
                 restingBPM: int = None,
                 sessionDurationHours: int = None,
                 caloriesBurned: int = None,
                 workoutType: WorkoutType = None,
                 fatPercentage: float = None,
                 waterIntakeLiters: float = None,
                 workoutFrequency: int = None,
                 experienceLevel: int = None,
                 bmi: float = None,
    ):
        self.id = id
        self.age = age
        self.gender = gender
        self.weightKg = weightKg
        self.heightCm = heightCm
        self.maxBPM = maxBPM
        self.avgBPM = avgBPM
        self.restingBPM = restingBPM
        self.sessionDurationHours = sessionDurationHours
        self.caloriesBurned = caloriesBurned
        self.workoutType = workoutType
        self.fatPercentage = fatPercentage
        self.waterIntakeLiters = waterIntakeLiters
        self.workoutFrequency = workoutFrequency
        self.experienceLevel = experienceLevel
        self.bmi = bmi

    def getId(self):
        return self.id

    def getAge(self):
        return self.age

    def getGender(self):
        return self.gender

    def getWeightKg(self):
        return self.weightKg

    def getHeightCm(self):
        return self.heightCm

    def getMaxBPM(self):
        return self.maxBPM

    def getAvgBPM(self):
        return self.avgBPM

    def getRestingBPM(self):
        return self.restingBPM

    def getSessionDurationHours(self):
        return self.sessionDurationHours

    def getCaloriesBurned(self):
        return self.caloriesBurned

    def getWorkoutType(self):
        return self.workoutType

    def getFatPercentage(self):
        return self.fatPercentage

    def getWaterIntakeLiters(self):
        return self.waterIntakeLiters

    def getWorkoutFrequency(self):
        return self.workoutFrequency

    def getExperienceLevel(self):
        return self.experienceLevel

    def getBMI(self):
        return self.bmi

    def setId(self, id: int):
        self.id = id

    def setAge(self, age: int):
        self.age = age

    def setGender(self, gender: Gender):
        self.gender = gender

    def setWeightKg(self, weightKg: int):
        self.weightKg = weightKg

    def setHeightCm(self, heightCm: int):
        self.heightCm = heightCm

    def setMaxBPM(self, maxBPM: int):
        self.maxBPM = maxBPM

    def setAvgBPM(self, avgBPM: int):
        self.avgBPM = avgBPM

    def setRestingBPM(self, restingBPM: int):
        self.restingBPM = restingBPM

    def setSessionDurationHours(self, sessionDurationHours: int):
        self.sessionDurationHours = sessionDurationHours

    def setCaloriesBurned(self, caloriesBurned: int):
        self.caloriesBurned = caloriesBurned

    def setFatPercentage(self, fatPercentage: float):
        self.fatPercentage = fatPercentage

    def setWaterIntakeLiters(self, waterIntakeLiters: float):
        self.waterIntakeLiters = waterIntakeLiters

    def setWorkoutFrequency(self, workoutFrequency: int):
        self.workoutFrequency = workoutFrequency

    def setExperienceLevel(self, experienceLevel: int):
        self.experienceLevel = experienceLevel

    def setBMI(self, bmi: float):
        self.bmi = bmi
