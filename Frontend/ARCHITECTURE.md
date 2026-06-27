# Architecture Frontend — HealthIA

## Vue d'ensemble

Application React + TypeScript construite avec Vite. Le frontend communique exclusivement avec le backend Flask via un proxy Vite (`/api/*` → `http://localhost:5000`).

## Structure des dossiers

```
src/app/
├── components/       # Pages et composants UI
│   ├── Dashboard.tsx       — KPIs réels + profil santé personnel
│   ├── CoachIAPage.tsx     — Chat Mistral AI avec historique persisté
│   ├── ProfilePage.tsx     — Profil santé (IMC, TDEE, date de naissance)
│   ├── RegisterPage.tsx    — Inscription avec date de naissance
│   ├── PatientsPage.tsx
│   ├── NutritionPage.tsx
│   ├── SportPage.tsx
│   └── ...
├── hooks/            # Hooks React — logique métier
│   ├── useCoachIA.ts       — Mistral + historique chargé au mount
│   ├── useDashboard.ts
│   ├── usePatients.ts
│   ├── useSport.ts
│   └── useNutrition.ts
├── services/         # Couche d'appels API
│   ├── api.ts              — apiCall() centralisé
│   ├── profileService.ts   — profil santé + références
│   ├── patientService.ts
│   ├── sportService.ts
│   └── nutritionService.ts
├── context/
│   └── AuthContext.tsx     — Session utilisateur (backendId, nom, role...)
└── types/
    └── index.ts            — Types TypeScript centralisés
```

## Principes clés

### Appels API
Tous les appels passent par `apiCall()` dans `services/api.ts`. Le proxy Vite redirige `/api/*` vers le backend Flask (configurable via `VITE_API_TARGET` dans `.env.local`).

### Hooks
Chaque page a son hook dédié qui gère `loading`, `error` et les données. Les composants restent "dumb" — ils affichent uniquement ce que le hook retourne.

### Coach IA
`useCoachIA(userId)` charge l'historique depuis `GET /api/coach/history/<id>` au montage. Chaque échange est persisté en base via `POST /api/coach/chat`. Le bouton "Nouvelle conversation" appelle `DELETE /api/coach/history/<id>`.

### Profil santé
L'âge n'est jamais stocké manuellement — il est calculé côté backend depuis `date_of_birth` et retourné dans `GET /api/profile/<id>`.

## Commandes utiles

```bash
# Installer les dépendances
npm install

# Lancer le frontend (dev)
npm run dev

# Lancer les tests
npm run test

# Build de production
npm run build
```

## Configuration proxy

`.env.local` (gitignored) :
```
VITE_API_TARGET=http://localhost:5000
```

En Docker, `VITE_API_TARGET` n'est pas défini — le proxy utilise `http://backend:5000` par défaut.
