from Models.ExerciceSession import ExerciseSession
from Repositories.BaseRepository import BaseRepository


class DietRecommandationsRepository(BaseRepository):

    TABLE = 'diet_recommandations'

    def __init__(self):
        super().__init__()

    def create(self, e: ExerciseSession) -> ExerciseSession:
        last_id = self._execute(
            f"""INSERT INTO {self.TABLE}
            (age, gender, weightKg, heightCm, maxBPM, avgBPM, restingBPM,
            sessionDurationHours, caloriesBurned, workoutType, fatPercentage,
            waterIntakeLiters, workoutFrequency, experienceLevel, bmi)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)""",
            (e.age, e.gender, e.weightKg, e.heightCm, e.maxBPM, e.avgBPM, e.restingBPM,
             e.sessionDurationHours, e.caloriesBurned, e.workoutType, e.fatPercentage,
             e.waterIntakeLiters, e.workoutFrequency, e.experienceLevel, e.bmi)
        )
        e.id = last_id
        return e

    def getById(self, id: int) -> ExerciseSession | None:
        row = self._fetch_one(f"SELECT * FROM {self.TABLE} WHERE id = %s", (id,))
        return self._to_model(row)

    def getAll(self) -> list[ExerciseSession]:
        rows = self._fetch_all(f"SELECT * FROM {self.TABLE}")
        return [self._to_model(row) for row in rows]

    def update(self, e: ExerciseSession) -> ExerciseSession:
        self._execute(
            f"""UPDATE {self.TABLE} SET
            age = %s, gender = %s, weightKg = %s, heightCm = %s, maxBPM = %s,
            avgBPM = %s, restingBPM = %s, sessionDurationHours = %s, caloriesBurned = %s,
            workoutType = %s, fatPercentage = %s, waterIntakeLiters = %s,
            workoutFrequency = %s, experienceLevel = %s, bmi = %s
            WHERE id = %s""",
            (e.age, e.gender, e.weightKg, e.heightCm, e.maxBPM, e.avgBPM, e.restingBPM,
             e.sessionDurationHours, e.caloriesBurned, e.workoutType, e.fatPercentage,
             e.waterIntakeLiters, e.workoutFrequency, e.experienceLevel, e.bmi, e.id)
        )
        return e

    def delete(self, id: int) -> bool:
        self._execute(f"DELETE FROM {self.TABLE} WHERE id = %s", (id,))
        return True