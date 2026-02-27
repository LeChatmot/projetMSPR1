from Models.IdNameTableGeneric import IdNameTableGeneric


class Allergie(IdNameTableGeneric):

    def __init__(self, id: int = None, name: str = None):
        super().__init__(id, name)