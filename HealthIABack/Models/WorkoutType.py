from Models.IdNameTableGeneric import IdNameTableGeneric


class WorkoutType(IdNameTableGeneric):

    def __init__(self, id: int = None, name: str = None):
        super().__init__(id, name)