from Models.Gender import Gender
from Models.WorkoutType import WorkoutType


class ExerciceSession:

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

    @staticmethod
    def to_model(row: dict):
        if not row:
            return None
        return ExerciceSession(
            id=row['id'],
            age=row['age'],
            gender=row['gender'],
            weightKg=row['weightKg'],
            heightCm=row['heightCm'],
            maxBPM=row['maxBPM'],
            avgBPM=row['avgBPM'],
            restingBPM=row['restingBPM'],
            sessionDurationHours=row['sessionDurationHours'],
            caloriesBurned=row['caloriesBurned'],
            workoutType=row['workoutType'],
            fatPercentage=row['fatPercentage'],
            waterIntakeLiters=row['waterIntakeLiters'],
            workoutFrequency=row['workoutFrequency'],
            experienceLevel=row['experienceLevel'],
            bmi=row['bmi'],
        )
