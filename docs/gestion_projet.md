# Gestion de Projet — HealthIA

## Méthodologie : Agile Scrum adapté

Le projet HealthIA a été conduit selon une méthodologie **Agile inspirée de Scrum**, adaptée à une équipe étudiante de petite taille travaillant en remote.

---

## Outils utilisés

| Outil | Usage | Pourquoi ce choix |
|---|---|---|
| **Jira** | Backlog, sprints, suivi des tâches | Outil standard de gestion de projet Agile, permet la traçabilité des user stories |
| **GitHub** | Versioning du code, pull requests, revues de code | Intégration native avec Jenkins CI/CD, historique complet des modifications |
| **Discord** | Communication quotidienne, weekly meetings, appels | Accessible à toute l'équipe, channels dédiés par domaine (backend, frontend, ETL) |
| **Jenkins** | Intégration continue et déploiement automatisé | Pipeline CI/CD automatique à chaque push |
| **SonarQube** | Qualité et sécurité du code | Analyse statique automatique, quality gate intégrée au pipeline |

---

## Cadence et rituels Agile

### Sprints
- **Durée** : 1 semaine
- **Outil** : Jira (backlog + board Kanban/Scrum)
- **Contenu** : User stories découpées en tâches assignées à chaque membre

### Weekly Meeting (hebdomadaire)
- **Fréquence** : Chaque semaine
- **Canal** : Discord (vocal)
- **Format** :
  1. Tour de table : ce qui a été fait, ce qui bloque
  2. Revue de l'avancement sur Jira
  3. Planification de la semaine suivante
  4. Décisions techniques collectives

### Call week-end (bi-mensuel)
- **Fréquence** : Chaque week-end (selon disponibilités)
- **Objectif** : Synchronisation rapide, déblocage, revue de code croisée

### Revue de code
- **Outil** : GitHub Pull Requests
- **Règle** : Toute feature passe par une PR reviewée par au moins un autre membre avant merge sur `main`

---

## Organisation des branches Git

```
main              ← branche stable, déployée en prod
│
├── feat---Ajout-infoUser           ← profil santé, Coach IA Mistral, historique IA, date de naissance
├── feat/coach-ia-mistral           ← intégration LLM Mistral (mergée)
├── feat/fix-responsive-ui          ← améliorations UI/UX (mergée)
└── fix/tests-deploiement-qualite   ← tests, CI/CD, documentation (mergée)
```

**Convention de nommage :**
- `feat/` — nouvelle fonctionnalité
- `fix/` — correction de bug ou amélioration qualité
- `hotfix/` — correction urgente en production

---

## Répartition des rôles

| Membre | Domaine principal |
|---|---|
| Baptiste COL | Backend Flask, API REST, DevOps, Tests |
| Grégory Mutombo | Frontend React, Coach IA (Mistral), UI/UX |
| Maxime Chanel | ETL Airflow, Base de données, Données |

---

## Suivi de la qualité

- **SonarQube** : analyse automatique à chaque push — quality gate configurée
- **Coverage pytest** : rapport HTML généré à chaque pipeline (`htmlcov/index.html`)
- **Coverage Vitest** : rapport HTML frontend généré à chaque pipeline
- **Jenkins** : tableau de bord des builds, tendance des tests (JUnit)

---

## Gestion des risques identifiés

| Risque | Probabilité | Impact | Mitigation |
|---|---|---|---|
| Indisponibilité de l'API Mistral | Faible | Élevé | Clé API via variable d'environnement, fallback réponses locales côté frontend |
| Régression après merge | Moyen | Moyen | Tests automatisés + CI bloquant si tests échouent |
| Désynchronisation base de données | Faible | Élevé | Migrations Pyway versionnées (V1_01 → V1_42) — jamais modifiées, uniquement ajoutées |
| Conflit de merge entre branches | Moyen | Faible | Convention de nommage + PR obligatoires |
