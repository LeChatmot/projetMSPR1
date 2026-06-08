CREATE TABLE IF NOT EXISTS commentaires (
    id_commentaires INT AUTO_INCREMENT PRIMARY KEY,
    contenu VARCHAR(255) NOT NULL,
    created_at Datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at Datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    id_commentaires_parent INT NULL,
    id_publications INT NOT NULL,
    id_utilisateurs INT NOT NULL,
    FOREIGN KEY (id_commentaires_parent) REFERENCES commentaires(id_commentaires),
    FOREIGN KEY (id_publications) REFERENCES publications(id_publications),
    FOREIGN KEY (id_utilisateurs) REFERENCES utilisateurs(id_utilisateurs)
)