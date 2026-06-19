# Changelog — HealthIA

Toutes les évolutions notables du projet sont documentées ici.  
Format : `[version] — date` avec les catégories `Ajouté`, `Modifié`, `Corrigé`, `Supprimé`.

---

## [1.3.0] — 2026-06-18

### Ajouté
- **Recherche et filtres sur les sessions sport** : nouvel endpoint `GET /api/sport/search`
  avec filtres par type de sport, niveau d'expérience, plage de calories, et pagination complète
- **Plan de tests complet** : document `docs/plan_de_tests.md` couvrant les 3 niveaux de test
  (unitaire, intégration, fonctionnel) avec 30+ cas de test identifiés
- **Tests d'intégration des routes Flask** : `tests/test_routes.py` — 20+ tests couvrant
  toutes les routes principales (auth, dashboard, patients, forum, nutrition)
- **README complet** : documentation de déploiement avec schéma d'architecture,
  guide Docker pas-à-pas, tableau des variables d'environnement
- **Documentation gestion de projet** : `docs/gestion_projet.md` — méthodologie Agile,
  outils, cadence, répartition des rôles, gestion des risques

### Modifié
- **Jenkinsfile** : ajout des rapports JUnit (tendance des tests), health check par retry
  (12 tentatives × 10s) au lieu d'un sleep fixe, `allowMissing: true` sur les rapports HTML
- **pytest.ini** : génération rapport JUnit XML (`test-report.xml`) aligné avec Jenkins,
  rapport HTML dans `htmlcov/` cohérent avec la configuration CI

### Corrigé
- **Sécurité CORS** : `CORS(app)` remplacé par origines restreintes via variable
  d'environnement `CORS_ALLOWED_ORIGINS` (fix alerte SonarQube S5122)
- **Exposition réseau Flask** : `host="0.0.0.0"` remplacé par `FLASK_HOST`
  configurable via env var — `127.0.0.1` par défaut en local (fix alerte SonarQube S8392)
- **Incohérence chemin coverage** : `htmlcov/` unifié entre `pytest.ini` et Jenkins

---

## [1.2.0] — 2026-05-15

### Ajouté
- Page "À propos" (`AboutPage.tsx`)
- Composants UI responsive (Header, Sidebar)
- Amélioration de la réactivité de l'interface utilisateur

### Modifié
- Configuration des ports Docker (frontend : 5173, backend : 5000)
- Patch Dockerfile backend

---

## [1.1.0] — 2026-03-08

### Ajouté
- Système d'authentification complet (register, login, hashage bcrypt)
- Forum communautaire (publications, commentaires imbriqués)
- Page profil utilisateur avec modification des informations et mot de passe
- Panel d'administration : gestion des recommandations nutritionnelles (CRUD)
- Pagination sur les endpoints admin (`/api/admin/patients`, `/api/admin/nutrition`)

### Modifié
- Migration base de données vers MySQL 8.0 (35 fichiers Flyway)
- Refactoring des repositories avec pattern `BaseRepository`

---

## [1.0.0] — 2026-02-01

### Ajouté
- Dashboard avec KPIs santé (calories, sessions, poids)
- Module sport : sessions d'entraînement, statistiques, distribution par type
- Module nutrition : recommandations diététiques, plans alimentaires
- Module patients : liste, profils de risque (BMI), statistiques
- Pipeline ETL Apache Airflow (3 DAGs : aliments, régimes, sessions sport)
- Intégration CI/CD Jenkins avec SonarQube
- Conteneurisation complète Docker Compose (4 services)
- Base de données MySQL avec 35 migrations versionnées
