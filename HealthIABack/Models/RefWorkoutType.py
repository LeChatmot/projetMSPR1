class RefWorkoutType:

    def __init__(self,
                 id: int,
                 name: str):
        self.id = id
        self.name = name

    def getId(self):
        return self.id

    def setId(self, id: int):
        self.id = id

    def getName(self):
        return self.name

    def setName(self, name: str):
        self.name = name