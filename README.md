# HealthIA — Plateforme de Santé Intelligente

Application web de suivi santé et fitness avec coaching IA, développée dans le cadre du MSPR CDA-DIADS (RNCP 37873 — Niveau 6).

---

## Sommaire

1. [Présentation du projet](#présentation-du-projet)
2. [Architecture technique](#architecture-technique)
3. [Prérequis](#prérequis)
4. [Déploiement avec Docker](#déploiement-avec-docker)
5. [Déploiement manuel (développement)](#déploiement-manuel-développement)
6. [Variables d'environnement](#variables-denvironnement)
7. [Pipeline ETL (Airflow)](#pipeline-etl-airflow)
8. [Tests](#tests)
9. [CI/CD Jenkins](#cicd-jenkins)

---

## Présentation du projet

HealthIA est une solution fullstack permettant de :

- Suivre les métriques de santé (IMC, calories, sessions sportives)
- Gérer des recommandations nutritionnelles personnalisées
- Interagir avec un **Coach IA** propulsé par Mistral AI
- Administrer les données patients via un panneau d'administration
- Animer une communauté via un forum intégré

---

## Architecture technique

```
┌─────────────────────────────────────────────────────────┐
│                    NAVIGATEUR (Client)                   │
│              React 18 + TypeScript + Vite               │
│                     Port : 5173                         │
└────────────────────────┬────────────────────────────────┘
                         │ HTTP / REST JSON
┌────────────────────────▼────────────────────────────────┐
│                  API Backend (Flask)                     │
│                   Python 3.12                           │
│                     Port : 5000                         │
│   45+ endpoints REST  |  Auth  |  Coach IA (Mistral)    │
└──────────┬─────────────────────────────┬────────────────┘
           │ PyMySQL                     │ Mistral API
┌──────────▼──────────┐      ┌──────────▼──────────────┐
│   MySQL 8.0         │      │   Mistral AI (externe)  │
│   Port : 3307       │      │   mistral-small-latest  │
│   35 migrations     │      └─────────────────────────┘
│   Flyway/Pyway      │
└──────────▲──────────┘
           │ SQLAlchemy
┌──────────┴──────────┐
│  Apache Airflow     │
│  Port : 8081        │
│  3 pipelines ETL    │
│  (CSV → MySQL)      │
└─────────────────────┘
```

### Stack technologique

| Couche | Technologie | Version |
|---|---|---|
| Frontend | React + TypeScript | 18.2 / 5.2 |
| Build | Vite | 7.x |
| Style | Tailwind CSS + Shadcn/UI | 3.4 |
| Backend | Flask (Python) | 3.12 |
| Base de données | MySQL | 8.0 |
| Pipeline ETL | Apache Airflow | 2.9 |
| IA | Mistral AI | mistral-small-latest |
| Conteneurisation | Docker + Docker Compose | - |
| CI/CD | Jenkins + SonarQube | - |

---

## Prérequis

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) ≥ 24.x
- [Docker Compose](https://docs.docker.com/compose/) ≥ 2.23
- Git

Pour le développement local (sans Docker) :
- Python 3.12
- Node.js 20
- MySQL 8.0

---

## Déploiement avec Docker

### Démarrage complet (recommandé)

```bash
# 1. Cloner le dépôt
git clone <https://github.com/LeChatmot/projetMSPR1>
cd projetMSPR1

# 2. Configurer les variables d'environnement (voir section dédiée)
cp HealthIABack/.env.example HealthIABack/.env
# Éditer HealthIABack/.env avec vos valeurs

# 3. Lancer tous les services
docker compose up --build

# 4. Vérifier que tout est démarré
docker compose ps
```

### Services disponibles après démarrage

| Service | URL | Description |
|---|---|---|
| Frontend (React) | http://localhost:5173 | Interface utilisateur |
| Backend (API Flask) | http://localhost:5000/api/health | API REST |
| Airflow (ETL) | http://localhost:8081 | Interface pipeline de données |
| MySQL | localhost:3307 | Base de données (accès direct) |

### Arrêt des services

```bash
# Arrêter sans supprimer les données
docker compose down

# Arrêter ET supprimer les volumes (reset complet)
docker compose down -v
```

### Vérification de santé

```bash
# Vérifier que l'API répond
curl http://localhost:5000/api/health
# Réponse attendue : {"status": "ok"}
```

---

## Déploiement manuel (développement)

### Backend Flask

```bash
cd HealthIABack

# Créer l'environnement virtuel
python -m venv venv
source venv/bin/activate      # Linux/Mac
venv\Scripts\activate         # Windows

# Installer les dépendances
pip install -r requirements.txt

# Configurer l'environnement
cp .env.example .env
# Éditer .env

# Lancer le serveur de développement
python app.py
# Serveur disponible sur http://localhost:5000
```

### Frontend React

```bash
cd Frontend

# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev
# Application disponible sur http://localhost:5173
```

---

## Variables d'environnement

Fichier : `HealthIABack/.env`

| Variable | Description | Valeur par défaut |
|---|---|---|
| `DB_HOST` | Hôte MySQL | `localhost` |
| `DB_PORT` | Port MySQL | `3306` |
| `DB_USER` | Utilisateur MySQL | `healthia` |
| `DB_PASSWORD` | Mot de passe MySQL | *(à définir)* |
| `DB_NAME` | Nom de la base de données | `health_ia_db` |
| `FLASK_HOST` | Adresse d'écoute du serveur Flask | `127.0.0.1` (local) / `0.0.0.0` (Docker) |
| `CORS_ALLOWED_ORIGINS` | Origines autorisées pour les requêtes cross-origin | `http://localhost:5173` |
| `MISTRAL_API_KEY` | Clé API Mistral AI | *(obligatoire pour le Coach IA)* |

> **Sécurité** : Le fichier `.env` est listé dans `.gitignore` et ne doit jamais être commité.

---

## Pipeline ETL (Airflow)

Les pipelines importent les données CSV dans la base MySQL.

### Pipelines disponibles

| Pipeline | Fichier source | Table cible |
|---|---|---|
| `daily_food_pipeline` | `daily_food_nutrition_dataset.csv` | `daily_foods` |
| `diet_recommandation_pipeline` | `diet_recommendations_dataset.csv` | `diet_recommendations` |
| `exercice_session_pipeline` | `gym_members_exercise_tracking_synthetic_data.csv` | `exercice_sessions` |

### Déclencher un pipeline manuellement

1. Accéder à l'interface Airflow : http://localhost:8081
2. Identifiants par défaut : `admin` / `admin`
3. Activer le DAG souhaité et cliquer sur **"Trigger DAG"**

---

## Tests

### Tests backend

```bash
cd HealthIABack
pytest
```

Génère un rapport HTML de couverture dans : `HealthIABack/htmlcov/index.html`

Voir [docs/plan_de_tests.md](docs/plan_de_tests.md) pour le plan de tests complet.

### Tests frontend

```bash
cd Frontend
npm run test
```

---

## CI/CD Jenkins

Le pipeline Jenkins (`Jenkinsfile` à la racine) automatise :

1. **Analyse qualité** — SonarQube avec quality gate
2. **Tests parallèles** — pytest (backend) + Vitest (frontend)
3. **Build Docker** — uniquement sur la branche `main`
4. **Déploiement** — `docker compose up` avec vérification de santé
5. **Notification** — Commentaire automatique sur la PR GitHub

### Déclencher le pipeline

Le pipeline se déclenche automatiquement à chaque push sur n'importe quelle branche. Pour un déclenchement manuel, utiliser l'interface Jenkins.
