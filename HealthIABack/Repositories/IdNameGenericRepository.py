from Repositories.BaseRepository import BaseRepository


class IdNameGenericRepository(BaseRepository):

    def __init__(self):
        super().__init__()

    def createIdName(self, table: str, name: str) -> int:
        return self._execute(f"INSERT INTO {table} (name) VALUES (%s)", (name,))

    def readIdName(self, table: str, id: int) -> dict | None:
        return self._fetch_one(f"SELECT * FROM {table} WHERE id = %s", (id,))

    def readAllIdName(self, table: str) -> list[dict]:
        return self._fetch_all(f"SELECT * FROM {table}")

    def updateIdName(self, table: str, id: int, name: str) -> None:
        self._execute(f"UPDATE {table} SET name = %s WHERE id = %s", (name, id))

    def deleteIdName(self, table: str, id: int) -> bool:
        self._execute(f"DELETE FROM {table} WHERE id = %s", (id,))
        return True