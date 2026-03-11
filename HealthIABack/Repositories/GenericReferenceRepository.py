from Repositories.BaseRepository import BaseRepository

class GenericReferenceRepository(BaseRepository):
    def __init__(self, table_name):
        super().__init__()
        self.TABLE = table_name

    def getAll(self) -> list[dict]:
        return self._fetch_all(f"SELECT * FROM {self.TABLE}")

    def create(self, name: str) -> int:
        # Insère le nom et retourne l'ID
        return self._execute(f"INSERT INTO {self.TABLE} (name) VALUES (%s)", (name,))