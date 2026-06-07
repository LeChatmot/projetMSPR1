# test_GenericReferenceRepository.py

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

        from Repositories.GenericReferenceRepository import GenericReferenceRepository
        r = GenericReferenceRepository("test_table")
        r._conn = mock_conn
        r._execute = MagicMock()
        r._fetch_all = MagicMock()
        return r


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
            {"id": 1, "name": "Item 1"},
            {"id": 2, "name": "Item 2"},
        ]

        result = repo.getAll()

        assert len(result) == 2
        assert result[0]["name"] == "Item 1"

    def test_appelle_fetch_all_avec_bonne_table(self, repo):
        repo._fetch_all.return_value = []

        repo.getAll()

        args = repo._fetch_all.call_args[0]
        assert "test_table" in args[0]

    def test_propage_exception(self, repo):
        repo._fetch_all.side_effect = RuntimeError("DB error")

        with pytest.raises(RuntimeError):
            repo.getAll()


# ─────────────────────────────────────────────
#  create
# ─────────────────────────────────────────────

class TestCreate:

    def test_create_retourne_id(self, repo):
        repo._execute.return_value = 7

        result = repo.create("Nouveau")

        assert result == 7

    def test_create_appelle_execute_avec_bons_params(self, repo):
        repo.create("Test")

        args = repo._execute.call_args[0]
        assert "INSERT INTO test_table" in args[0]
        assert args[1] == ("Test",)

    def test_create_propage_exception(self, repo):
        repo._execute.side_effect = RuntimeError("DB error")

        with pytest.raises(RuntimeError):
            repo.create("Test")


# ─────────────────────────────────────────────
#  truncate
# ─────────────────────────────────────────────

class TestTruncate:

    def test_appelle_execute_avec_bonne_table(self, repo):
        repo.truncate()

        args = repo._execute.call_args[0]
        assert "DELETE FROM test_table" in args[0]

    def test_propage_exception(self, repo):
        repo._execute.side_effect = RuntimeError("DB error")

        with pytest.raises(RuntimeError):
            repo.truncate()
