# 🏗️ Architecture Frontend - MSPR Santé & Fitness

## 📁 Structure du projet

```
src/
├── app/
│   ├── components/          # Composants React (UI)
│   │   ├── Dashboard.tsx
│   │   ├── PatientsPage.tsx
│   │   ├── SportPage.tsx
│   │   ├── NutritionPage.tsx
│   │   └── ...
│   │
│   ├── hooks/              # Hooks React personnalisés
│   │   ├── usePatients.ts
│   │   ├── useSport.ts
│   │   ├── useNutrition.ts
│   │   ├── useDashboard.ts
│   │   └── index.ts        # Export centralisé
│   │
│   ├── services/           # Couche d'accès aux données
│   │   ├── api.ts          # Configuration HTTP + fallback mock
│   │   ├── patientService.ts
│   │   ├── sportService.ts
│   │   ├── nutritionService.ts
│   │   └── index.ts        # Export centralisé
│   │
│   ├── types/              # Types TypeScript centralisés
│   │   └── index.ts
│   │
│   └── data/
│       └── mockData.ts     # Données de fallback (mode mock)
│
└── ...
```

## 🎯 Principes architecturaux

### 1. **Séparation des responsabilités**

| Couche         | Rôle                    | Exemple                                  |
| -------------- | ----------------------- | ---------------------------------------- |
| **Composants** | Affichage UI uniquement | `Dashboard.tsx` appelle `useDashboard()` |
| **Hooks**      | Logique métier et état  | `useDashboard()` agrège les données      |
| **Services**   | Appels API / Mock       | `patientService.getAllPatients()`        |
| **Types**      | Contrats de données     | `interface Patient { ... }`              |

### 2. **Mode Mock / API dynamique**

Le système détecte automatiquement si le backend est disponible :

```typescript
// services/api.ts
const API_CONFIG = {
  baseURL: "http://localhost:5000/api", // ← Modifier ici pour changer l'URL backend
  timeout: 5000,
};
```

**Fonctionnement :**

1. Au premier appel, le système vérifie si `http://localhost:5000/api/health` répond
2. Si **OK** → Utilise l'API réelle
3. Si **KO** → Fallback automatique sur les mocks

### 3. **Comment connecter le backend**

#### Étape 1 : Configurer l'URL du backend

Modifier `src/app/services/api.ts` :

```typescript
const API_CONFIG = {
  baseURL: "http://localhost:5000/api", // ← Votre URL Flask
  timeout: 5000,
  retries: 1,
};
```

#### Étape 2 : Implémenter les endpoints dans le backend

Le frontend attend ces endpoints :

**Patients :**

```
GET    /api/patients              → Patient[]
GET    /api/patients/:id          → Patient
GET    /api/patients/stats        → PatientStats
GET    /api/patients/risk         → Patient[]
POST   /api/patients              → Patient
PUT    /api/patients/:id          → Patient
DELETE /api/patients/:id          → void
```

**Sport :**

```
GET    /api/sport/sessions        → SportSession[]
GET    /api/sport/sessions/recent?limit=8 → SportSession[]
GET    /api/sport/stats           → SportStats
GET    /api/sport/distribution    → SportDistribution[]
GET    /api/sport/calories-by-type → { type, avgCalories }[]
GET    /api/sport/types           → SportTypeInfo[]
POST   /api/sport/sessions        → SportSession
```

**Nutrition :**

```
GET    /api/nutrition/diet-distribution → DietDistribution[]
GET    /api/nutrition/stats       → NutritionStats
GET    /api/nutrition/diet-plans  → DietPlan[]
GET    /api/nutrition/diet-plans/:name → DietPlan
GET    /api/nutrition/recommendations/:patientId → { dietPlan, dailyCalories, restrictions }
```

**Health Check :**

```
GET    /api/health                → { status: 'ok' }
```

#### Étape 3 : Format de réponse attendu

Toutes les réponses doivent suivre ce format :

```json
{
  "data": { ... },           // Les données demandées
  "success": true,           // Boolean
  "message": "...",          // Optionnel
  "timestamp": "2026-02-04T10:30:00Z"
}
```

### 4. **Forcer le mode Mock ou API**

Pour le développement/test, vous pouvez forcer un mode :

```typescript
import { forceMockMode, forceApiMode, resetBackendCheck } from "./services/api";

// Forcer le mode mock (ignore le backend)
forceMockMode();

// Forcer le mode API (ignore les mocks)
forceApiMode();

// Réinitialiser la détection (revérifiera au prochain appel)
resetBackendCheck();
```

## 🧪 Exemple d'utilisation dans un composant

### Avant (logique dans le composant) :

```typescript
// ❌ Ancienne approche - calculs dans le composant
import { mockPatients } from "../data/mockData";

export function PatientsPage() {
  const totalPatients = mockPatients.length; // Logique métier ici !
  const patientsWithRisk = mockPatients.filter(
    (p) => p.riskDisease !== "None",
  ).length;
  // ...
}
```

### Après (logique dans les hooks) :

```typescript
// ✅ Nouvelle approche - composant "dumb"
import { usePatients } from '../hooks/usePatients';

export function PatientsPage() {
  const { patients, stats, loading, error } = usePatients();

  if (loading) return <div>Chargement...</div>;
  if (error) return <div>Erreur: {error}</div>;

  // Le composant ne fait que l'affichage !
  return (
    <div>
      <p>Total: {stats.totalPatients}</p>
      <p>À risque: {stats.patientsWithRisk}</p>
    </div>
  );
}
```

## 📊 Flux de données

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│ Composant   │────▶│    Hook     │────▶│   Service   │────▶│  Backend    │
│  (UI)       │◄────│  (Logique)  │◄────│   (API)     │◄────│   (Flask)   │
└─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘
                           │
                           ▼
                    ┌─────────────┐
                    │  Mock Data  │  (Fallback si backend KO)
                    └─────────────┘
```

## 🚀 Avantages de cette architecture

1. **Backend-ready** : Changez juste l'URL, tout fonctionne
2. **Testable** : Les hooks sont testables unitairement
3. **Lisible** : Chaque fichier a une responsabilité unique
4. **Robuste** : Fallback automatique sur les mocks
5. **Type-safe** : Types TypeScript centralisés
6. **Maintenable** : Modifications localisées

## 📝 Checklist pour connecter le backend

- [ ] Backend Flask démarré sur `localhost:5000`
- [ ] Endpoint `/api/health` implémenté
- [ ] Endpoints patients implémentés
- [ ] Endpoints sport implémentés
- [ ] Endpoints nutrition implémentés
- [ ] CORS configuré sur le backend
- [ ] Format de réponse JSON respecté
- [ ] Test avec `forceApiMode()` pour valider

---

**Besoin d'aide ?** Consultez les fichiers dans `src/app/services/` pour voir les détails des appels API attendus.
