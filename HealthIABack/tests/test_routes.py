import pytest
from unittest.mock import patch, MagicMock
from app import app


@pytest.fixture
def client():
    app.config["TESTING"] = True
    with app.test_client() as client:
        yield client


# ─────────────────────────────────────────────
# /api/health
# ─────────────────────────────────────────────

class TestHealthCheck:

    def test_retourne_status_ok(self, client):
        response = client.get("/api/health")
        assert response.status_code == 200
        assert response.get_json()["status"] == "ok"


# ─────────────────────────────────────────────
# /api/auth/register
# ─────────────────────────────────────────────

class TestRegister:

    def test_inscription_succes(self, client):
        mock_utilisateur = MagicMock()
        mock_utilisateur.to_public_dict.return_value = {
            "id": 1, "nom": "Dupont", "prenom": "Jean",
            "pseudo": "jdupont", "email": "jean@example.com", "role": "user"
        }

        with patch("app.UtilisateursRepository") as MockRepo:
            instance = MockRepo.return_value
            instance.email_exists.return_value = False
            instance.pseudo_exists.return_value = False
            instance.create.return_value = mock_utilisateur

            response = client.post("/api/auth/register", json={
                "nom": "Dupont", "prenom": "Jean", "pseudo": "jdupont",
                "email": "jean@example.com", "mot_de_passe": "secret123"
            })

        assert response.status_code == 201
        data = response.get_json()
        assert data["success"] is True

    def test_champs_manquants_retourne_400(self, client):
        response = client.post("/api/auth/register", json={"nom": "Dupont"})
        assert response.status_code == 400
        assert response.get_json()["success"] is False

    def test_email_deja_utilise_retourne_409(self, client):
        with patch("app.UtilisateursRepository") as MockRepo:
            instance = MockRepo.return_value
            instance.email_exists.return_value = True

            response = client.post("/api/auth/register", json={
                "nom": "Dupont", "prenom": "Jean", "pseudo": "jdupont",
                "email": "jean@example.com", "mot_de_passe": "secret123"
            })

        assert response.status_code == 409

    def test_pseudo_deja_pris_retourne_409(self, client):
        with patch("app.UtilisateursRepository") as MockRepo:
            instance = MockRepo.return_value
            instance.email_exists.return_value = False
            instance.pseudo_exists.return_value = True

            response = client.post("/api/auth/register", json={
                "nom": "Dupont", "prenom": "Jean", "pseudo": "jdupont",
                "email": "jean@example.com", "mot_de_passe": "secret123"
            })

        assert response.status_code == 409


# ─────────────────────────────────────────────
# /api/auth/login
# ─────────────────────────────────────────────

class TestLogin:

    def test_login_succes(self, client):
        mock_utilisateur = MagicMock()
        mock_utilisateur.to_public_dict.return_value = {
            "id": 1, "email": "jean@example.com", "role": "user"
        }

        with patch("app.UtilisateursRepository") as MockRepo:
            instance = MockRepo.return_value
            instance.find_by_email.return_value = mock_utilisateur
            instance.verify_password.return_value = True

            response = client.post("/api/auth/login", json={
                "email": "jean@example.com", "mot_de_passe": "secret123"
            })

        assert response.status_code == 200
        assert response.get_json()["success"] is True

    def test_identifiants_incorrects_retourne_401(self, client):
        with patch("app.UtilisateursRepository") as MockRepo:
            instance = MockRepo.return_value
            instance.find_by_email.return_value = MagicMock()
            instance.verify_password.return_value = False

            response = client.post("/api/auth/login", json={
                "email": "jean@example.com", "mot_de_passe": "mauvais"
            })

        assert response.status_code == 401

    def test_champs_manquants_retourne_400(self, client):
        response = client.post("/api/auth/login", json={"email": "jean@example.com"})
        assert response.status_code == 400


# ─────────────────────────────────────────────
# /api/dashboard/kpis
# ─────────────────────────────────────────────

