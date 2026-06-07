CREATE TABLE IF NOT EXISTS publications (
    id_publications INT AUTO_INCREMENT PRIMARY KEY,
    libelle VARCHAR(100) NOT NULL,
    contenu VARCHAR(255) NOT NULL,
    created_at Datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at Datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    id_utilisateurs INT NOT NULL,
    FOREIGN KEY (id_utilisateurs) REFERENCES utilisateurs(id_utilisateurs)
)