from Repositories.BaseRepository import BaseRepository

TABLE = "utilisateurs_pathologies"


class UtilisateursPathologiesRepository(BaseRepository):

    def __init__(self):
        super().__init__()

    def add_pathologie(self, user_id: int, disease_id: int) -> None:
        self._execute(
            f"INSERT IGNORE INTO {TABLE} (id_utilisateurs, id_disease_types) VALUES (%s, %s)",
            (user_id, disease_id),
        )

    def remove_pathologie(self, user_id: int, disease_id: int) -> None:
        self._execute(
            f"DELETE FROM {TABLE} WHERE id_utilisateurs = %s AND id_disease_types = %s",
            (user_id, disease_id),
        )

    def find_by_user(self, user_id: int) -> list[dict]:
        return self._fetch_all(
            """SELECT d.id_disease_types, d.name
               FROM disease_types d
               JOIN utilisateurs_pathologies up ON d.id_disease_types = up.id_disease_types
               WHERE up.id_utilisateurs = %s""",
            (user_id,),
        )

    def replace_all(self, user_id: int, disease_ids: list[int]) -> None:
        self._execute(
            f"DELETE FROM {TABLE} WHERE id_utilisateurs = %s", (user_id,)
        )
        for disease_id in disease_ids:
            self.add_pathologie(user_id, disease_id)
