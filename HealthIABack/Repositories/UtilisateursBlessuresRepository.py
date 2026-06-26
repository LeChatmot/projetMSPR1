from Repositories.BaseRepository import BaseRepository

TABLE = "utilisateurs_blessures"


class UtilisateursBlessuresRepository(BaseRepository):

    def __init__(self):
        super().__init__()

    def add_blessure(self, user_id: int, zone: str, description: str | None) -> int:
        return self._execute(
            f"INSERT INTO {TABLE} (id_utilisateurs, zone, description) VALUES (%s, %s, %s)",
            (user_id, zone, description),
        )

    def remove_blessure(self, blessure_id: int, user_id: int) -> None:
        self._execute(
            f"DELETE FROM {TABLE} WHERE id_utilisateurs_blessures = %s AND id_utilisateurs = %s",
            (blessure_id, user_id),
        )

    def find_by_user(self, user_id: int) -> list[dict]:
        return self._fetch_all(
            f"SELECT * FROM {TABLE} WHERE id_utilisateurs = %s ORDER BY created_at DESC",
            (user_id,),
        )
