from Models.Commentaire import Commentaire
from Repositories.BaseRepository import BaseRepository

TABLE = "commentaires"


class CommentairesRepository(BaseRepository):

    def __init__(self):
        super().__init__()

    def create(self, commentaire: Commentaire) -> Commentaire:
        new_id = self._execute(
            f"""INSERT INTO {TABLE}
                (contenu, id_commentaires_parent, id_publications, id_utilisateurs)
                VALUES (%s, %s, %s, %s)""",
            (commentaire.contenu, commentaire.id_commentaires_parent,
             commentaire.id_publications, commentaire.id_utilisateurs),
        )
        commentaire.id = new_id
        return commentaire

    def get_by_publication(self, publication_id: int) -> list[dict]:
        """
        Retourne tous les commentaires d'une publication (liste plate).
        Le frontend se charge de construire l'arbre depuis id_commentaires_parent.
        """
        query = """
            SELECT
                c.id_commentaires,
                c.contenu,
                c.created_at,
                c.id_commentaires_parent,
                c.id_utilisateurs,
                u.pseudo AS auteur_pseudo
            FROM commentaires c
            JOIN utilisateurs u ON c.id_utilisateurs = u.id_utilisateurs
            WHERE c.id_publications = %s
            ORDER BY c.created_at ASC
        """
        rows = self._fetch_all(query, (publication_id,))
        return [self._row_to_dict(row) for row in rows]

    def delete(self, commentaire_id: int) -> bool:
        self._execute(
            f"DELETE FROM {TABLE} WHERE id_commentaires = %s", (commentaire_id,)
        )
        return True

    def _row_to_dict(self, row: dict) -> dict:
        return {
            "id": row["id_commentaires"],
            "contenu": row.get("contenu"),
            "created_at": str(row["created_at"]) if row.get("created_at") else None,
            "id_commentaires_parent": row.get("id_commentaires_parent"),
            "id_utilisateurs": row.get("id_utilisateurs"),
            "auteur_pseudo": row.get("auteur_pseudo"),
        }
