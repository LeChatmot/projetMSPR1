# Guide d'installation — HealthIA

Ce guide permet à un nouveau développeur d'avoir l'environnement complet opérationnel en quelques commandes.

## Prérequis

| Outil | Version minimale | Vérification |
|---|---|---|
| Git | 2.x | `git --version` |
| Python | 3.11+ | `python --version` |
| Node.js | 20.x | `node --version` |
| Docker Desktop | 24.x | `docker --version` |
| Docker Compose | 2.x | `docker compose version` |

---

## 1. Cloner le projet

```bash
git clone https://github.com/LeChatmot/projetMSPR1.git
cd projetMSPR1
```

---

## 2. Backend Python (Flask)

```bash
cd HealthIABack

# Créer l'environnement virtuel
python -m venv venv

# Activer le venv
# Windows :
.\venv\Scripts\activate
# Linux / Mac :
source venv/bin/activate

# Installer les dépendances
pip install -r requirements.txt
```

### Variables d'environnement backend

```bash
# Copier le fichier exemple
cp .env.example .env
```

Ouvrir `.env` et renseigner les valeurs :

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=healthia
DB_PASSWORD=TON_MOT_DE_PASSE
DB_NAME=health_ia_db
FLASK_HOST=127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:5173
MISTRAL_API_KEY=TA_CLE_API
```

---

## 3. Frontend React

```bash
cd Frontend

# Installer les dépendances
npm install
```

---

## 4. Lancer en local (sans Docker)

Ouvrir **deux terminaux** :

**Terminal 1 — Backend :**
```bash
cd HealthIABack
.\venv\Scripts\activate   # Windows
python app.py
# → API disponible sur http://localhost:5000
```

**Terminal 2 — Frontend :**
```bash
cd Frontend
npm run dev
# → Interface disponible sur http://localhost:5173
```

> La base de données MySQL doit être démarrée séparément (voir section Docker ci-dessous).

---

## 5. Lancer avec Docker (recommandé)

Lance tous les services en une commande depuis la racine du projet :

```bash
docker compose up -d --build
```

| Service | URL |
|---|---|
| Frontend React | http://localhost:5173 |
| Backend Flask | http://localhost:5000 |
| MySQL | localhost:3306 |

Vérifier que tout est opérationnel :
```bash
curl http://localhost:5000/api/health
# → {"status": "ok"}
```

Arrêter les conteneurs :
```bash
docker compose down
```

> ⚠️ Ne jamais faire `docker compose down -v` sauf si vous voulez effacer toutes les données MySQL.

---

## 6. Lancer les tests

### Tests backend
```bash
cd HealthIABack
.\venv\Scripts\activate   # Windows
python -m pytest -v
# → Rapport HTML disponible dans htmlcov/index.html
```

### Tests frontend
```bash
cd Frontend
npm run test
```

---

## 7. Entraîner le modèle ML (première fois)

```bash
cd HealthIABack
.\venv\Scripts\activate
python ml/train_health_risk_model.py
# → Modèle sauvegardé dans ml/health_risk_model.pkl
```

---

## Structure du projet

```
projetMSPR1/
├── Frontend/          → Application React (Vite + TypeScript)
├── HealthIABack/      → API REST Flask (Python)
│   ├── ml/            → Modèle ML scikit-learn
│   ├── Repositories/  → Accès base de données
│   └── tests/         → Tests d'intégration pytest
├── Datasets/          → Données brutes CSV (non versionnées)
├── docs/              → Documentation technique
├── docker-compose.yml → Orchestration des services
└── Jenkinsfile        → Pipeline CI/CD
```

---

## Problèmes fréquents

| Problème | Solution |
|---|---|
| `pip` non reconnu | Utiliser `python -m pip` à la place |
| `ModuleNotFoundError: flask` | Le venv n'est pas activé — relancer `.\venv\Scripts\activate` |
| Port 5000 déjà utilisé | `docker compose down` puis relancer |
| Connexion MySQL refusée | Vérifier que Docker est démarré et que `.env` est renseigné |
| `health_risk_model.pkl` introuvable | Lancer `python ml/train_health_risk_model.py` en premier |
