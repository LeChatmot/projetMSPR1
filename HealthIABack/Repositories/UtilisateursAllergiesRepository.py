from Repositories.BaseRepository import BaseRepository

TABLE = "utilisateurs_allergies"


class UtilisateursAllergiesRepository(BaseRepository):

    def __init__(self):
        super().__init__()

    def add_allergie(self, user_id: int, allergie_id: int) -> None:
        self._execute(
            f"INSERT IGNORE INTO {TABLE} (id_utilisateurs, id_allergies) VALUES (%s, %s)",
            (user_id, allergie_id),
        )

    def remove_allergie(self, user_id: int, allergie_id: int) -> None:
        self._execute(
            f"DELETE FROM {TABLE} WHERE id_utilisateurs = %s AND id_allergies = %s",
            (user_id, allergie_id),
        )

    def find_by_user(self, user_id: int) -> list[dict]:
        return self._fetch_all(
            """SELECT a.id_allergies, a.name
               FROM allergies a
               JOIN utilisateurs_allergies ua ON a.id_allergies = ua.id_allergies
               WHERE ua.id_utilisateurs = %s""",
            (user_id,),
        )

    def replace_all(self, user_id: int, allergie_ids: list[int]) -> None:
        self._execute(
            f"DELETE FROM {TABLE} WHERE id_utilisateurs = %s", (user_id,)
        )
        for allergie_id in allergie_ids:
            self.add_allergie(user_id, allergie_id)
