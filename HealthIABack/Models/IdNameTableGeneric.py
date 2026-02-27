class IdNameTableGeneric:

    def __init__(self, id: int = None, name: str = None):
        self.id = id
        self.name = name

    @classmethod
    def from_dict(self, cls, data: dict):
        return cls(id=data['id'], name=data['name'])

    def getId(self) -> int:
        return self.id

    def setId(self, id: int):
        self.id = id

    def getName(self) -> str:
        return self.name

    def setName(self, name: str):
        self.name = name
