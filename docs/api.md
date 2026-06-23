# Documentation API — HealthIA Backend

Base URL : `http://localhost:5000/api`

Toutes les réponses suivent ce format standard :
```json
{
  "success": true,
  "data": { ... },
  "message": "",
  "timestamp": "2026-06-18T10:00:00+00:00"
}
```

En cas d'erreur : `"success": false` et `"message"` contient le détail.

---

## Santé

### `GET /health`
Vérifie que le backend est opérationnel.

**Réponse 200 :**
```json
{ "status": "ok" }
```

---

## Authentification

### `POST /auth/register`
Crée un nouveau compte utilisateur.

**Corps de la requête :**
```json
{
  "nom": "Dupont",
  "prenom": "Jean",
  "pseudo": "jdupont",
  "email": "jean@example.com",
  "mot_de_passe": "motdepasse123"
}
```

**Réponses :**
| Code | Description |
|---|---|
| 201 | Compte créé — retourne les données publiques de l'utilisateur |
| 400 | Champ(s) manquant(s) |
| 409 | Email ou pseudo déjà utilisé |
| 500 | Erreur serveur |

---

### `POST /auth/login`
Authentifie un utilisateur.

**Corps de la requête :**
```json
{
  "email": "jean@example.com",
  "mot_de_passe": "motdepasse123"
}
```

**Réponses :**
| Code | Description |
|---|---|
| 200 | Authentifié — retourne les données publiques de l'utilisateur |
| 400 | Email ou mot de passe manquant |
| 401 | Identifiants incorrects |

---

## Dashboard

### `GET /dashboard/kpis`
Retourne les indicateurs clés de santé agrégés.

**Réponse 200 :**
```json
{
  "totalPatients": 1000,
  "avgCaloriesBurned": 905.4,
  "avgSessionDuration": 73.2,
  "totalCalories": 905420,
  "totalDuration": 73200,
  "healthAlerts": 5
}
```

---

### `GET /dashboard/sport-distribution`
Répartition des sessions par type de sport.

**Réponse 200 :**
```json
[
  { "type": "Strength", "sessions": 320 },
  { "type": "Cardio",   "sessions": 280 }
]
```

---

### `GET /dashboard/weight-evolution`
Poids moyen par niveau d'expérience (axe de progression).

**Réponse 200 :**
```json
[
  { "month": "Niveau 1", "averageWeight": 72.4 },
  { "month": "Niveau 2", "averageWeight": 78.1 }
]
```

---

## Patients

### `GET /patients`
Liste simplifiée des patients avec profil de risque BMI.

**Réponse 200 :** tableau de patients
```json
[
  {
    "id": "P1",
    "name": "Patient 1",
    "age": 28,
    "gender": "Homme",
    "weight": 82.5,
    "height": 178.0,
    "riskDisease": "Overweight",
    "dietRecommendation": "Balanced"
  }
]
```

**Valeurs `riskDisease` :** `None` | `Overweight` (BMI > 25) | `Obesity` (BMI > 30) | `Underweight` (BMI < 18.5)

---

### `GET /patients/stats`
Statistiques globales des patients.

**Réponse 200 :**
```json
{
  "totalPatients": 1000,
  "patientsWithRisk": 423,
  "averageAge": 34,
  "averageWeight": 73.8
}
```

---

## Sport

### `GET /sport/sessions`
50 dernières sessions de sport avec nom du type d'activité.

---

### `GET /sport/stats`
Statistiques globales des sessions sport.

---

### `GET /sport/distribution`
Répartition par type de sport (alias de `/dashboard/sport-distribution`).

---

### `GET /sport/search` ⭐ *Évolution v1.3*
Recherche paginée avec filtres sur les sessions de sport.

**Paramètres de requête (tous optionnels) :**

| Paramètre | Type | Description | Exemple |
|---|---|---|---|
| `workout_type` | int | ID du type de sport | `1` |
| `experience_level` | int | Niveau 1, 2 ou 3 | `2` |
| `min_calories` | float | Calories brûlées minimum | `500` |
| `max_calories` | float | Calories brûlées maximum | `1200` |
| `page` | int | Numéro de page (défaut : 1) | `2` |
| `per_page` | int | Résultats par page (défaut : 20, max : 100) | `50` |

**Exemple de requête :**
```
GET /api/sport/search?workout_type=1&min_calories=800&page=1&per_page=10
```

**Réponse 200 :**
```json
{
  "items": [ { ... } ],
  "total": 142,
  "page": 1,
  "per_page": 10,
  "total_pages": 15
}
```

---

## Nutrition

### `GET /nutrition/recommendations`
Liste des recommandations nutritionnelles (100 premières).

### `DELETE /nutrition/recommendations/<id>`
Supprime une recommandation (accès admin).

### `GET /nutrition/distribution`
Répartition des types de régimes.

### `GET /nutrition/stats`
Statistiques nutritionnelles globales.

### `GET /nutrition/plans`
Liste des types de régimes disponibles.

---

## Forum

### `GET /publications`
Toutes les publications avec auteur et nombre de commentaires.

### `POST /publications`
Crée une publication.

**Corps :**
```json
{
  "libelle": "Titre (optionnel)",
  "contenu": "Corps de la publication",
  "id_utilisateurs": 1
}
```

### `DELETE /publications/<id>`
Supprime une publication et ses commentaires (CASCADE).

### `GET /publications/<id>/commentaires`
Commentaires d'une publication (liste plate triée par date).

### `POST /publications/<id>/commentaires`
Ajoute un commentaire ou une réponse.

**Corps :**
```json
{
  "contenu": "Mon commentaire",
  "id_utilisateurs": 1,
  "id_commentaires_parent": null
}
```

---

## Administration

### `GET /admin/patients`
Patients paginés.

**Paramètres :** `page` (défaut : 1), `per_page` (défaut : 50, max : 100)

### `GET /admin/nutrition`
Recommandations nutritionnelles paginées.

### `POST /admin/nutrition`
Crée une recommandation nutritionnelle (19 champs).

### `PUT /admin/nutrition/<id>`
Met à jour une recommandation.

### `DELETE /admin/nutrition/<id>`
Supprime une recommandation.

### `GET /admin/reference-data`
Toutes les données de référence (genres, allergies, types de maladies, etc.) pour alimenter les menus déroulants.

---

## Profil Utilisateur

### `PUT /utilisateurs/<id>`
Met à jour nom, prénom et email.

### `PUT /utilisateurs/<id>/password`
Change le mot de passe (vérifie l'ancien avant d'enregistrer le nouveau hashé).
