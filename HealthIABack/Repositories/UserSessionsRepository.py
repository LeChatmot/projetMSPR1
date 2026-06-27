from Repositories.BaseRepository import BaseRepository


class UserSessionsRepository(BaseRepository):
    def get_by_user(self, user_id: int) -> list[dict]:
        rows = self._fetch_all(
            """
            SELECT id, user_id, workout_type, duration_min, calories_burned,
                   session_date, created_at
            FROM user_sessions
            WHERE user_id = %s
            ORDER BY session_date DESC
            LIMIT 50
            """,
            (user_id,),
        )
        return [self._serialize(row) for row in rows]

    def create(self, user_id: int, workout_type: str, duration_min: int,
               calories_burned: int, session_date: str) -> dict:
        new_id = self._execute(
            """
            INSERT INTO user_sessions (user_id, workout_type, duration_min, calories_burned, session_date)
            VALUES (%s, %s, %s, %s, %s)
            """,
            (user_id, workout_type, duration_min, calories_burned, session_date),
        )
        return {
            "id": new_id,
            "user_id": user_id,
            "workout_type": workout_type,
            "duration_min": duration_min,
            "calories_burned": calories_burned,
            "session_date": session_date,
        }

    def _serialize(self, row: dict) -> dict:
        return {
            "id": row["id"],
            "user_id": row["user_id"],
            "workout_type": row["workout_type"],
            "duration_min": row["duration_min"],
            "calories_burned": row["calories_burned"],
            "session_date": str(row["session_date"]),
            "created_at": str(row["created_at"]),
        }