class TestDashboardKpis:

    def test_retourne_kpis(self, client):
        with patch("app.ExerciceSessionsRepository") as MockRepo:
            instance = MockRepo.return_value
            instance.get_kpis.return_value = {
                "totalPatients": 100,
                "avgCaloriesBurned": 450.5,
                "avgSessionDuration": 60.0,
                "totalCalories": 45050,
                "totalDuration": 6000,
            }

            response = client.get("/api/dashboard/kpis")

        assert response.status_code == 200
        data = response.get_json()
        assert data["success"] is True
        assert data["data"]["totalPatients"] == 100

    def test_erreur_repository_retourne_500(self, client):
        with patch("app.ExerciceSessionsRepository") as MockRepo:
            instance = MockRepo.return_value
            instance.get_kpis.side_effect = RuntimeError("DB down")

            response = client.get("/api/dashboard/kpis")

        assert response.status_code == 500
        assert response.get_json()["success"] is False


# ─────────────────────────────────────────────
# /api/patients
# ─────────────────────────────────────────────

class TestPatients:

    def _make_session(self, bmi=22.0, age=30, gender=1, weight=70.0, height=175.0):
        s = MagicMock()
        s.bmi = bmi
        s.age = age
        s.gender = gender
        s.weightKg = weight
        s.heightCm = height
        return s

    def test_retourne_liste_patients(self, client):
        with patch("app.ExerciceSessionsRepository") as MockRepo:
            instance = MockRepo.return_value
            instance.getAll.return_value = [self._make_session()]

            response = client.get("/api/patients")

        assert response.status_code == 200
        patients = response.get_json()["data"]
        assert len(patients) == 1

    def test_risque_obesite_si_bmi_superieur_30(self, client):
        with patch("app.ExerciceSessionsRepository") as MockRepo:
            instance = MockRepo.return_value
            instance.getAll.return_value = [self._make_session(bmi=32.0)]

            response = client.get("/api/patients")

        patient = response.get_json()["data"][0]
        assert patient["riskDisease"] == "Obesity"

    def test_risque_surpoids_si_bmi_entre_25_et_30(self, client):
        with patch("app.ExerciceSessionsRepository") as MockRepo:
            instance = MockRepo.return_value
            instance.getAll.return_value = [self._make_session(bmi=27.0)]

            response = client.get("/api/patients")

        patient = response.get_json()["data"][0]
        assert patient["riskDisease"] == "Overweight"

    def test_risque_nul_si_bmi_normal(self, client):
        with patch("app.ExerciceSessionsRepository") as MockRepo:
            instance = MockRepo.return_value
            instance.getAll.return_value = [self._make_session(bmi=22.0)]

            response = client.get("/api/patients")

        patient = response.get_json()["data"][0]
        assert patient["riskDisease"] == "None"


# ─────────────────────────────────────────────
# /api/publications
# ─────────────────────────────────────────────

class TestPublications:

    def test_get_publications(self, client):
        with patch("app.PublicationsRepository") as MockRepo:
            instance = MockRepo.return_value
            instance.getAll.return_value = [
                {"id": 1, "libelle": "Test", "contenu": "Contenu", "auteur": "Jean"}
            ]

            response = client.get("/api/publications")

        assert response.status_code == 200
        assert len(response.get_json()["data"]) == 1

    def test_create_publication_succes(self, client):
        mock_pub = {"id": 1, "libelle": "Titre", "contenu": "Corps", "auteur": "Jean"}

        with patch("app.PublicationsRepository") as MockRepo:
            instance = MockRepo.return_value
            instance.create.return_value = None
            instance.getById.return_value = mock_pub

            response = client.post("/api/publications", json={
                "libelle": "Titre", "contenu": "Corps", "id_utilisateurs": 1
            })

        assert response.status_code == 201

    def test_create_publication_sans_contenu_retourne_400(self, client):
        response = client.post("/api/publications", json={"id_utilisateurs": 1})
        assert response.status_code == 400

    def test_delete_publication_introuvable_retourne_404(self, client):
        with patch("app.PublicationsRepository") as MockRepo:
            instance = MockRepo.return_value
            instance.getById.return_value = None

            response = client.delete("/api/publications/999")

        assert response.status_code == 404


# ─────────────────────────────────────────────
# /api/nutrition/stats
# ─────────────────────────────────────────────

class TestNutritionStats:

    def test_retourne_stats_nutrition(self, client):
        with patch("app.DietRecommandationsRepository") as MockRepo:
            instance = MockRepo.return_value
            instance.get_nutrition_stats.return_value = {
                "totalDietTypes": 5,
                "activePlans": 5,
                "averageCaloriesPerDay": 2100.0,
                "availableRecipes": 15,
            }

            response = client.get("/api/nutrition/stats")

        assert response.status_code == 200
        data = response.get_json()["data"]
        assert data["totalDietTypes"] == 5
