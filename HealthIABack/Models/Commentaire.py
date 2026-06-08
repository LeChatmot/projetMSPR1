class Commentaire:
    def __init__(self):
        self.id = None
        self.contenu = None
        self.created_at = None
        self.updated_at = None
        self.id_commentaires_parent = None
        self.id_publications = None
        self.id_utilisateurs = None
        # Champs joints (remplis par les requêtes JOIN)
        self.auteur_pseudo = None
