import pytest
from unittest.mock import MagicMock, patch


@pytest.fixture
def repo():
    with patch("pymysql.connect") as mock_connect:
        mock_conn = MagicMock()
        mock_conn.open = True
        mock_connect.return_value = mock_conn

        from Repositories.UtilisateursRepository import UtilisateursRepository
        r = UtilisateursRepository()
        r._conn = mock_conn
        r._execute = MagicMock()
        r._fetch_one = MagicMock()
        return r


def make_utilisateur(**kwargs):
    u = MagicMock()
    u.nom = kwargs.get("nom", "Dupont")
    u.prenom = kwargs.get("prenom", "Jean")
    u.pseudo = kwargs.get("pseudo", "jdupont")
    u.email = kwargs.get("email", "jean@example.com")
    u.mot_de_passe = kwargs.get("mot_de_passe", "motdepasse123")
    u.role = kwargs.get("role", "user")
    u.id = None
    return u


class TestCreate:

    def test_create_retourne_utilisateur_avec_id(self, repo):
        utilisateur = make_utilisateur()
        repo._execute.return_value = 42

        with patch("Repositories.UtilisateursRepository.generate_password_hash", return_value="hashed_pw"):
            result = repo.create(utilisateur)

        assert result.id == 42

    def test_create_efface_mot_de_passe(self, repo):
        utilisateur = make_utilisateur()
        repo._execute.return_value = 1

        with patch("Repositories.UtilisateursRepository.generate_password_hash", return_value="hashed_pw"):
            result = repo.create(utilisateur)

        assert result.mot_de_passe is None

    def test_create_appelle_execute_avec_bons_params(self, repo):
        utilisateur = make_utilisateur(
            nom="Martin",
            prenom="Alice",
            pseudo="amartin",
            email="alice@example.com",
            mot_de_passe="secret",
            role="admin",
        )
        repo._execute.return_value = 5

        with patch("Repositories.UtilisateursRepository.generate_password_hash", return_value="hashed_pw"):
            repo.create(utilisateur)

        args = repo._execute.call_args[0]
        assert "INSERT INTO utilisateurs" in args[0]
        assert args[1][0] == "Martin"
        assert args[1][1] == "Alice"
        assert args[1][2] == "amartin"
        assert args[1][3] == "alice@example.com"
        assert args[1][4] == "hashed_pw"
        assert args[1][5] == "admin"

    def test_create_hash_le_mot_de_passe(self, repo):
        utilisateur = make_utilisateur(mot_de_passe="motdepasse123")
        repo._execute.return_value = 1

        with patch("Repositories.UtilisateursRepository.generate_password_hash", return_value="hashed_pw") as mock_hash:
            repo.create(utilisateur)

        mock_hash.assert_called_once_with("motdepasse123")

    def test_create_propage_exception(self, repo):
        utilisateur = make_utilisateur()
        repo._execute.side_effect = RuntimeError("DB error")

        with patch("Repositories.UtilisateursRepository.generate_password_hash", return_value="hashed_pw"):
            with pytest.raises(RuntimeError):
                repo.create(utilisateur)


class TestFindByEmail:

    def test_retourne_utilisateur_si_trouve(self, repo):
        row = {
            "id_utilisateurs": 1,
            "nom": "Dupont",
            "prenom": "Jean",
            "pseudo": "jdupont",
            "email": "jean@example.com",
            "mot_de_passe": "hashed",
            "role": "user",
        }
        repo._fetch_one.return_value = row
        repo._to_model = MagicMock(return_value=MagicMock())

        result = repo.find_by_email("jean@example.com")

        assert result is not None

    def test_retourne_none_si_non_trouve(self, repo):
        repo._fetch_one.return_value = None
        repo._to_model = MagicMock(return_value=None)

        result = repo.find_by_email("inconnu@example.com")

        assert result is None

    def test_appelle_fetch_one_avec_bon_email(self, repo):
        repo._fetch_one.return_value = None
        repo._to_model = MagicMock(return_value=None)

        repo.find_by_email("test@example.com")

        args = repo._fetch_one.call_args[0]
        assert "WHERE email = %s" in args[0]
        assert args[1] == ("test@example.com",)


class TestEmailExists:

    def test_retourne_true_si_email_existe(self, repo):
        repo._fetch_one.return_value = {"id_utilisateurs": 1}

        result = repo.email_exists("jean@example.com")

        assert result is True

    def test_retourne_false_si_email_inexistant(self, repo):
        repo._fetch_one.return_value = None

        result = repo.email_exists("inconnu@example.com")

        assert result is False

    def test_appelle_fetch_one_avec_bon_email(self, repo):
        repo._fetch_one.return_value = None

        repo.email_exists("test@example.com")

        args = repo._fetch_one.call_args[0]
        assert "WHERE email = %s" in args[0]
        assert args[1] == ("test@example.com",)


class TestPseudoExists:

    def test_retourne_true_si_pseudo_existe(self, repo):
        repo._fetch_one.return_value = {"id_utilisateurs": 1}

        result = repo.pseudo_exists("jdupont")

        assert result is True

    def test_retourne_false_si_pseudo_inexistant(self, repo):
        repo._fetch_one.return_value = None

        result = repo.pseudo_exists("pseudo_inconnu")

        assert result is False

    def test_appelle_fetch_one_avec_bon_pseudo(self, repo):
        repo._fetch_one.return_value = None

        repo.pseudo_exists("jdupont")

        args = repo._fetch_one.call_args[0]
        assert "WHERE pseudo = %s" in args[0]
        assert args[1] == ("jdupont",)
