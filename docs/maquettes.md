# Maquettes — HealthIA

## Lien Figma

Maquettes interactives disponibles ici :
[Ouvrir les maquettes sur Figma](https://www.figma.com/make/6fjDfOK09Fm4P8VDkx5R7d/Patient-Dashboard-Code-Generation?t=5LEvR8QVw9ISh9E0-1)

Les captures statiques sont disponibles dans le dossier [`docs/maquettes/`](maquettes/).

---

## Contexte de conception

Les maquettes ont été réalisées en amont du développement pour cadrer les besoins utilisateurs et valider l'architecture visuelle avant de coder. Le branding "HealthTrack" visible dans les maquettes a été adapté en "Santé & Fit" lors du développement, suite à une décision d'équipe pour mieux refléter le positionnement du produit final. La structure des écrans et les fonctionnalités représentées ont été conservées.

Le projet cible deux types d'utilisateurs :
- **Utilisateur standard** : consulte son tableau de bord santé, ses données d'activité et accède au Coach IA
- **Administrateur** : gère les recommandations nutritionnelles et les données patients

---

## Écrans maquettés

### Écran 1 — Vue d'ensemble (Dashboard)
![Vue d'ensemble](maquettes/dashboard.png)

**Fonctionnalités représentées :**
- KPIs santé en temps réel : objectif calorique, sommeil, hydratation, poids
- Graphique hebdomadaire des calories brûlées
- Profil médical rapide : régime assigné, allergies connues, état de santé
- Navigation latérale avec accès à tous les modules

**User stories couvertes :**
- En tant qu'utilisateur, je veux voir mes indicateurs de santé clés en un coup d'œil
- En tant qu'utilisateur, je veux visualiser l'évolution de mon activité sur la semaine
- En tant qu'utilisateur, je veux accéder à mon profil médical depuis le tableau de bord

---

### Écran 2 — Journal alimentaire et activités
![Journal](maquettes/journal.png)

**Fonctionnalités représentées :**
- Bilan calorique journalier (consommé / brûlé / solde net)
- Historique chronologique des repas et séances d'entraînement
- Ajout d'une nouvelle entrée (repas ou activité)
- Filtres par date

**User stories couvertes :**
- En tant qu'utilisateur, je veux enregistrer mes repas et activités au quotidien
- En tant qu'utilisateur, je veux voir mon bilan calorique du jour en temps réel

---

### Écran 3 — Mes données & statistiques
![Mes Données](maquettes/mes-donnees.png)

**Fonctionnalités représentées :**
- KPIs de progression : perte de poids, calories brûlées, adhésion au régime, qualité du sommeil
- Graphique d'évolution du poids sur 6 semaines
- Bilan calorique hebdomadaire (consommées vs brûlées)

**User stories couvertes :**
- En tant qu'utilisateur, je veux suivre ma progression santé sur le long terme
- En tant qu'utilisateur, je veux comparer mes calories consommées et brûlées par semaine

---

## Correspondance maquette → implémentation

| Écran maquetté | Route implémentée | Statut |
|---|---|---|
| Vue d'ensemble | `/` | ✅ Implémenté |
| Journal alimentaire | `/nutrition` | ✅ Implémenté |
| Mes données / Statistiques | `/sport` + `/patients` | ✅ Implémenté |
| Coach IA | `/coach-ia` | 🔄 En cours |
| Communauté | `/community` | ✅ Implémenté |

---

## Choix de design

| Décision | Justification |
|---|---|
| Sidebar fixe à gauche | Navigation permanente pour accès rapide entre modules |
| Thème sombre (slate-800) | Réduction de la fatigue visuelle pour usage prolongé |
| Couleur emerald pour les actions | Identité "santé/nature", différenciation claire des éléments interactifs |
| Cards KPI en haut de page | Les métriques clés sont visibles sans scroll |
