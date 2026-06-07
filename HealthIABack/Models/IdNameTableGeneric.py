class IdNameTableGeneric:

    id_field = "id"
    name_field = "name"

    def __init__(self, id: int = None, name: str = None):
        self.id = id    
        self.name = name

    @classmethod
    def from_dict(cls, data: dict):
        return cls(id=data[cls.id_field], name=data[cls.name_field])

    def getId(self) -> int:
        return self.id

    def setId(self, id: int):
        self.id = id

    def getName(self) -> str:
        return self.name

    def setName(self, name: str):
        self.name = name
