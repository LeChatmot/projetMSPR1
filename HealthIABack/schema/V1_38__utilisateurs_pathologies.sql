CREATE TABLE IF NOT EXISTS utilisateurs_pathologies (
    id_utilisateurs_pathologies INT AUTO_INCREMENT PRIMARY KEY,
    id_utilisateurs             INT NOT NULL,
    id_disease_types            INT NOT NULL,
    CONSTRAINT fk_up_utilisateur FOREIGN KEY (id_utilisateurs) REFERENCES utilisateurs(id_utilisateurs),
    CONSTRAINT fk_up_pathologie  FOREIGN KEY (id_disease_types) REFERENCES disease_types(id_disease_types),
    CONSTRAINT uq_up_pair        UNIQUE (id_utilisateurs, id_disease_types)
);
