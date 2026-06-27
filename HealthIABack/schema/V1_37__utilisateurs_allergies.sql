CREATE TABLE IF NOT EXISTS utilisateurs_allergies (
    id_utilisateurs_allergies INT AUTO_INCREMENT PRIMARY KEY,
    id_utilisateurs           INT NOT NULL,
    id_allergies              INT NOT NULL,
    CONSTRAINT fk_ua_utilisateur FOREIGN KEY (id_utilisateurs) REFERENCES utilisateurs(id_utilisateurs),
    CONSTRAINT fk_ua_allergie    FOREIGN KEY (id_allergies)    REFERENCES allergies(id_allergies),
    CONSTRAINT uq_ua_pair        UNIQUE (id_utilisateurs, id_allergies)
);
