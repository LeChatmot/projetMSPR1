CREATE TABLE IF NOT EXISTS utilisateurs_blessures (
    id_utilisateurs_blessures INT AUTO_INCREMENT PRIMARY KEY,
    id_utilisateurs           INT          NOT NULL,
    zone                      VARCHAR(100) NOT NULL COMMENT 'Ex: Genou gauche, Épaule droite',
    description               TEXT         NULL,
    created_at                DATETIME     DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_ub_utilisateur FOREIGN KEY (id_utilisateurs) REFERENCES utilisateurs(id_utilisateurs)
);
