"""
Repository pour gérer les messages du chat avec images dans MongoDB.
"""
from datetime import datetime, timezone
from pymongo import MongoClient
from bson import ObjectId
import os

class ChatMessagesRepository:
    """Gère la persistance des messages du chat (avec ou sans images) dans MongoDB."""
    
    def __init__(self):
        """Initialise la connexion à MongoDB."""
        mongo_host = os.getenv("MONGO_HOST", "mongodb")
        mongo_user = os.getenv("MONGO_USER", "healthia")
        mongo_password = os.getenv("MONGO_PASSWORD", "healthia123")
        mongo_port = os.getenv("MONGO_PORT", 27017)
        
        try:
            self.client = MongoClient(
                f"mongodb://{mongo_user}:{mongo_password}@{mongo_host}:{mongo_port}/",
                serverSelectionTimeoutMS=5000
            )
            # Test de connexion
            self.client.admin.command('ping')
            self.db = self.client["healthia_db"]
            self.collection = self.db["chat_messages"]
            
            # Créer des index pour les performances
            self.collection.create_index("user_id")
            self.collection.create_index("created_at")
            self.collection.create_index([("user_id", 1), ("created_at", -1)])
            
            print("✅ Connexion MongoDB établie pour ChatMessagesRepository")
        except Exception as e:
            print(f"⚠️ Erreur connexion MongoDB : {e}")
            self.client = None
            self.collection = None
    
    def save_message_with_image(self, user_id: int, message_type: str, content: str, 
                                image_metadata: dict = None, analysis: dict = None, 
                                recommendations: dict = None, mistral_reply: str = None):
        """
        Sauvegarde un message utilisateur avec ses images et analyses associées.
        
        Args:
            user_id (int): ID de l'utilisateur
            message_type (str): "user" ou "assistant"
            content (str): Contenu du message texte
            image_metadata (dict): Infos sur l'image (filename, size, upload_path, etc.)
            analysis (dict): Résultat de l'analyse IA du repas
            recommendations (dict): Recommandations ML
            mistral_reply (str): Réponse Mistral
        
        Returns:
            dict: Le document créé ou None si erreur
        """
        if not self.collection:
            print("⚠️ MongoDB non disponible")
            return None
        
        try:
            document = {
                "user_id": user_id,
                "message_type": message_type,
                "content": content,
                "created_at": datetime.now(timezone.utc).isoformat(),
                "image": image_metadata,  # None si pas d'image
                "analysis": analysis,      # Analyse IA du repas
                "recommendations": recommendations,  # Top 5 exercices recommandés
                "mistral_reply": mistral_reply,  # Réponse du coach
            }
            
            result = self.collection.insert_one(document)
            document["_id"] = str(result.inserted_id)
            return document
        except Exception as e:
            print(f"❌ Erreur lors de la sauvegarde du message : {e}")
            return None
    
    def get_chat_history(self, user_id: int, limit: int = 50):
        """Récupère l'historique du chat d'un utilisateur."""
        if not self.collection:
            return []
        
        try:
            messages = list(self.collection
                .find({"user_id": user_id})
                .sort("created_at", -1)
                .limit(limit))
            
            # Convertir les ObjectId en string
            for msg in messages:
                msg["_id"] = str(msg["_id"])
            
            return list(reversed(messages))  # Ordre chronologique
        except Exception as e:
            print(f"❌ Erreur lors de la récupération de l'historique : {e}")
            return []
    
    def get_messages_with_images(self, user_id: int):
        """Récupère uniquement les messages avec images."""
        if not self.collection:
            return []
        
        try:
            messages = list(self.collection
                .find({
                    "user_id": user_id,
                    "image": {"$exists": True, "$ne": None}
                })
                .sort("created_at", -1))
            
            for msg in messages:
                msg["_id"] = str(msg["_id"])
            
            return messages
        except Exception as e:
            print(f"❌ Erreur lors de la récupération des messages avec images : {e}")
            return []
    
    def update_message_with_analysis(self, message_id: str, analysis: dict, 
                                     recommendations: dict = None, mistral_reply: str = None):
        """Met à jour un message existant avec les résultats des analyses."""
        if not self.collection:
            return False
        
        try:
            update_data = {
                "analysis": analysis,
                "updated_at": datetime.now(timezone.utc).isoformat(),
            }
            
            if recommendations:
                update_data["recommendations"] = recommendations
            if mistral_reply:
                update_data["mistral_reply"] = mistral_reply
            
            result = self.collection.update_one(
                {"_id": ObjectId(message_id)},
                {"$set": update_data}
            )
            
            return result.modified_count > 0
        except Exception as e:
            print(f"❌ Erreur lors de la mise à jour : {e}")
            return False
    
    def delete_message(self, message_id: str):
        """Supprime un message (et l'image associée si nécessaire)."""
        if not self.collection:
            return False
        
        try:
            result = self.collection.delete_one({"_id": ObjectId(message_id)})
            return result.deleted_count > 0
        except Exception as e:
            print(f"❌ Erreur lors de la suppression : {e}")
            return False
    
    def clear_history(self, user_id: int):
        """Supprime tout l'historique d'un utilisateur."""
        if not self.collection:
            return False
        
        try:
            result = self.collection.delete_many({"user_id": user_id})
            return result.deleted_count > 0
        except Exception as e:
            print(f"❌ Erreur lors du nettoyage : {e}")
            return False
    
    def close(self):
        """Ferme la connexion MongoDB."""
        if self.client:
            self.client.close()
