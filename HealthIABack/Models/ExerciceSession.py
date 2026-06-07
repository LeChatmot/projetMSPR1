from Models.Gender import Gender
from Models.WorkoutType import WorkoutType
from Models.IdNameTableGeneric import IdNameTableGeneric


class ExerciceSession(IdNameTableGeneric):

    id_field = "id_exercice_sessions"

    def __init__(self,
                 id: int = None,
                 age: int = None,
                 gender: Gender = None,
                 weight_kg: int = None,
                 height_cm: int = None,
                 max_bpm: int = None,
                 avg_bpm: int = None,
                 resting_bpm: int = None,
                 session_duration_hours: float = None,
                 calories_burned: int = None,
                 workout_type: WorkoutType = None,
                 fat_percentage: float = None,
                 water_intake_liters: float = None,
                 workout_frequency: int = None,
                 experience_level: int = None,
                 bmi: float = None,
                 ):
        super().__init__(id, None)
        self.age = age
        self.gender = gender
        self.weight_kg = weight_kg
        self.height_cm = height_cm
        self.max_bpm = max_bpm
        self.avg_bpm = avg_bpm
        self.resting_bpm = resting_bpm
        self.session_duration_hours = session_duration_hours
        self.calories_burned = calories_burned
        self.workout_type = workout_type
        self.fat_percentage = fat_percentage
        self.water_intake_liters = water_intake_liters
        self.workout_frequency = workout_frequency
        self.experience_level = experience_level
        self.bmi = bmi

    @classmethod
    def from_dict(cls, data: dict):
        if not data:
            return None
        return cls(
            id=data.get(cls.id_field),
            age=data.get('age'),
            gender=data.get('gender'),
            weight_kg=data.get('weight_kg'),
            height_cm=data.get('height_cm'),
            max_bpm=data.get('max_bpm'),
            avg_bpm=data.get('avg_bpm'),
            resting_bpm=data.get('resting_bpm'),
            session_duration_hours=data.get('session_duration_hours'),
            calories_burned=data.get('calories_burned'),
            workout_type=data.get('workout_type'),
            fat_percentage=data.get('fat_percentage'),
            water_intake_liters=data.get('water_intake_liters'),
            workout_frequency=data.get('workout_frequency'),
            experience_level=data.get('experience_level'),
            bmi=data.get('bmi'),
        )

    def getAge(self):
        return self.age

    def setAge(self, value: int):
        self.age = value

    def getGender(self):
        return self.gender

    def setGender(self, value: Gender):
        self.gender = value

    def getWeightKg(self):
        return self.weight_kg

    def setWeightKg(self, value: int):
        self.weight_kg = value

    def getHeightCm(self):
        return self.height_cm

    def setHeightCm(self, value: int):
        self.height_cm = value

    def getMaxBpm(self):
        return self.max_bpm

    def setMaxBpm(self, value: int):
        self.max_bpm = value

    def getAvgBpm(self):
        return self.avg_bpm

    def setAvgBpm(self, value: int):
        self.avg_bpm = value

    def getRestingBpm(self):
        return self.resting_bpm

    def setRestingBpm(self, value: int):
        self.resting_bpm = value

    def getSessionDurationHours(self):
        return self.session_duration_hours

    def setSessionDurationHours(self, value: float):
        self.session_duration_hours = value

    def getCaloriesBurned(self):
        return self.calories_burned

    def setCaloriesBurned(self, value: int):
        self.calories_burned = value

    def getWorkoutType(self):
        return self.workout_type

    def setWorkoutType(self, value: WorkoutType):
        self.workout_type = value

    def getFatPercentage(self):
        return self.fat_percentage

    def setFatPercentage(self, value: float):
        self.fat_percentage = value

    def getWaterIntakeLiters(self):
        return self.water_intake_liters

    def setWaterIntakeLiters(self, value: float):
        self.water_intake_liters = value

    def getWorkoutFrequency(self):
        return self.workout_frequency

    def setWorkoutFrequency(self, value: int):
        self.workout_frequency = value

    def getExperienceLevel(self):
        return self.experience_level

    def setExperienceLevel(self, value: int):
        self.experience_level = value

    def getBmi(self):
        return self.bmi

    def setBmi(self, value: float):
        self.bmi = value