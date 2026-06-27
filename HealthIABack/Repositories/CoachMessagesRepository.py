from Repositories.BaseRepository import BaseRepository

TABLE = "coach_messages"


class CoachMessagesRepository(BaseRepository):

    def __init__(self):
        super().__init__()

    def save_message(self, user_id: int, role: str, content: str) -> None:
        self._execute(
            f"INSERT INTO {TABLE} (id_utilisateurs, role, content) VALUES (%s, %s, %s)",
            (user_id, role, content),
        )

    def find_by_user(self, user_id: int, limit: int = 50) -> list[dict]:
        return self._fetch_all(
            f"SELECT id, role, content, created_at FROM {TABLE} WHERE id_utilisateurs = %s ORDER BY created_at ASC LIMIT %s",
            (user_id, limit),
        )

    def clear_history(self, user_id: int) -> None:
        self._execute(
            f"DELETE FROM {TABLE} WHERE id_utilisateurs = %s",
            (user_id,),
        )
