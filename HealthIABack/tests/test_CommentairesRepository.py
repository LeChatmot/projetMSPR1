import pytest
from unittest.mock import MagicMock, patch


# ─────────────────────────────────────────────
#  Fixture
# ─────────────────────────────────────────────

@pytest.fixture
def repo():
    with patch("pymysql.connect") as mock_connect:
        mock_conn = MagicMock()
        mock_conn.open = True
        mock_connect.return_value = mock_conn

        from Repositories.CommentairesRepository import CommentairesRepository
        r = CommentairesRepository()
        r._conn = mock_conn
        r._execute = MagicMock()
        r._fetch_all = MagicMock()
        return r


def make_commentaire(**kwargs):
    c = MagicMock()
    c.contenu = kwargs.get("contenu", "Super article !")
    c.id_commentaires_parent = kwargs.get("id_commentaires_parent", None)
    c.id_publications = kwargs.get("id_publications", 1)
    c.id_utilisateurs = kwargs.get("id_utilisateurs", 10)
    c.id = None
    return c


# ─────────────────────────────────────────────
#  create
# ─────────────────────────────────────────────

class TestCreate:

    def test_create_retourne_commentaire_avec_id(self, repo):
        commentaire = make_commentaire()
        repo._execute.return_value = 99

        result = repo.create(commentaire)

        assert result.id == 99
        assert result is commentaire

    def test_create_appelle_execute_avec_bons_params(self, repo):
        commentaire = make_commentaire(
            contenu="Test commentaire",
            id_commentaires_parent=5,
            id_publications=2,
            id_utilisateurs=7,
        )
        repo._execute.return_value = 1

        repo.create(commentaire)

        args = repo._execute.call_args[0]
        assert "INSERT INTO commentaires" in args[0]
        assert args[1] == ("Test commentaire", 5, 2, 7)

    def test_create_sans_parent(self, repo):
        commentaire = make_commentaire(id_commentaires_parent=None)
        repo._execute.return_value = 3

        result = repo.create(commentaire)

        assert result.id == 3

    def test_create_propage_exception(self, repo):
        repo._execute.side_effect = RuntimeError("DB error")
        commentaire = make_commentaire()

        with pytest.raises(RuntimeError):
            repo.create(commentaire)


# ─────────────────────────────────────────────
#  get_by_publication
# ─────────────────────────────────────────────

class TestGetByPublication:

    def _make_row(self, **kwargs):
        return {
            "id_commentaires": kwargs.get("id_commentaires", 1),
            "contenu": kwargs.get("contenu", "Commentaire test"),
            "created_at": kwargs.get("created_at", "2024-01-01 10:00:00"),
            "id_commentaires_parent": kwargs.get("id_commentaires_parent", None),
            "id_utilisateurs": kwargs.get("id_utilisateurs", 5),
            "auteur_pseudo": kwargs.get("auteur_pseudo", "alice"),
        }

    def test_retourne_liste_vide_si_aucun_commentaire(self, repo):
        repo._fetch_all.return_value = []

        result = repo.get_by_publication(1)

        assert result == []

    def test_retourne_liste_de_dicts(self, repo):
        repo._fetch_all.return_value = [self._make_row(), self._make_row(id_commentaires=2)]

        result = repo.get_by_publication(1)

        assert len(result) == 2
        assert isinstance(result[0], dict)

    def test_champs_correctement_mappes(self, repo):
        row = self._make_row(
            id_commentaires=10,
            contenu="Hello",
            id_commentaires_parent=3,
            id_utilisateurs=7,
            auteur_pseudo="bob",
        )
        repo._fetch_all.return_value = [row]

        result = repo.get_by_publication(1)

        assert result[0]["id"] == 10
        assert result[0]["contenu"] == "Hello"
        assert result[0]["id_commentaires_parent"] == 3
        assert result[0]["id_utilisateurs"] == 7
        assert result[0]["auteur_pseudo"] == "bob"

    def test_created_at_converti_en_string(self, repo):
        row = self._make_row(created_at="2024-06-15 08:30:00")
        repo._fetch_all.return_value = [row]

        result = repo.get_by_publication(1)

        assert isinstance(result[0]["created_at"], str)

    def test_created_at_none_si_absent(self, repo):
        row = self._make_row()
        row["created_at"] = None
        repo._fetch_all.return_value = [row]

        result = repo.get_by_publication(1)

        assert result[0]["created_at"] is None

    def test_appelle_fetch_all_avec_bon_id(self, repo):
        repo._fetch_all.return_value = []

        repo.get_by_publication(42)

        args = repo._fetch_all.call_args[0]
        assert args[1] == (42,)


# ─────────────────────────────────────────────
#  delete
# ─────────────────────────────────────────────

class TestDelete:

    def test_delete_retourne_true(self, repo):
        repo._execute.return_value = None

        result = repo.delete(1)

        assert result is True

    def test_delete_appelle_execute_avec_bon_id(self, repo):
        repo.delete(7)

        args = repo._execute.call_args[0]
        assert "DELETE FROM commentaires" in args[0]
        assert args[1] == (7,)

    def test_delete_propage_exception(self, repo):
        repo._execute.side_effect = RuntimeError("DB error")

        with pytest.raises(RuntimeError):
            repo.delete(1)


# ─────────────────────────────────────────────
#  _row_to_dict
# ─────────────────────────────────────────────

class TestRowToDict:

    def test_conversion_complete(self, repo):
        row = {
            "id_commentaires": 10,
            "contenu": "Super",
            "created_at": "2024-01-01",
            "id_commentaires_parent": 3,
            "id_utilisateurs": 5,
            "auteur_pseudo": "charlie",
        }

        result = repo._row_to_dict(row)

        assert result["id"] == 10
        assert result["contenu"] == "Super"
        assert result["created_at"] == "2024-01-01"
        assert result["id_commentaires_parent"] == 3
        assert result["id_utilisateurs"] == 5
        assert result["auteur_pseudo"] == "charlie"

    def test_champs_optionnels_none_si_absents(self, repo):
        row = {"id_commentaires": 1, "created_at": None}

        result = repo._row_to_dict(row)

        assert result["contenu"] is None
        assert result["id_commentaires_parent"] is None
        assert result["auteur_pseudo"] is None
