from Repositories.BaseRepository import BaseRepository


class ReferencesRepository(BaseRepository):

    def __init__(self):
        super().__init__()

    def get_allergies(self) -> list[dict]:
        return self._fetch_all(
            "SELECT id_allergies AS id, name FROM allergies ORDER BY name", ()
        )

    def get_disease_types(self) -> list[dict]:
        return self._fetch_all(
            "SELECT id_disease_types AS id, name FROM disease_types ORDER BY name", ()
        )

    def get_genders(self) -> list[dict]:
        return self._fetch_all(
            "SELECT id_genders AS id, name FROM genders ORDER BY id", ()
        )

    def get_activity_levels(self) -> list[dict]:
        return self._fetch_all(
            "SELECT id_physical_activity_levels AS id, name FROM physical_activity_levels ORDER BY id", ()
        )
