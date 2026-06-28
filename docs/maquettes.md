# Maquettes — HealthIA

## Processus de conception

La conception visuelle s'est déroulée en deux étapes :

1. **Wireframes basse fidélité (draw.io)** — cadrage des besoins et de la structure des écrans
2. **Maquettes haute fidélité (Figma)** — validation de l'identité visuelle et du design final

---

## Niveau 1 — Wireframes (draw.io)

Réalisés manuellement pour cadrer les besoins utilisateurs avant le développement.

Fichiers source draw.io : [Accéder aux fichiers draw.io (Google Drive)](https://drive.google.com/drive/folders/1IHREqZHPMFyAHUeclpHm3qw6ngtKIWbG?usp=drive_link)

### Connexion
![Wireframe Connexion](maquettes/Maquette%20HealthIA%20Coach%20-%20pages%20test-5-Connexion.drawio.png)

**Éléments représentés :**
- Logo centré + titre "Connexion à votre compte"
- Champ email + champ mot de passe
- Bouton principal "Se connecter"
- Lien "Pas encore de compte ? S'inscrire"

---

### Inscription
![Wireframe Inscription](maquettes/Maquette%20HealthIA%20Coach%20-%20pages%20test-6-Inscription.drawio.png)

**Éléments représentés :**
- Formulaire 2 colonnes : Prénom/Nom puis Pseudo/Date de naissance
- Champs email, mot de passe, confirmation
- Bouton "Créer mon compte"
- Lien "Déjà un compte ? Se connecter"

---

### Dashboard
![Wireframe Dashboard](maquettes/Maquette%20HealthIA%20Coach%20-%20pages%20test-1-Dashboard.drawio.png)

**Éléments représentés :**
- Sidebar de navigation avec tous les modules
- 4 cards KPI : Poids, IMC, Besoins caloriques, Objectif
- Bloc profil santé (taille, âge, niveau d'activité, objectif)
- Bloc allergies & TDEE

---

### Sport & Activités
![Wireframe Sport](maquettes/Maquette%20HealthIA%20Coach%20-%20pages%20test-7-Sport.drawio.png)

**Éléments représentés :**
- 4 KPI : Séances ce mois, Calories brûlées, Minutes totales, Sport favori
- Bouton "+ Ajouter une séance" en haut à droite
- Graphique en barres (répartition par type de sport)
- Liste des dernières séances avec durée et calories
- Modal d'ajout : type d'activité, durée, calories, date

---

### Communauté (Forum)
![Wireframe Communauté](maquettes/Maquette%20HealthIA%20Coach%20-%20pages%20test-2-Communaute.drawio.png)

**Éléments représentés :**
- Formulaire de nouvelle publication (champ texte + bouton Publier)
- Fil de publications avec avatar, pseudo, horodatage, contenu
- Lien "Commenter" par publication

---

### Profil utilisateur
![Wireframe Profil](maquettes/Maquette%20HealthIA%20Coach%20-%20pages%20test-3-Profil.drawio.png)

**Éléments représentés :**
- Informations du compte (nom, email, modification)
- Données de santé (date de naissance → âge calculé, taille, poids, genre, niveau d'activité, objectif)
- Section sécurité (changement de mot de passe)

---

### Coach IA
![Wireframe Coach IA](maquettes/Maquette%20HealthIA%20Coach%20-%20pages%20test-4-CoachIA.drawio.png)

**Éléments représentés :**
- Interface de chat : bulles utilisateur (droite) et réponses IA (gauche)
- Champ de saisie "Posez votre question..." + bouton "Envoyer"
- Historique de conversation scrollable
- Bouton "Nouvelle conversation"

---

## Niveau 2 — Maquettes haute fidélité (Figma)

[Ouvrir les maquettes Figma](https://www.figma.com/make/6fjDfOK09Fm4P8VDkx5R7d/Patient-Dashboard-Code-Generation?t=ybgALo6vNqVNDnsZ-1)

Les captures statiques sont disponibles dans le dossier [`docs/maquettes/`](maquettes/).

---

### Écran 1 — Connexion
![Page de connexion](maquettes/Page%20de%20connexion.png)

**Fonctionnalités représentées :**
- Formulaire de connexion centré (email + mot de passe)
- Bouton principal "Se connecter"
- Lien vers la page d'inscription

**User stories couvertes :**
- En tant qu'utilisateur, je veux me connecter avec mon email et mon mot de passe

---

### Écran 2 — Vue d'ensemble (Dashboard)
![Dashboard](maquettes/Dashboard%20Figma.png)

**Fonctionnalités représentées :**
- KPIs santé en temps réel : poids, IMC, besoins caloriques, objectif
- Bloc profil santé (taille, âge, niveau d'activité, statut IMC)
- Bloc allergies & TDEE estimés
- Navigation latérale avec accès à tous les modules

**User stories couvertes :**
- En tant qu'utilisateur, je veux voir mes indicateurs de santé clés en un coup d'œil
- En tant qu'utilisateur, je veux accéder à mon profil médical depuis le tableau de bord

---

### Écran 3 — Mes Activités Sportives
![Mes activités](maquettes/Mes%20activités%20Figma.png)

**Fonctionnalités représentées :**
- 4 KPIs : séances ce mois, calories brûlées, minutes totales, sport favori
- Graphique en barres de répartition par type de sport
- Liste des dernières séances avec durée et calories
- Bouton "+ Ajouter une séance" + modal de saisie

**User stories couvertes :**
- En tant qu'utilisateur, je veux enregistrer mes séances sportives et visualiser mes stats du mois

---

### Écran 4 — Nutrition
![Nutrition](maquettes/Nutrition%20Figma.png)

**Fonctionnalités représentées :**
- KPIs : types de régimes, plans actifs, calories moyennes/jour, recettes disponibles
- Graphique en camembert de la distribution des régimes
- Liste des plans alimentaires disponibles avec exemples de repas

**User stories couvertes :**
- En tant qu'utilisateur, je veux consulter les recommandations nutritionnelles adaptées à mon profil

---

### Écran 5 — Coach IA
![Coach IA](maquettes/Coach%20IA%20Figma.png)

**Fonctionnalités représentées :**
- Interface de chat avec bulles utilisateur (droite) et réponses IA (gauche)
- Champ de saisie + bouton envoyer
- Historique de conversation scrollable
- Bouton "Nouvelle conversation"

**User stories couvertes :**
- En tant qu'utilisateur, je veux poser des questions à un coach IA personnalisé qui connaît mon profil et mes séances

---

### Écran 6 — Communauté (Forum)
![Forum](maquettes/Forum%20Figma.png)

**Fonctionnalités représentées :**
- Zone de création de publication (texte + bouton Publier)
- Fil de publications avec avatar, pseudo, date, contenu
- Système de commentaires par publication

**User stories couvertes :**
- En tant qu'utilisateur, je veux partager mes expériences et interagir avec la communauté

---

### Écran 7 — Profil & Santé
![Profil](maquettes/Profils%20Figma.png)

**Fonctionnalités représentées :**
- Informations du compte (nom, prénom, email)
- Données de santé (date de naissance → âge calculé automatiquement, taille, poids, genre, niveau d'activité, objectif)
- Section sécurité (changement de mot de passe)

**User stories couvertes :**
- En tant qu'utilisateur, je veux mettre à jour mon profil santé pour que le Coach IA et les calculs (IMC, TDEE) soient précis

---

## Contexte de conception

Les maquettes ont été réalisées en amont du développement pour cadrer les besoins utilisateurs et valider l'architecture visuelle avant de coder. Certains ajustements ont été faits en cours de développement :

- Le branding "HealthIA" des wireframes a évolué vers "Santé & Fit" lors du développement, suite à une décision d'équipe pour mieux refléter le positionnement du produit final.
- La couleur primaire a été affinée de teal (#14b8a6) vers emerald (#10b981) pour une meilleure lisibilité.
- Les KPIs du Dashboard ont été réorganisés de 2×2 (maquette) vers 1×4 (implémentation) pour une meilleure exploitation de l'espace sur grand écran.

Le projet cible deux types d'utilisateurs :
- **Utilisateur standard** : consulte son tableau de bord santé, enregistre ses séances sportives, interagit avec le Coach IA
- **Administrateur** : gère les recommandations nutritionnelles et les données patients

---

## Correspondance maquette → implémentation

| Écran maquetté | Route implémentée | Wireframe | Maquette HF | Statut |
|---|---|---|---|---|
| Connexion | `/login` | ✅ | ✅ | ✅ Implémenté |
| Inscription | `/register` | ✅ | ✅ | ✅ Implémenté (avec date de naissance) |
| Vue d'ensemble | `/` | ✅ | ✅ | ✅ Implémenté |
| Activités sportives | `/sport` | ✅ | ✅ | ✅ Implémenté (enregistrement séances + stats) |
| Nutrition | `/nutrition` | ✅ | ✅ | ✅ Implémenté |
| Coach IA | `/coach-ia` | ✅ | ✅ | ✅ Implémenté (Mistral AI + historique + contexte séances) |
| Communauté | `/community` | ✅ | ✅ | ✅ Implémenté |
| Profil & Santé | `/profile` | ✅ | ✅ | ✅ Implémenté (date naissance → âge calculé, IMC, TDEE) |

---

## Choix de design

| Décision | Justification |
|---|---|
| Sidebar fixe à gauche | Navigation permanente pour accès rapide entre modules |
| Thème sombre (slate-800) | Réduction de la fatigue visuelle pour usage prolongé |
| Couleur emerald pour les actions | Identité "santé/nature", différenciation claire des éléments interactifs |
| Cards KPI en haut de page | Les métriques clés sont visibles sans scroll |
| Modal pour l'ajout de séances | Ne quitte pas la page courante, expérience fluide |
| Date de naissance plutôt qu'âge | Calcul automatique côté serveur, évite les données obsolètes |
