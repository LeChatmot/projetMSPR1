# Architecture Frontend - MSPR Santé & Fitness

## Vue d'ensemble

Cette architecture a été refactorisée pour faciliter l'intégration avec le backend tout en préservant le visuel existant.

## Structure des dossiers

```
src/app/
├── components/       # Composants UI (inchangés visuellement)
│   ├── Dashboard.tsx
│   ├── PatientsPage.tsx
│   ├── NutritionPage.tsx
│   ├── SportPage.tsx
│   └── ...
├── hooks/           # Hooks React pour la gestion des données
│   ├── useDashboard.ts
│   ├── usePatients.ts
│   ├── useSport.ts
│   └── useNutrition.ts
├── services/        # Couche d'abstraction API
│   ├── api.ts          # Configuration HTTP + fallback
│   ├── patientService.ts
│   ├── sportService.ts
│   └── nutritionService.ts
├── types/          # Types TypeScript centralisés
│   └── index.ts
└── data/           # Mock data + fonctions de calcul
    └── mockData.ts
```

## Comment ça marche

### 1. Les hooks (useXxx)

Chaque page utilise un hook dédié qui:

- Gère le chargement (`loading`)
- Gère les erreurs (`error`)
- Retourne les données prêtes à afficher

```tsx
// Exemple d'utilisation dans un composant
const { patients, stats, loading, error } = usePatients();

if (loading) return <Spinner />;
if (error) return <Error message={error} />;

return <div>{patients.map(p => ...)}</div>;
```

### 2. Les services

Chaque service (patient, sport, nutrition) propose des fonctions comme:

- `getXxx()` - Récupérer les données
- `createXxx()` - Créer une entrée
- `updateXxx()` - Modifier une entrée
- `deleteXxx()` - Supprimer une entrée

### 3. Le fallback automatique

Le système détecte automatiquement si le backend est disponible:

- **Backend OK** → Appels API réels
- **Backend KO** → Utilisation des mock data

```
ts
// Dans api.ts
async function apiCall<T>(endpoint, options, mockFallback) {
  if (await checkBackendHealth()) {
    // Appel HTTP réel
    return fetchRealData();
  }
  // Fallback vers mock
  return mockFallback();
}
```

## Connexion au Backend

### Configuration de l'URL

Dans `services/api.ts`, modifier la constante:

```
ts
const API_CONFIG = {
  baseURL: 'http://localhost:5000/api', // ← Changer ici
};
```

### Endpoints attendus par le backend

| Service   | Endpoint              | Méthodes  |
| --------- | --------------------- | --------- |
| Patients  | `/api/patients`       | GET, POST |
| Sport     | `/api/sport/sessions` | GET, POST |
| Nutrition | `/api/nutrition/*`    | GET, POST |

### Format de réponse attendu

```
json
{
  "data": [...],
  "success": true,
  "message": "...",
  "timestamp": "2024-01-01T00:00:00Z"
}
```

## Ajout d'une nouvelle page

1. **Créer le service** dans `services/`
2. **Créer le hook** dans `hooks/`
3. **Importer le hook** dans le composant
4. **Ajouter la route** dans `App.tsx`

## Commandes utiles

```
bash
# Installer les dépendances
npm install

# Lancer le frontend
npm run dev

# Lancer le backend (Python)
python backend.py
```

## Bonnes pratiques

1. **Toujours utiliser les hooks** plutôt que d'importer directement les mock data
2. **Les composants restent "dumb"** - ils ne font qu'afficher les données
3. **La logique métier** est dans les hooks et services
4. **Les types** sont centralisés dans `types/index.ts`
