from werkzeug.security import generate_password_hash, check_password_hash
from Models.Utilisateur import Utilisateur
from Repositories.BaseRepository import BaseRepository

TABLE = "utilisateurs"


class UtilisateursRepository(BaseRepository):

    def __init__(self):
        super().__init__()

    def create(self, utilisateur: Utilisateur) -> Utilisateur:
        hashed = generate_password_hash(utilisateur.mot_de_passe)
        new_id = self._execute(
            f"""INSERT INTO {TABLE} (nom, prenom, pseudo, email, mot_de_passe, role)
                VALUES (%s, %s, %s, %s, %s, %s)""",
            (utilisateur.nom, utilisateur.prenom, utilisateur.pseudo,
             utilisateur.email, hashed, utilisateur.role),
        )
        utilisateur.id = new_id
        utilisateur.mot_de_passe = None
        return utilisateur

    def find_by_email(self, email: str) -> Utilisateur | None:
        row = self._fetch_one(
            f"SELECT * FROM {TABLE} WHERE email = %s", (email,)
        )
        return self._to_model(row)

    def email_exists(self, email: str) -> bool:
        row = self._fetch_one(
            f"SELECT id_utilisateurs FROM {TABLE} WHERE email = %s", (email,)
        )
        return row is not None

    def pseudo_exists(self, pseudo: str) -> bool:
        row = self._fetch_one(
            f"SELECT id_utilisateurs FROM {TABLE} WHERE pseudo = %s", (pseudo,)
        )
        return row is not None

    def find_by_id(self, user_id: int) -> Utilisateur | None:
        row = self._fetch_one(
            f"SELECT * FROM {TABLE} WHERE id_utilisateurs = %s", (user_id,)
        )
        return self._to_model(row)

    def email_exists_for_other(self, email: str, user_id: int) -> bool:
        row = self._fetch_one(
            f"SELECT id_utilisateurs FROM {TABLE} WHERE email = %s AND id_utilisateurs != %s",
            (email, user_id),
        )
        return row is not None

    def update_info(self, user_id: int, nom: str, prenom: str, email: str) -> None:
        self._execute(
            f"UPDATE {TABLE} SET nom = %s, prenom = %s, email = %s WHERE id_utilisateurs = %s",
            (nom, prenom, email, user_id),
        )

    def update_password(self, user_id: int, nouveau_mot_de_passe: str) -> None:
        hashed = generate_password_hash(nouveau_mot_de_passe)
        self._execute(
            f"UPDATE {TABLE} SET mot_de_passe = %s WHERE id_utilisateurs = %s",
            (hashed, user_id),
        )

    def verify_password(self, utilisateur: Utilisateur, plain_password: str) -> bool:
        if not utilisateur or not utilisateur.mot_de_passe:
            return False
        return check_password_hash(utilisateur.mot_de_passe, plain_password)

    def _to_model(self, row: dict) -> Utilisateur | None:
        if not row:
            return None
        u = Utilisateur()
        u.id = row.get("id_utilisateurs")
        u.nom = row.get("nom")
        u.prenom = row.get("prenom")
        u.pseudo = row.get("pseudo")
        u.email = row.get("email")
        u.mot_de_passe = row.get("mot_de_passe")
        u.role = row.get("role", "user")
        u.created_at = row.get("created_at")
        return u
