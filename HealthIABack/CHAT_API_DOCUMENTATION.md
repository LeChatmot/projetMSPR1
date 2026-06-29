# Documentation API Chat avec Images

## Vue d'ensemble

Ce système permet aux utilisateurs de :
1. **Uploader des images** de leurs repas ou autre contexte santé
2. **Envoyer des messages** texte avec ou sans images
3. **Recevoir des analyses** automatiques (analyse du repas, recommandations d'exercice)
4. **Obtenir des conseils personnalisés** du coach IA Mistral
5. **Consulter l'historique** complet avec images et analyses

## Structure des données MongoDB

Chaque message est stocké dans la collection `chat_messages` avec la structure :

```json
{
  "_id": "ObjectId",
  "user_id": 123,
  "message_type": "user" | "assistant",
  "content": "Texte du message",
  "created_at": "2026-06-29T12:00:00Z",
  "updated_at": "2026-06-29T12:00:00Z",
  "image": {
    "unique_filename": "uuid.jpg",
    "upload_path": "/tmp/health_ia_uploads/uuid.jpg",
    "filename": "repas.jpg",
    "size": 2048576,
    "hash": "md5hash",
    "content_type": "image/jpeg",
    "uploaded_at": "2026-06-29T12:00:00Z"
  },
  "analysis": {
    "foods": ["riz", "poulet", "légumes"],
    "calories_estimate": 650,
    "nutrients": {...}
  },
  "recommendations": {
    "exercises": [
      {"name": "Cardio", "duration": 30, "intensity": "moderate"},
      {"name": "Strength", "duration": 20, "intensity": "high"}
    ]
  },
  "mistral_reply": "Conseil personnalisé du coach..."
}
```

## Endpoints API

### 1. Upload une image

**POST** `/api/chat/upload`

**Paramètres:**
- `file` (multipart/form-data): Fichier image (PNG, JPG, GIF, WebP, max 5MB)

**Réponse (201):**
```json
{
  "data": {
    "filename": "repas.jpg",
    "unique_filename": "550e8400-e29b-41d4-a716-446655440000.jpg",
    "upload_path": "/tmp/health_ia_uploads/550e8400-e29b-41d4-a716-446655440000.jpg",
    "relative_path": "uploads/550e8400-e29b-41d4-a716-446655440000.jpg",
    "size": 2048576,
    "hash": "5d41402abc4b2a76b9719d911017c592",
    "content_type": "image/jpeg",
    "uploaded_at": "2026-06-29T12:00:00Z"
  },
  "success": true,
  "message": ""
}
```

### 2. Envoyer un message avec analyse complète

**POST** `/api/chat/message`

**Paramètres (form-data):**
```
user_id: 123
message: "Bonjour, j'ai mangé ce repas ce matin, quels exercices me recommandez-vous?"
image_filename: "550e8400-e29b-41d4-a716-446655440000.jpg"  (optional)
objectif: "perte_de_poids"
weight: 75.5
height: 175
age: 30
experience_level: 2
```

**Flux de traitement:**
1. Sauvegarde du message utilisateur dans MongoDB
2. Analyse de l'image par le service IA (si présente)
3. Génération des recommandations d'exercice (ML model)
4. Appel au coach Mistral avec contexte complet
5. Sauvegarde de la réponse

**Réponse (201):**
```json
{
  "data": {
    "user_message_id": "507f1f77bcf86cd799439011",
    "assistant_reply": "Bonjour! Basé sur votre repas et vos objectifs, je vous recommande...",
    "analysis": {
      "foods": ["riz", "poulet", "légumes"],
      "calories_estimate": 650,
      "nutrients": {...}
    },
    "recommendations": {
      "exercises": [
        {"name": "Cardio", "score": 0.85},
        {"name": "HIIT", "score": 0.78}
      ]
    }
  },
  "success": true
}
```

### 3. Récupérer l'historique du chat

**GET** `/api/chat/history/<user_id>`

**Paramètres:**
- `user_id` (path): ID de l'utilisateur

**Réponse (200):**
```json
{
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "user_id": 123,
      "message_type": "user",
      "content": "Message utilisateur...",
      "created_at": "2026-06-29T12:00:00Z",
      "image": {...},
      "analysis": {...}
    },
    {
      "_id": "507f1f77bcf86cd799439012",
      "user_id": 123,
      "message_type": "assistant",
      "content": "Réponse du coach...",
      "created_at": "2026-06-29T12:00:01Z",
      "recommendations": {...},
      "mistral_reply": "..."
    }
  ],
  "success": true
}
```

### 4. Récupérer seulement les messages avec images

**GET** `/api/chat/with-images/<user_id>`

**Réponse (200):** Même format que l'historique, mais uniquement les messages ayant une image

### 5. Supprimer un message

**DELETE** `/api/chat/message/<message_id>?user_id=123`

**Réponse (200):**
```json
{
  "data": {"id": "507f1f77bcf86cd799439011"},
  "success": true,
  "message": "Message supprimé"
}
```

### 6. Supprimer tout l'historique

**DELETE** `/api/chat/history/<user_id>`

**Réponse (200):**
```json
{
  "data": {},
  "success": true,
  "message": "Historique supprimé"
}
```

## Flux complet (exemple frontend)

```javascript
// 1. Upload l'image
const formData = new FormData();
formData.append('file', imageFile);
const uploadRes = await fetch('/api/chat/upload', {
  method: 'POST',
  body: formData
});
const {data: imageData} = await uploadRes.json();
const imageFilename = imageData.unique_filename;

// 2. Envoie le message avec l'image
const messageFormData = new FormData();
messageFormData.append('user_id', userId);
messageFormData.append('message', userMessage);
messageFormData.append('image_filename', imageFilename);
messageFormData.append('objectif', 'perte_de_poids');
messageFormData.append('weight', userWeight);
messageFormData.append('height', userHeight);
messageFormData.append('age', userAge);
messageFormData.append('experience_level', userLevel);

const chatRes = await fetch('/api/chat/message', {
  method: 'POST',
  body: messageFormData
});
const {data: chatData} = await chatRes.json();

// 3. Afficher la réponse
console.log('Réponse du coach:', chatData.assistant_reply);
console.log('Analyse du repas:', chatData.analysis);
console.log('Recommandations:', chatData.recommendations);

// 4. Récupérer l'historique
const historyRes = await fetch(`/api/chat/history/${userId}`);
const {data: history} = await historyRes.json();
```

## Configuration d'environnement

Ajouter au `.env` :

```bash
# MongoDB
MONGO_HOST=mongodb
MONGO_USER=healthia
MONGO_PASSWORD=healthia123
MONGO_PORT=27017

# Stockage des images
UPLOAD_DIR=/tmp/health_ia_uploads

# Services IA
IA_SERVICE_URL=http://ia_service:8001
MISTRAL_API_KEY=votre_clé_api
MISTRAL_MODEL=mistral-small-latest
```

## Gestion d'erreurs

### Erreur 400 - Requête invalide
```json
{
  "data": {},
  "success": false,
  "message": "user_id requis"
}
```

### Erreur 404 - Utilisateur introuvable
```json
{
  "data": {},
  "success": false,
  "message": "Utilisateur introuvable"
}
```

### Erreur 500 - Erreur serveur
```json
{
  "data": {},
  "success": false,
  "message": "Description de l'erreur"
}
```

## Bonnes pratiques

1. **Validation côté client** : Vérifier que le fichier est bien une image avant upload
2. **Gestion d'erreurs** : Gérer les cas où l'analyse d'image ou Mistral ne répond pas
3. **Pagination** : Pour les historiques longs, implémenter la pagination
4. **Cache** : Les uploads d'image ne sont pas dédupliqués (à considérer)
5. **Sécurité** : Les noms de fichiers sont hashés pour éviter les chemins malveillants

## Performance

- Les images sont limitées à 5MB
- Les index MongoDB accélèrent les requêtes par user_id et date
- Les métadonnées sont complètes pour faciliter le tri et la recherche

## Prochaines étapes

1. Implémenter le streaming des réponses Mistral pour améliorer l'UX
2. Ajouter la compression d'images avant stockage
3. Implémenter le stockage en bucket S3 au lieu du disque local
4. Ajouter la recherche Full-Text dans MongoDB
5. Implémenter un système de notifications temps réel avec WebSockets
