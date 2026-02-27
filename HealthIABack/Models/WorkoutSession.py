from Models.Patient import Patient
from Models.RefWorkoutType import RefWorkoutType


class WorkoutSession:

    def __init__(self, id,
                 patient: Patient,
                 workoutType: RefWorkoutType,
                 duration_min: int,
                 calories_burned: int,
                 avg_bpm: int,
                 max_bpm: int,
                 water_intake_liters: float):
        self.id = id
        self.patient = patient
        self.workoutType = workoutType
        self.duration_min = duration_min
        self.calories_burned = calories_burned
        self.avg_bpm = avg_bpm
        self.max_bpm = max_bpm
        self.water_intake_liters = water_intake_liters

    def getId(self):
        return self.id

    def setId(self, id: int):
        self.id = id

    def getPatient(self):
        return self.patient

    def setPatient(self, patient: Patient):
        self.patient = patient

    def getWorkoutType(self):
        return self.workoutType

    def setWorkoutType(self, workoutType: RefWorkoutType):
        self.workoutType = workoutType

    def getDuration_min(self):
        return self.duration_min

    def setDuration_min(self, duration_min: int):
        self.duration_min = duration_min

    def getCalories_burned(self):
        return self.calories_burned

    def setCalories_burned(self, calories_burned: int):
        self.calories_burned = calories_burned

    def getAvg_bpm(self):
        return self.avg_bpm

    def setAvg_bpm(self, avg_bpm: int):
        self.avg_bpm = avg_bpm

    def getMax_bpm(self):
        return self.max_bpm

    def setMax_bpm(self, max_bpm: int):
        self.max_bpm = max_bpm

    def getWater_intake_liters(self):
        return self.water_intake_liters

    def setWater_intake_liters(self, water_intake_liters: float):
        self.water_intake_liters = water_intake_liters