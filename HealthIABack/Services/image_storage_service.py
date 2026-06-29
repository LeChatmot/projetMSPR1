"""
Service pour gérer le stockage des images uploads par les utilisateurs.
"""
import os
import uuid
from datetime import datetime
from werkzeug.utils import secure_filename
import hashlib

class ImageStorageService:
    """Gère le stockage et la manipulation des images."""
    
    # Extensions autorisées
    ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'webp'}
    MAX_FILE_SIZE = 5 * 1024 * 1024  # 5 MB
    UPLOAD_DIR = os.getenv("UPLOAD_DIR", "/tmp/health_ia_uploads")
    
    def __init__(self):
        """Initialise le service de stockage."""
        # Créer le répertoire s'il n'existe pas
        os.makedirs(self.UPLOAD_DIR, exist_ok=True)
        print(f"✅ Service de stockage d'images initialisé : {self.UPLOAD_DIR}")
    
    @staticmethod
    def allowed_file(filename: str) -> bool:
        """Vérifie si le fichier est autorisé."""
        return '.' in filename and filename.rsplit('.', 1)[1].lower() in ImageStorageService.ALLOWED_EXTENSIONS
    
    def save_image(self, file) -> dict:
        """
        Sauvegarde une image uploadée et retourne ses métadonnées.
        
        Args:
            file: FileStorage object from Flask request
        
        Returns:
            dict: Métadonnées de l'image (path, filename, size, hash, etc.)
        """
        if not file or file.filename == '':
            raise ValueError("Aucun fichier fourni")
        
        if not self.allowed_file(file.filename):
            raise ValueError(f"Format de fichier non autorisé. Acceptés: {', '.join(self.ALLOWED_EXTENSIONS)}")
        
        # Vérifier la taille
        file.seek(0, os.SEEK_END)
        file_size = file.tell()
        file.seek(0)
        
        if file_size > self.MAX_FILE_SIZE:
            raise ValueError(f"Fichier trop volumineux. Max: {self.MAX_FILE_SIZE / (1024*1024):.1f} MB")
        
        try:
            # Générer un nom unique
            file_extension = file.filename.rsplit('.', 1)[1].lower()
            unique_filename = f"{uuid.uuid4()}.{file_extension}"
            
            # Lire le contenu et calculer le hash
            file_content = file.read()
            file_hash = hashlib.md5(file_content).hexdigest()
            file.seek(0)
            
            # Sauvegarder le fichier
            file_path = os.path.join(self.UPLOAD_DIR, unique_filename)
            file.save(file_path)
            
            # Retourner les métadonnées
            return {
                "filename": file.filename,
                "unique_filename": unique_filename,
                "upload_path": file_path,
                "relative_path": f"uploads/{unique_filename}",
                "size": file_size,
                "hash": file_hash,
                "content_type": file.content_type,
                "uploaded_at": datetime.utcnow().isoformat(),
            }
        except Exception as e:
            raise Exception(f"Erreur lors de la sauvegarde : {str(e)}")
    
    def delete_image(self, unique_filename: str) -> bool:
        """Supprime une image."""
        try:
            file_path = os.path.join(self.UPLOAD_DIR, unique_filename)
            if os.path.exists(file_path):
                os.remove(file_path)
                return True
            return False
        except Exception as e:
            print(f"❌ Erreur lors de la suppression : {e}")
            return False
    
    def get_image_path(self, unique_filename: str) -> str:
        """Retourne le chemin complet du fichier."""
        return os.path.join(self.UPLOAD_DIR, unique_filename)
    
    def image_exists(self, unique_filename: str) -> bool:
        """Vérifie si une image existe."""
        return os.path.exists(os.path.join(self.UPLOAD_DIR, unique_filename))
