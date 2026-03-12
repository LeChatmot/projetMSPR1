from Models.ExerciceSession import ExerciceSession
from Repositories.BaseRepository import BaseRepository


class ExerciceSessionsRepository(BaseRepository):

    TABLE = 'exercice_sessions'

    def __init__(self):
        super().__init__()

    def create(self, e: ExerciceSession) -> ExerciceSession:
        last_id = self._execute(
            f"""INSERT INTO {self.TABLE}
            (age, gender, weight_kg, height_cm, max_bpm, avg_bpm, resting_bpm,
            session_duration_hours, calories_burned, workout_type, fat_percentage,
            water_intake_liters, workout_frequency, experience_level, bmi)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)""",
            (e.age, e.gender, e.weightKg, e.heightCm, e.maxBPM, e.avgBPM, e.restingBPM,
             e.sessionDurationHours, e.caloriesBurned, e.workoutType, e.fatPercentage,
             e.waterIntakeLiters, e.workoutFrequency, e.experienceLevel, e.bmi)
        )
        e.id = last_id
        return e

    def getById(self, id: int) -> ExerciceSession | None:
        row = self._fetch_one(f"SELECT * FROM {self.TABLE} WHERE id = %s", (id,))
        return self._to_model(row)

    def getAll(self) -> list[ExerciceSession]:
        rows = self._fetch_all(f"SELECT * FROM {self.TABLE}")
        return [self._to_model(row) for row in rows]

    def update(self, e: ExerciceSession) -> ExerciceSession:
        self._execute(
            f"""UPDATE {self.TABLE} SET
            age = %s, gender = %s, weight_kg = %s, height_cm = %s, max_bpm = %s,
            avg_bpm = %s, resting_bpm = %s, session_duration_hours = %s, calories_burned = %s,
            workout_type = %s, fat_percentage = %s, water_intake_liters = %s,
            workout_frequency = %s, experience_level = %s, bmi = %s
            WHERE id = %s""",
            (e.age, e.gender, e.weightKg, e.heightCm, e.maxBPM, e.avgBPM, e.restingBPM,
             e.sessionDurationHours, e.caloriesBurned, e.workoutType, e.fatPercentage,
             e.waterIntakeLiters, e.workoutFrequency, e.experienceLevel, e.bmi, e.id)
        )
        return e
    
    def delete(self, id: int) -> bool:
        self._execute(f"DELETE FROM {self.TABLE} WHERE id = %s", (id,))
        return True

    def get_sport_distribution(self) -> list[dict]:
        """
        Calcule la répartition des sessions de sport en utilisant une requête SQL optimisée.
        """
        query = f"""
            SELECT
                wt.name AS type,
                COUNT(es.id) AS sessions
            FROM {self.TABLE} es
            JOIN workout_types wt ON es.workout_type = wt.id
            GROUP BY wt.name
            ORDER BY sessions DESC
        """
        return self._fetch_all(query)

    def get_weight_by_experience(self) -> list[dict]:
        """Calcule le poids moyen par niveau d'expérience."""
        query = f"""
            SELECT 
                experience_level,
                AVG(weight_kg) as averageWeight
            FROM {self.TABLE}
            GROUP BY experience_level
            ORDER BY experience_level ASC
        """
        return self._fetch_all(query)

    def truncate(self) -> None:
        """Vide la table complètement (remise à zéro des IDs)."""
        self._execute(f"TRUNCATE TABLE {self.TABLE}")

    def get_kpis(self) -> dict:
        """Calcule les KPIs directement en SQL pour plus d'efficacité."""
        query = f"""
            SELECT
                COUNT(id) as totalPatients,
                AVG(calories_burned) as avgCaloriesBurned,
                AVG(session_duration_hours) * 60 as avgSessionDuration
            FROM {self.TABLE}
        """
        kpis = self._fetch_one(query)
        # Gérer le cas d'une table vide pour éviter les erreurs
        if not kpis or kpis.get('totalPatients') == 0:
            return {'totalPatients': 0, 'avgCaloriesBurned': 0, 'avgSessionDuration': 0}
        
        return kpis

    def _to_model(self, row: dict) -> ExerciceSession | None:
        """Convertit un dictionnaire de la DB en objet ExerciseSession."""
        if not row:
            return None
        
        session = ExerciceSession()
        session.id = row.get('id')
        session.age = row.get('age')
        session.gender = row.get('gender')
        session.weightKg = row.get('weight_kg')
        session.heightCm = row.get('height_cm')
        session.maxBPM = row.get('max_bpm')
        session.avgBPM = row.get('avg_bpm')
        session.restingBPM = row.get('resting_bpm')
        session.sessionDurationHours = row.get('session_duration_hours')
        session.caloriesBurned = row.get('calories_burned')
        session.workoutType = row.get('workout_type')
        session.fatPercentage = row.get('fat_percentage')
        session.waterIntakeLiters = row.get('water_intake_liters')
        session.workoutFrequency = row.get('workout_frequency')
        session.experienceLevel = row.get('experience_level')
        session.bmi = row.get('bmi')
        return session

