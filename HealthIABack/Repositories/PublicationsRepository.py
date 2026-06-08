from Models.Publication import Publication
from Repositories.BaseRepository import BaseRepository

TABLE = "publications"


class PublicationsRepository(BaseRepository):

    def __init__(self):
        super().__init__()

    def create(self, publication: Publication) -> Publication:
        new_id = self._execute(
            f"""INSERT INTO {TABLE} (libelle, contenu, id_utilisateurs)
                VALUES (%s, %s, %s)""",
            (publication.libelle, publication.contenu, publication.id_utilisateurs),
        )
        publication.id = new_id
        return publication

    def getAll(self) -> list[dict]:
        """Retourne toutes les publications avec le pseudo de l'auteur et le nb de commentaires."""
        query = """
            SELECT
                p.id_publications,
                p.libelle,
                p.contenu,
                p.created_at,
                p.updated_at,
                p.id_utilisateurs,
                u.pseudo        AS auteur_pseudo,
                u.nom           AS auteur_nom,
                u.prenom        AS auteur_prenom,
                COUNT(c.id_commentaires) AS nb_commentaires
            FROM publications p
            JOIN utilisateurs u ON p.id_utilisateurs = u.id_utilisateurs
            LEFT JOIN commentaires c ON c.id_publications = p.id_publications
            GROUP BY p.id_publications
            ORDER BY p.created_at DESC
        """
        rows = self._fetch_all(query)
        return [self._row_to_dict(row) for row in rows]

    def getById(self, publication_id: int) -> dict | None:
        query = """
            SELECT
                p.id_publications,
                p.libelle,
                p.contenu,
                p.created_at,
                p.updated_at,
                p.id_utilisateurs,
                u.pseudo    AS auteur_pseudo,
                u.nom       AS auteur_nom,
                u.prenom    AS auteur_prenom
            FROM publications p
            JOIN utilisateurs u ON p.id_utilisateurs = u.id_utilisateurs
            WHERE p.id_publications = %s
        """
        row = self._fetch_one(query, (publication_id,))
        return self._row_to_dict(row) if row else None

    def delete(self, publication_id: int) -> bool:
        self._execute(
            f"DELETE FROM {TABLE} WHERE id_publications = %s", (publication_id,)
        )
        return True

    def _row_to_dict(self, row: dict) -> dict:
        return {
            "id": row["id_publications"],
            "libelle": row.get("libelle"),
            "contenu": row.get("contenu"),
            "created_at": str(row["created_at"]) if row.get("created_at") else None,
            "updated_at": str(row["updated_at"]) if row.get("updated_at") else None,
            "id_utilisateurs": row.get("id_utilisateurs"),
            "auteur_pseudo": row.get("auteur_pseudo"),
            "auteur_nom": row.get("auteur_nom"),
            "auteur_prenom": row.get("auteur_prenom"),
            "nb_commentaires": row.get("nb_commentaires", 0),
        }
