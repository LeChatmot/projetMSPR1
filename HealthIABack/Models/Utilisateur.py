class Utilisateur:
    def __init__(self):
        self.id = None
        self.nom = None
        self.prenom = None
        self.pseudo = None
        self.email = None
        self.mot_de_passe = None
        self.role = "user"
        self.created_at = None
        self.date_of_birth = None
        self.height_cm = None
        self.weight_kg = None
        self.id_gender = None
        self.id_activity_level = None
        self.experience_level = None
        self.objectif = None

    def to_public_dict(self) -> dict:
        return {
            "id": self.id,
            "nom": self.nom,
            "prenom": self.prenom,
            "pseudo": self.pseudo,
            "email": self.email,
            "role": self.role,
            "date_of_birth": self.date_of_birth.isoformat() if self.date_of_birth else None,
            "height_cm": self.height_cm,
            "weight_kg": float(self.weight_kg) if self.weight_kg else None,
            "id_gender": self.id_gender,
            "id_activity_level": self.id_activity_level,
            "experience_level": self.experience_level,
            "objectif": self.objectif,
        }
