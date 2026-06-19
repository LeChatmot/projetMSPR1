# Plan de Tests — HealthIA

## 1. Objectifs

Valider le bon fonctionnement de l'application HealthIA sur trois niveaux :
- **Unitaire** : chaque composant isolé (repositories, logique métier)
- **Intégration** : les routes HTTP de l'API Flask
- **Fonctionnel** : les composants React (rendu, interactions utilisateur)

---

## 2. Périmètre de test

| Composant | Type | Outil | Fichier(s) |
|---|---|---|---|
| Repositories (Python) | Unitaire | pytest + mock | `tests/test_*Repository.py` |
| Routes API Flask | Intégration | pytest + Flask test client | `tests/test_routes.py` |
| Composants React | Fonctionnel | Vitest + Testing Library | `src/tests/*.test.tsx` |

---

## 3. Stratégie

### 3.1 Tests Backend (Python / Flask)

**Principe** : les tests ne se connectent jamais à une vraie base de données.  
Les dépendances externes (MySQL) sont remplacées par des **mocks** (`unittest.mock.patch`).  
Cela garantit des tests **rapides**, **reproductibles** et **indépendants de l'environnement**.

**Couverture ciblée : ≥ 70 %**

Pour chaque route HTTP, on teste :

| Scénario | Code HTTP attendu |
|---|---|
| Requête valide (cas nominal) | 200 / 201 |
| Données manquantes ou invalides | 400 |
| Ressource introuvable | 404 |
| Conflit (email déjà utilisé, etc.) | 409 |
| Panne du service de données | 500 |

### 3.2 Tests Frontend (TypeScript / React)

**Principe** : les composants React sont rendus en mémoire (jsdom).  
Les appels API sont interceptés via des mocks de `fetch`.

Composants testés :
- `Header` : affichage du nom utilisateur, navigation
- `LoginPage` : formulaire de connexion, gestion des erreurs
- `ProfilePage` : affichage et modification des données utilisateur

---

## 4. Cas de test détaillés

### 4.1 Authentification

| ID | Description | Entrée | Résultat attendu |
|---|---|---|---|
| AUTH-01 | Inscription valide | Tous les champs remplis | 201 + données utilisateur |
| AUTH-02 | Inscription sans champs | Corps vide | 400 |
| AUTH-03 | Email déjà existant | Email déjà en base | 409 |
| AUTH-04 | Pseudo déjà pris | Pseudo déjà en base | 409 |
| AUTH-05 | Connexion valide | Email + mot de passe corrects | 200 + données utilisateur |
| AUTH-06 | Mauvais mot de passe | Mot de passe incorrect | 401 |
| AUTH-07 | Connexion sans données | Corps vide | 400 |

### 4.2 Dashboard

| ID | Description | Entrée | Résultat attendu |
|---|---|---|---|
| DASH-01 | KPIs disponibles | GET /api/dashboard/kpis | 200 + objet KPIs |
| DASH-02 | Panne base de données | Repository lève une exception | 500 + success=false |

### 4.3 Patients

| ID | Description | Entrée | Résultat attendu |
|---|---|---|---|
| PAT-01 | Liste patients | GET /api/patients | 200 + tableau |
| PAT-02 | Risque obésité | Session avec BMI=32 | riskDisease="Obesity" |
| PAT-03 | Risque surpoids | Session avec BMI=27 | riskDisease="Overweight" |
| PAT-04 | Pas de risque | Session avec BMI=22 | riskDisease="None" |

### 4.4 Forum

| ID | Description | Entrée | Résultat attendu |
|---|---|---|---|
| FOR-01 | Liste publications | GET /api/publications | 200 + tableau |
| FOR-02 | Création publication | POST avec contenu + user_id | 201 |
| FOR-03 | Création sans contenu | POST sans contenu | 400 |
| FOR-04 | Suppression introuvable | DELETE /api/publications/999 | 404 |

### 4.5 Nutrition

| ID | Description | Entrée | Résultat attendu |
|---|---|---|---|
| NUT-01 | Stats nutrition | GET /api/nutrition/stats | 200 + statistiques |

### 4.6 Repositories (unitaires)

| ID | Description | Résultat attendu |
|---|---|---|
| REPO-01 | Création utilisateur | ID assigné, mot de passe hashé, champ effacé |
| REPO-02 | Email existant | Retourne True |
| REPO-03 | Email inexistant | Retourne False |
| REPO-04 | Création recommandation nutrition | ID assigné |
| REPO-05 | Pagination recommandations | Liste de la bonne taille |

---

## 5. Exécution des tests

### Lancer tous les tests backend avec rapport de couverture

```bash
cd HealthIABack
pytest
```

Le rapport HTML est généré dans : `HealthIABack/coverage_report/index.html`

### Lancer tous les tests frontend

```bash
cd Frontend
npm run test
```

### Lancer les tests frontend avec interface graphique

```bash
cd Frontend
npm run test:ui
```

---

## 6. Intégration Continue (CI/CD)

Les tests sont exécutés automatiquement à chaque push via le pipeline Jenkins :

1. **SonarQube** analyse la qualité du code
2. **pytest** exécute les tests backend et génère le rapport de couverture
3. **Vitest** exécute les tests frontend
4. Le pipeline échoue si un test est en erreur (qualité gate)

Voir `Jenkinsfile` à la racine du projet pour la configuration complète.

---

## 7. Environnement de test

| Élément | Version |
|---|---|
| Python | 3.12 |
| pytest | dernière stable |
| pytest-cov | dernière stable |
| Node.js | 20 |
| Vitest | 4.x |
| React Testing Library | dernière stable |
