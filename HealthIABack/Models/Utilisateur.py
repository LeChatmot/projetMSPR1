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

    def to_public_dict(self) -> dict:
        """Retourne les données utilisateur sans le mot de passe."""
        return {
            "id": self.id,
            "nom": self.nom,
            "prenom": self.prenom,
            "pseudo": self.pseudo,
            "email": self.email,
            "role": self.role,
        }
