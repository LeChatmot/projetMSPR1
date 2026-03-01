# 🔌 Guide de Connexion Backend Flask

## Ce que tu dois changer

### 1. Modifier l'URL de l'API (1 seul fichier)

Ouvre : `projetMSPR1/Frontend/src/app/services/api.ts`

Ligne 8 :

```
typescript
// Change cette ligne
baseURL: 'http://localhost:5000/api'

// Si ton backend est sur un autre port
baseURL: 'http://localhost:TON_PORT/api'
```

---

## Les Endpoints à créer dans Flask

Ton backend Flask doit exposer ces endpoints :

### Patients

```
GET /api/patients
→ Retourne: [{ id, age, gender, riskDisease, dietRecommendation, weight, importDate }]

GET /api/patients/stats
→ Retourne: { totalPatients, patientsWithRisk, averageAge, averageWeight }
```

### Sport

```
GET /api/sport/sessions
→ Retourne: [{ type, duration, caloriesBurned, date }]

GET /api/sport/stats
→ Retourne: { totalSessions, totalCalories, totalDuration, averageDuration, averageCalories }

GET /api/sport/distribution
→ Retourne: [{ type, sessions }]

GET /api/sport/types
→ Retourne: [{ type, name, description, intensity, icon, color }]
```

### Nutrition

```
GET /api/nutrition/diet-distribution
→ Retourne: [{ name, value, color }]

GET /api/nutrition/stats
→ Retourne: { totalDietTypes, activePlans, averageCaloriesPerDay, availableRecipes }

GET /api/nutrition/plans
→ Retourne: [{ name, description, meals: { breakfast, lunch, dinner }, icon, color }]
```

### Dashboard

```
GET /api/dashboard/kpis
→ Retourne: { totalPatients, avgCaloriesBurned, avgSessionDuration, healthAlerts }

GET /api/dashboard/weight-evolution
→ Retourne: [{ month, averageWeight }]
```

### Health Check

```
GET /api/health
→ Retourne: { status: "ok" }
```

---

## Format de Réponse JSON

Chaque endpoint doit retourner ce format :

```
json
{
  "data": [...],
  "success": true,
  "message": "OK",
  "timestamp": "2026-02-04T10:30:00Z"
}
```

---

## Exemple de Code Flask Minimal

```
python
from flask import Flask, jsonify
from flask_cors import CORS
from datetime import datetime

app = Flask(__name__)
CORS(app)  # Permet les requêtes du frontend

# === PATIENTS ===
@app.route('/api/patients')
def get_patients():
    patients = [
        {"id": "P001", "age": 45, "gender": "M", "riskDisease": "Hypertension",
         "dietRecommendation": "Low Carb", "weight": 85.5, "importDate": "2026-02-04"}
    ]
    return jsonify({
        "data": patients,
        "success": True,
        "message": "OK",
        "timestamp": datetime.now().isoformat()
    })

@app.route('/api/patients/stats')
def get_patients_stats():
    return jsonify({
        "data": {
            "totalPatients": 8,
            "patientsWithRisk": 3,
            "averageAge": 43,
            "averageWeight": 73.5
        },
        "success": True,
        "message": "OK",
        "timestamp": datetime.now().isoformat()
    })

# === SPORT ===
@app.route('/api/sport/sessions')
def get_sport_sessions():
    sessions = [
        {"type": "Yoga", "duration": 45, "caloriesBurned": 180, "date": "2026-02-04"},
        {"type": "HIIT", "duration": 30, "caloriesBurned": 350, "date": "2026-02-04"}
    ]
    return jsonify({
        "data": sessions,
        "success": True,
        "message": "OK",
        "timestamp": datetime.now().isoformat()
    })

@app.route('/api/sport/stats')
def get_sport_stats():
    return jsonify({
        "data": {
            "totalSessions": 17,
            "totalCalories": 5620,
            "totalDuration": 855,
            "averageDuration": 50,
            "averageCalories": 331
        },
        "success": True,
        "message": "OK",
        "timestamp": datetime.now().isoformat()
    })

@app.route('/api/sport/distribution')
def get_sport_distribution():
    return jsonify({
        "data": [
            {"type": "Yoga", "sessions": 4},
            {"type": "HIIT", "sessions": 4},
            {"type": "Cardio", "sessions": 5},
            {"type": "Strength", "sessions": 4}
        ],
        "success": True,
        "message": "OK",
        "timestamp": datetime.now().isoformat()
    })

# === NUTRITION ===
@app.route('/api/nutrition/diet-distribution')
def get_diet_distribution():
    return jsonify({
        "data": [
            {"name": "Low Carb", "value": 2, "color": "#3b82f6"},
            {"name": "Balanced", "value": 3, "color": "#10b981"},
            {"name": "High Protein", "value": 1, "color": "#f59e0b"},
            {"name": "Mediterranean", "value": 1, "color": "#8b5cf6"},
            {"name": "Low Fat", "value": 1, "color": "#ef4444"}
        ],
        "success": True,
        "message": "OK",
        "timestamp": datetime.now().isoformat()
    })

# === DASHBOARD ===
@app.route('/api/dashboard/kpis')
def get_dashboard_kpis():
    return jsonify({
        "data": {
            "totalPatients": 8,
            "avgCaloriesBurned": 331,
            "avgSessionDuration": 50,
            "healthAlerts": 3
        },
        "success": True,
        "message": "OK",
        "timestamp": datetime.now().isoformat()
    })

@app.route('/api/dashboard/weight-evolution')
def get_weight_evolution():
    return jsonify({
        "data": [
            {"month": "Sept 2025", "averageWeight": 74.2},
            {"month": "Oct 2025", "averageWeight": 73.8},
            {"month": "Nov 2025", "averageWeight": 72.5},
            {"month": "Déc 2025", "averageWeight": 71.9},
            {"month": "Jan 2026", "averageWeight": 71.2},
            {"month": "Fév 2026", "averageWeight": 70.5}
        ],
        "success": True,
        "message": "OK",
        "timestamp": datetime.now().isoformat()
    })

# === HEALTH CHECK ===
@app.route('/api/health')
def health_check():
    return jsonify({"status": "ok"})

if __name__ == '__main__':
    app.run(debug=True, port=5000)
```

---

## Résumé des Étapes

| Étape | Action                                                          |
| ----- | --------------------------------------------------------------- |
| 1     | Installe flask-cors : `pip install flask flask-cors`            |
| 2     | Crée le fichier backend.py avec le code ci-dessus               |
| 3     | Lance Flask : `python backend.py`                               |
| 4     | Vérifie que ça marche : `curl http://localhost:5000/api/health` |
| 5     | Le frontend détectera automatiquement le backend !              |

---

## Si ça ne marche pas

Le frontend utilisera automatiquement les mocks si le backend n'est pas détecté. Tu verras un message dans la console :

- `⚠️ Backend non disponible, mode mock activé` = normal, c'est le fallback
- Pas de message = backend connecté !

C'est tout ! 🎉
