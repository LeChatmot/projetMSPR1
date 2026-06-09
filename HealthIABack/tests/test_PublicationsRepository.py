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

        from Repositories.PublicationsRepository import PublicationsRepository
        r = PublicationsRepository()
        r._conn = mock_conn
        r._execute = MagicMock()
        r._fetch_all = MagicMock()
        r._fetch_one = MagicMock()
        return r


def make_publication(**kwargs):
    p = MagicMock()
    p.libelle = kwargs.get("libelle", "Mon titre")
    p.contenu = kwargs.get("contenu", "Mon contenu")
    p.id_utilisateurs = kwargs.get("id_utilisateurs", 1)
    p.id = None
    return p


# ─────────────────────────────────────────────
#  create
# ─────────────────────────────────────────────

class TestCreate:

    def test_create_retourne_publication_avec_id(self, repo):
        publication = make_publication()
        repo._execute.return_value = 10

        result = repo.create(publication)

        assert result.id == 10
        assert result is publication

    def test_create_appelle_execute_avec_bons_params(self, repo):
        publication = make_publication(libelle="Titre", contenu="Contenu", id_utilisateurs=5)
        repo._execute.return_value = 1

        repo.create(publication)

        args = repo._execute.call_args[0]
        assert "INSERT INTO publications" in args[0]
        assert args[1] == ("Titre", "Contenu", 5)

    def test_create_propage_exception(self, repo):
        repo._execute.side_effect = RuntimeError("DB error")

        with pytest.raises(RuntimeError):
            repo.create(make_publication())


# ─────────────────────────────────────────────
#  getAll
# ─────────────────────────────────────────────

class TestGetAll:

    def test_retourne_liste_vide(self, repo):
        repo._fetch_all.return_value = []

        result = repo.getAll()

        assert result == []

    def test_retourne_liste_de_dicts(self, repo):
        repo._fetch_all.return_value = [
            {
                "id_publications": 1,
                "libelle": "Titre",
                "contenu": "Contenu",
                "created_at": "2024-01-01",
                "updated_at": "2024-01-02",
                "id_utilisateurs": 3,
                "auteur_pseudo": "alice",
                "auteur_nom": "Alice",
                "auteur_prenom": "A",
                "nb_commentaires": 2,
            }
        ]

        result = repo.getAll()

        assert len(result) == 1
        assert result[0]["libelle"] == "Titre"
        assert result[0]["auteur_pseudo"] == "alice"
        assert result[0]["nb_commentaires"] == 2

    def test_propage_exception(self, repo):
        repo._fetch_all.side_effect = RuntimeError("DB error")

        with pytest.raises(RuntimeError):
            repo.getAll()


# ─────────────────────────────────────────────
#  getById
# ─────────────────────────────────────────────

class TestGetById:

    def test_retourne_dict_si_trouve(self, repo):
        repo._fetch_one.return_value = {
            "id_publications": 1,
            "libelle": "Titre",
            "contenu": "Contenu",
            "created_at": "2024-01-01",
            "updated_at": None,
            "id_utilisateurs": 3,
            "auteur_pseudo": "alice",
            "auteur_nom": "Alice",
            "auteur_prenom": "A",
        }

        result = repo.getById(1)

        assert result is not None
        assert result["id"] == 1

    def test_retourne_none_si_non_trouve(self, repo):
        repo._fetch_one.return_value = None

        result = repo.getById(999)

        assert result is None

    def test_appelle_fetch_one_avec_bon_id(self, repo):
        repo._fetch_one.return_value = None

        repo.getById(7)

        args = repo._fetch_one.call_args[0]
        assert args[1] == (7,)


# ─────────────────────────────────────────────
#  delete
# ─────────────────────────────────────────────

class TestDelete:

    def test_retourne_true(self, repo):
        repo._execute.return_value = None

        result = repo.delete(1)

        assert result is True

    def test_appelle_execute_avec_bon_id(self, repo):
        repo.delete(5)

        args = repo._execute.call_args[0]
        assert "DELETE FROM publications" in args[0]
        assert args[1] == (5,)

    def test_propage_exception(self, repo):
        repo._execute.side_effect = RuntimeError("DB error")

        with pytest.raises(RuntimeError):
            repo.delete(1)


# ─────────────────────────────────────────────
#  _row_to_dict
# ─────────────────────────────────────────────

class TestRowToDict:

    def test_conversion_complete(self, repo):
        row = {
            "id_publications": 1,
            "libelle": "Titre",
            "contenu": "Contenu",
            "created_at": "2024-01-01",
            "updated_at": "2024-01-02",
            "id_utilisateurs": 3,
            "auteur_pseudo": "alice",
            "auteur_nom": "Alice",
            "auteur_prenom": "A",
            "nb_commentaires": 4,
        }

        result = repo._row_to_dict(row)

        assert result["id"] == 1
        assert result["libelle"] == "Titre"
        assert result["nb_commentaires"] == 4

    def test_nb_commentaires_defaut_zero(self, repo):
        row = {"id_publications": 1, "created_at": None, "updated_at": None}

        result = repo._row_to_dict(row)

        assert result["nb_commentaires"] == 0

    def test_created_at_none(self, repo):
        row = {"id_publications": 1, "created_at": None, "updated_at": None}

        result = repo._row_to_dict(row)

        assert result["created_at"] is None
        assert result["updated_at"] is None