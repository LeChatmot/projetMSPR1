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

        from Repositories.WorkoutTypesRepository import WorkoutTypesRepository
        r = WorkoutTypesRepository()
        r._conn = mock_conn
        r.createIdName = MagicMock()
        r.readIdName = MagicMock()
        r.readAllIdName = MagicMock()
        r.updateIdName = MagicMock()
        r.deleteIdName = MagicMock()
        return r


# ─────────────────────────────────────────────
#  create
# ─────────────────────────────────────────────

class TestCreate:

    def test_create_retourne_id(self, repo):
        repo.createIdName.return_value = 5

        result = repo.create("Cardio")

        assert result == 5

    def test_create_appelle_createIdName_avec_bons_params(self, repo):
        repo.create("Yoga")

        repo.createIdName.assert_called_once_with("workout_types", "Yoga")

    def test_create_propage_exception(self, repo):
        repo.createIdName.side_effect = RuntimeError("DB error")

        with pytest.raises(RuntimeError):
            repo.create("Pilates")


# ─────────────────────────────────────────────
#  getById
# ─────────────────────────────────────────────

class TestGetById:

    def test_retourne_dict_si_trouve(self, repo):
        repo.readIdName.return_value = {"id_workout_types": 1, "name": "Cardio"}

        result = repo.getById(1)

        assert result["name"] == "Cardio"

    def test_retourne_none_si_non_trouve(self, repo):
        repo.readIdName.return_value = None

        result = repo.getById(999)

        assert result is None

    def test_appelle_readIdName_avec_bons_params(self, repo):
        repo.getById(3)

        repo.readIdName.assert_called_once_with("workout_types", 3)


# ─────────────────────────────────────────────
#  getAll
# ─────────────────────────────────────────────

class TestGetAll:

    def test_retourne_liste(self, repo):
        repo.readAllIdName.return_value = [
            {"id_workout_types": 1, "name": "Cardio"},
            {"id_workout_types": 2, "name": "Yoga"},
        ]

        result = repo.getAll()

        assert len(result) == 2
        assert result[0]["name"] == "Cardio"

    def test_retourne_liste_vide(self, repo):
        repo.readAllIdName.return_value = []

        result = repo.getAll()

        assert result == []

    def test_appelle_readAllIdName(self, repo):
        repo.readAllIdName.return_value = []

        repo.getAll()

        repo.readAllIdName.assert_called_once_with("workout_types")


# ─────────────────────────────────────────────
#  update
# ─────────────────────────────────────────────

class TestUpdate:

    def test_appelle_updateIdName_avec_bons_params(self, repo):
        repo.update(1, "Natation")

        repo.updateIdName.assert_called_once_with("workout_types", 1, "Natation")

    def test_propage_exception(self, repo):
        repo.updateIdName.side_effect = RuntimeError("DB error")

        with pytest.raises(RuntimeError):
            repo.update(1, "Natation")


# ─────────────────────────────────────────────
#  delete
# ─────────────────────────────────────────────

class TestDelete:

    def test_retourne_resultat_deleteIdName(self, repo):
        repo.deleteIdName.return_value = True

        result = repo.delete(1)

        assert result is True

    def test_retourne_false_si_non_trouve(self, repo):
        repo.deleteIdName.return_value = False

        result = repo.delete(999)

        assert result is False

    def test_appelle_deleteIdName_avec_bon_id(self, repo):
        repo.delete(4)

        repo.deleteIdName.assert_called_once_with("workout_types", 4)