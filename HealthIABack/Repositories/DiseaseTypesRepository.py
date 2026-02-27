from Repositories.IdNameGenericRepository import IdNameGenericRepository


class DiseaseTypesRepository(IdNameGenericRepository):

    TABLE = 'disease_types'

    def __init__(self):
        super().__init__()

    def create(self, name: str) -> int:
        return self.createIdName(self.TABLE, name)

    def getById(self, id: int) -> dict | None:
        return self.readIdName(self.TABLE, id)

    def getAll(self) -> list:
        return self.readAllIdName(self.TABLE)

    def update(self, id: int, name: str) -> None:
        self.updateIdName(self.TABLE, id, name)

    def delete(self, id: int) -> bool:
        return self.deleteIdName(self.TABLE, id)