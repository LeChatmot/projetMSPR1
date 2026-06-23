# Architecture Logicielle — HealthIA

## Vue d'ensemble

HealthIA est une application web full-stack composée de quatre couches distinctes communiquant via des APIs REST et un bus de données ETL.

---

## Diagramme d'architecture

```mermaid
graph TB
    subgraph Client["Navigateur"]
        UI["Frontend React\nVite + TypeScript\nlocalhost:5173"]
    end

    subgraph Backend["Serveur Backend"]
        API["API REST Flask\nPython 3.12\nlocalhost:5000"]
        Mistral["Coach IA\nMistral API"]
    end

    subgraph Data["Couche Données"]
        DB[("MySQL 8\nhealth_ia_db\nlocalhost:3306")]
        ETL["Pipeline ETL\nApache Airflow"]
        CSV["Datasets CSV\n3 fichiers sources"]
    end

    subgraph CI["Intégration Continue"]
        Jenkins["Jenkins\nCI/CD Pipeline"]
        Sonar["SonarQube\nQualité du code"]
    end

    UI -->|"HTTP REST /api/*"| API
    API -->|"Repository Pattern\nSQL queries"| DB
    API -->|"HTTP POST /chat"| Mistral
    CSV -->|"Extraction\nTransformation"| ETL
    ETL -->|"Chargement\n(INSERT)"| DB
    Jenkins -->|"Analyse statique"| Sonar
    Jenkins -->|"pytest + vitest"| Backend
    Jenkins -->|"docker compose up"| Client
```

---

## Description des composants

### Frontend — React (Vite + TypeScript)
- Interface utilisateur responsive et accessible (WCAG : `aria-label`, `aria-current`)
- Routing côté client avec React Router
- Appels API centralisés via des hooks personnalisés
- Tests unitaires : Vitest + React Testing Library

### API REST — Flask (Python)
- Architecture en couches : Routes → Repositories → MySQL
- Authentification par session
- CORS restreint via variable d'environnement `CORS_ALLOWED_ORIGINS`
- Binding configurable `FLASK_HOST` (127.0.0.1 local, 0.0.0.0 Docker)

### Coach IA — Mistral
- Intégration via API Mistral (clé `MISTRAL_API_KEY`)
- Génération de conseils personnalisés basés sur le profil utilisateur

### Base de données — MySQL 8
- 35 migrations versionnées (Flyway/Pyway V1_01 → V1_35)
- Tables principales : `utilisateurs`, `exercice_sessions`, `diet_recommendations`, `publications`, `workout_types`
- Repository Pattern pour l'accès aux données (20+ repositories)

### Pipeline ETL — Apache Airflow
- 3 DAGs pour l'ingestion des données CSV sources
- Transformation et nettoyage avant chargement en base
- Planification automatique des imports

### CI/CD — Jenkins + SonarQube
- Pipeline automatisé : SonarQube → Tests → Build Docker → Deploy → Health Check
- Rapports de couverture HTML (pytest-cov + Vitest)
- Rapports JUnit XML pour visualisation des tendances de tests
- Health check avec un sleep de 30 sec ( démarrage en 26 secs en moyenne)

---

## Flux de données

```mermaid
sequenceDiagram
    participant U as Utilisateur
    participant F as Frontend React
    participant A as API Flask
    participant D as MySQL

    U->>F: Consulte son profil santé
    F->>A: GET /api/dashboard/kpis
    A->>D: SELECT KPIs agrégés
    D-->>A: Données brutes
    A-->>F: JSON { totalPatients, avgCalories... }
    F-->>U: Affichage des KPIs

    U->>F: Recherche des sessions sport
    F->>A: GET /api/sport/search?workout_type=1&min_calories=500
    A->>D: SELECT filtré + paginé
    D-->>A: Résultats paginés
    A-->>F: JSON { items, total, page }
    F-->>U: Affichage des résultats
```

---

## Choix techniques justifiés

| Choix | Justification |
|---|---|
| Flask vs Django | Légèreté et flexibilité pour une API REST pure, sans ORM imposé |
| Repository Pattern | Séparation claire entre logique métier et accès aux données — testable via mocks |
| MySQL vs NoSQL | Données relationnelles structurées (patients ↔ sessions ↔ recommandations) |
| Vite vs Create React App | Build 10× plus rapide, HMR natif, standard actuel de l'écosystème React |
| Docker Compose | Orchestration locale reproductible — même commande pour tous les environnements |
