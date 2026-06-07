# test_DietRecommandationsRepository.py

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

        from Repositories.DietRecommandationsRepository import DietRecommandationsRepository
        r = DietRecommandationsRepository()
        r._conn = mock_conn
        r._execute = MagicMock()
        r._fetch_one = MagicMock()
        r._fetch_all = MagicMock()
        return r


def make_diet(**kwargs):
    d = MagicMock()
    d.age = kwargs.get("age", 30)
    d.gender = kwargs.get("gender", 1)
    d.height_cm = kwargs.get("height_cm", 170)
    d.current_weight_kg = kwargs.get("current_weight_kg", 70.0)
    d.bmi = kwargs.get("bmi", 24.2)
    d.disease_type = kwargs.get("disease_type", 1)
    d.severity = kwargs.get("severity", 1)
    d.diet_recommandation = kwargs.get("diet_recommandation", 1)
    d.daily_caloric_target = kwargs.get("daily_caloric_target", 2000)
    d.activity_level = kwargs.get("activity_level", 2)
    d.cholesterol_mg = kwargs.get("cholesterol_mg", 180)
    d.blood_pressure_mmhg = kwargs.get("blood_pressure_mmhg", 120)
    d.glucose_mg_dl = kwargs.get("glucose_mg_dl", 90)
    d.dietary_restrictions = kwargs.get("dietary_restrictions", 1)
    d.allergy = kwargs.get("allergy", 1)
    d.preferred_cuisine = kwargs.get("preferred_cuisine", 1)
    d.weekly_exercise_hours = kwargs.get("weekly_exercise_hours", 5.0)
    d.adherence_to_diet_plan = kwargs.get("adherence_to_diet_plan", 0.8)
    d.dietary_nutrient_imbalance_score = kwargs.get("dietary_nutrient_imbalance_score", 3.5)
    d.id = None
    return d


# ─────────────────────────────────────────────
#  create
# ─────────────────────────────────────────────

class TestCreate:

    def test_create_retourne_diet_avec_id(self, repo):
        diet = make_diet()
        repo._execute.return_value = 30

        result = repo.create(diet)

        assert result.id == 30
        assert result is diet

    def test_create_appelle_execute_avec_bons_params(self, repo):
        diet = make_diet(age=40, daily_caloric_target=1800)
        repo._execute.return_value = 1

        repo.create(diet)

        args = repo._execute.call_args[0]
        assert "INSERT INTO diet_recommendations" in args[0]
        assert args[1][0] == 40
        assert args[1][8] == 1800

    def test_create_propage_exception(self, repo):
        repo._execute.side_effect = RuntimeError("DB error")

        with pytest.raises(RuntimeError):
            repo.create(make_diet())


# ─────────────────────────────────────────────
#  getAll
# ─────────────────────────────────────────────

class TestGetAll:

    def test_retourne_liste(self, repo):
        repo._fetch_all.return_value = [{"id": 1}, {"id": 2}]

        result = repo.getAll()

        assert len(result) == 2

    def test_retourne_liste_vide(self, repo):
        repo._fetch_all.return_value = []

        result = repo.getAll()

        assert result == []


# ─────────────────────────────────────────────
#  count
# ─────────────────────────────────────────────

class TestCount:

    def test_retourne_nombre(self, repo):
        repo._fetch_one.return_value = {"total": 42}

        result = repo.count()

        assert result == 42

    def test_retourne_zero_si_none(self, repo):
        repo._fetch_one.return_value = None

        result = repo.count()

        assert result == 0


# ─────────────────────────────────────────────
#  getById
# ─────────────────────────────────────────────

class TestGetById:

    def test_retourne_dict_si_trouve(self, repo):
        repo._fetch_one.return_value = {"id": 1, "age": 30}

        result = repo.getById(1)

        assert result is not None
        assert result["age"] == 30

    def test_retourne_none_si_non_trouve(self, repo):
        repo._fetch_one.return_value = None

        result = repo.getById(999)

        assert result is None


# ─────────────────────────────────────────────
#  delete
# ─────────────────────────────────────────────

class TestDelete:

    def test_retourne_true(self, repo):
        result = repo.delete(1)

        assert result is True

    def test_appelle_execute_avec_bon_id(self, repo):
        repo.delete(5)

        args = repo._execute.call_args[0]
        assert "DELETE FROM diet_recommendations" in args[0]
        assert args[1] == (5,)

    def test_propage_exception(self, repo):
        repo._execute.side_effect = RuntimeError("DB error")

        with pytest.raises(RuntimeError):
            repo.delete(1)


# ─────────────────────────────────────────────
#  get_diet_distribution
# ─────────────────────────────────────────────

class TestGetDietDistribution:

    def test_retourne_liste(self, repo):
        repo._fetch_all.return_value = [
            {"name": "Vegan", "value": 40},
            {"name": "Keto", "value": 20},
        ]

        result = repo.get_diet_distribution()

        assert len(result) == 2
        assert result[0]["name"] == "Vegan"

    def test_retourne_liste_vide(self, repo):
        repo._fetch_all.return_value = []

        result = repo.get_diet_distribution()

        assert result == []


# ─────────────────────────────────────────────
#  get_nutrition_stats
# ─────────────────────────────────────────────

class TestGetNutritionStats:

    def test_retourne_stats(self, repo):
        repo._fetch_one.return_value = {
            "totalDietTypes": 5,
            "averageCaloriesPerDay": 1900.0,
        }

        result = repo.get_nutrition_stats()

        assert result["totalDietTypes"] == 5
        assert result["averageCaloriesPerDay"] == 1900.0
        assert result["activePlans"] == 5
        assert result["availableRecipes"] == 15

    def test_retourne_zeros_si_none(self, repo):
        repo._fetch_one.return_value = None

        result = repo.get_nutrition_stats()

        assert result["totalDietTypes"] == 0
        assert result["averageCaloriesPerDay"] == 0

    def test_retourne_zeros_si_totalDietTypes_none(self, repo):
        repo._fetch_one.return_value = {"totalDietTypes": None, "averageCaloriesPerDay": None}

        result = repo.get_nutrition_stats()

        assert result["availableRecipes"] == 0
