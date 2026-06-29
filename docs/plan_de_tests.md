# Plan de Tests — HealthIA

## 1. Objectifs

Valider le bon fonctionnement de l'application HealthIA sur trois niveaux :
- **Unitaire** : chaque repository Python isolé via mocks
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

### 4.6 Profil Santé

| ID | Description | Entrée | Résultat attendu |
|---|---|---|---|
| SANTE-01 | Récupérer profil santé | GET /api/profile/3 | 200 + imc + age calculé + tdee_kcal |
| SANTE-02 | Profil utilisateur inexistant | GET /api/profile/999 | 404 |
| SANTE-03 | Mise à jour profil santé | PUT /api/profile/3/sante avec date_of_birth | 200 + IMC et TDEE recalculés |
| SANTE-04 | Calcul âge depuis date de naissance | date_of_birth = "2000-03-20" | age = 26 |
| SANTE-05 | Références santé disponibles | GET /api/references/sante | 200 + allergies + genders + activity_levels |

### 4.7 Coach IA (Mistral)

| ID | Description | Entrée | Résultat attendu |
|---|---|---|---|
| COACH-01 | Envoi message valide | POST /api/coach/chat + message | 200 + reply non vide |
| COACH-02 | Message vide | POST /api/coach/chat + message="" | 400 |
| COACH-03 | Historique chargé | GET /api/coach/history/3 | 200 + tableau de messages |
| COACH-04 | Historique effacé | DELETE /api/coach/history/3 | 200 + historique vide |

### 4.8 Recommandations ML

| ID | Description | Entrée | Résultat attendu |
|---|---|---|---|
| ML-01 | Recommandations pour utilisateur avec profil complet | GET /api/recommendations/3 | 200 + 5 exercices triés par score |
| ML-02 | Utilisateur introuvable | GET /api/recommendations/999 | 404 |
| ML-03 | Bonus objectif appliqué | user.objectif = "perte_de_poids" | Cardio en position #1 (score × 1.5) |
| ML-04 | Utilisateur sans profil santé | user sans weight_kg ni height_cm | 200 + recommandations avec valeurs par défaut |
| ML-05 | Log MongoDB écrit | GET /api/recommendations/3 | Document inséré dans healthia_logs.recommendation_logs |

### 4.9 Sessions Sportives Personnelles

| ID | Description | Entrée | Résultat attendu |
|---|---|---|---|
| SESSION-01 | Récupérer sessions utilisateur | GET /api/user/sessions/3 | 200 + tableau de séances |
| SESSION-02 | Utilisateur sans séances | GET /api/user/sessions/999 | 200 + tableau vide |
| SESSION-03 | Créer séance valide | POST /api/user/sessions + payload complet | 201 + séance créée |
| SESSION-04 | Créer séance sans workout_type | POST sans workout_type | 400 |
| SESSION-05 | Séance apparaît dans stats du mois | POST séance mois courant puis GET sessions | stats mois mises à jour |
| SESSION-06 | Coach IA cite les séances | POST /api/coach/chat après SESSION-03 | reply mentionne le workout_type enregistré |

### 4.10 Repositories (unitaires)

| ID | Description | Résultat attendu |
|---|---|---|
| REPO-01 | Création utilisateur | ID assigné, mot de passe hashé, champ effacé |
| REPO-02 | Email existant | Retourne True |
| REPO-03 | Email inexistant | Retourne False |
| REPO-04 | Création recommandation nutrition | ID assigné |
| REPO-05 | Pagination recommandations | Liste de la bonne taille |
| REPO-06 | Création séance personnelle | ID assigné, workout_type, duration_min, calories_burned stockés |
| REPO-07 | Récupération séances par user | Retourne uniquement les séances du bon user_id |

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
