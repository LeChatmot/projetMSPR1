# test_ExerciceSessionsRepository.py

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

        from Repositories.ExerciceSessionsRepository import ExerciceSessionsRepository
        r = ExerciceSessionsRepository()
        r._conn = mock_conn
        r._execute = MagicMock()
        r._fetch_one = MagicMock()
        r._fetch_all = MagicMock()
        return r


def make_session(**kwargs):
    e = MagicMock()
    e.age = kwargs.get("age", 25)
    e.gender = kwargs.get("gender", 1)
    e.weight_kg = kwargs.get("weight_kg", 70.0)
    e.height_cm = kwargs.get("height_cm", 175)
    e.max_bpm = kwargs.get("max_bpm", 190)
    e.avg_bpm = kwargs.get("avg_bpm", 150)
    e.resting_bpm = kwargs.get("resting_bpm", 60)
    e.session_duration_hours = kwargs.get("session_duration_hours", 1.5)
    e.calories_burned = kwargs.get("calories_burned", 500)
    e.workout_type = kwargs.get("workout_type", 1)
    e.fat_percentage = kwargs.get("fat_percentage", 15.0)
    e.water_intake_liters = kwargs.get("water_intake_liters", 2.5)
    e.workout_frequency = kwargs.get("workout_frequency", 3)
    e.experience_level = kwargs.get("experience_level", 2)
    e.bmi = kwargs.get("bmi", 22.9)
    e.id = None
    return e


# ─────────────────────────────────────────────
#  create
# ─────────────────────────────────────────────

class TestCreate:

    def test_create_retourne_session_avec_id(self, repo):
        session = make_session()
        repo._execute.return_value = 15

        result = repo.create(session)

        assert result.id == 15
        assert result is session

    def test_create_appelle_execute_avec_bons_params(self, repo):
        session = make_session(age=30, weight_kg=80.0)
        repo._execute.return_value = 1

        repo.create(session)

        args = repo._execute.call_args[0]
        assert "INSERT INTO exercice_sessions" in args[0]
        assert args[1][0] == 30
        assert args[1][2] == 80.0

    def test_create_propage_exception(self, repo):
        repo._execute.side_effect = RuntimeError("DB error")

        with pytest.raises(RuntimeError):
            repo.create(make_session())


# ─────────────────────────────────────────────
#  getById
# ─────────────────────────────────────────────

class TestGetById:

    def test_retourne_session_si_trouve(self, repo):
        row = {"id_exercice_sessions": 1, "age": 25, "gender": 1}
        repo._fetch_one.return_value = row

        with patch("Repositories.ExerciceSessionsRepository.ExerciceSession") as MockSession:
            MockSession.from_dict.return_value = MagicMock()
            result = repo.getById(1)

        assert result is not None

    def test_retourne_none_si_non_trouve(self, repo):
        repo._fetch_one.return_value = None

        with patch("Repositories.ExerciceSessionsRepository.ExerciceSession") as MockSession:
            MockSession.from_dict.return_value = None
            result = repo.getById(999)

        assert result is None

    def test_appelle_fetch_one_avec_bon_id(self, repo):
        repo._fetch_one.return_value = None

        with patch("Repositories.ExerciceSessionsRepository.ExerciceSession") as MockSession:
            MockSession.from_dict.return_value = None
            repo.getById(5)

        args = repo._fetch_one.call_args[0]
        assert args[1] == (5,)


# ─────────────────────────────────────────────
#  getAll
# ─────────────────────────────────────────────

class TestGetAll:

    def test_retourne_liste_vide(self, repo):
        repo._fetch_all.return_value = []

        with patch("Repositories.ExerciceSessionsRepository.ExerciceSession") as MockSession:
            MockSession.from_dict.return_value = MagicMock()
            result = repo.getAll()

        assert result == []

    def test_retourne_liste_de_sessions(self, repo):
        repo._fetch_all.return_value = [{"id": 1}, {"id": 2}]

        with patch("Repositories.ExerciceSessionsRepository.ExerciceSession") as MockSession:
            MockSession.from_dict.return_value = MagicMock()
            result = repo.getAll()

        assert len(result) == 2


# ─────────────────────────────────────────────
#  update
# ─────────────────────────────────────────────

class TestUpdate:

    def test_update_retourne_session(self, repo):
        session = make_session()
        session.id = 1
        repo._execute.return_value = None

        result = repo.update(session)

        assert result is session

    def test_update_appelle_execute_avec_bon_id(self, repo):
        session = make_session()
        session.id = 42

        repo.update(session)

        args = repo._execute.call_args[0]
        assert "UPDATE exercice_sessions" in args[0]
        assert args[1][-1] == 42

    def test_update_propage_exception(self, repo):
        session = make_session()
        repo._execute.side_effect = RuntimeError("DB error")

        with pytest.raises(RuntimeError):
            repo.update(session)


# ─────────────────────────────────────────────
#  delete
# ─────────────────────────────────────────────

class TestDelete:

    def test_retourne_true(self, repo):
        result = repo.delete(1)

        assert result is True

    def test_appelle_execute_avec_bon_id(self, repo):
        repo.delete(9)

        args = repo._execute.call_args[0]
        assert "DELETE FROM exercice_sessions" in args[0]
        assert args[1] == (9,)


# ─────────────────────────────────────────────
#  get_kpis
# ─────────────────────────────────────────────

class TestGetKpis:

    def test_retourne_zeros_si_table_vide(self, repo):
        repo._fetch_one.return_value = {"totalPatients": 0}

        result = repo.get_kpis()

        assert result["totalPatients"] == 0
        assert result["avgCaloriesBurned"] == 0

    def test_retourne_kpis_si_donnees(self, repo):
        repo._fetch_one.return_value = {
            "totalPatients": 100,
            "avgCaloriesBurned": 450.5,
            "avgSessionDuration": 75.0,
            "totalCalories": 45050,
            "totalDuration": 7500,
        }

        result = repo.get_kpis()

        assert result["totalPatients"] == 100
        assert result["avgCaloriesBurned"] == 450.5

    def test_retourne_zeros_si_fetch_none(self, repo):
        repo._fetch_one.return_value = None

        result = repo.get_kpis()

        assert result["totalPatients"] == 0


# ─────────────────────────────────────────────
#  get_sport_distribution
# ─────────────────────────────────────────────

class TestGetSportDistribution:

    def test_retourne_liste(self, repo):
        repo._fetch_all.return_value = [
            {"type": "Cardio", "sessions": 50},
            {"type": "Yoga", "sessions": 30},
        ]

        result = repo.get_sport_distribution()

        assert len(result) == 2
        assert result[0]["type"] == "Cardio"

    def test_retourne_liste_vide(self, repo):
        repo._fetch_all.return_value = []

        result = repo.get_sport_distribution()

        assert result == []
