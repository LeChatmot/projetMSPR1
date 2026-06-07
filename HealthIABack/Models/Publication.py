class Publication:
    def __init__(self):
        self.id = None
        self.libelle = None
        self.contenu = None
        self.created_at = None
        self.updated_at = None
        self.id_utilisateurs = None
        # Champs joints (non stockés, remplis par les requêtes JOIN)
        self.auteur_pseudo = None
        self.auteur_nom = None
        self.auteur_prenom = None
        self.nb_commentaires = 0
