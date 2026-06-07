CREATE TABLE IF NOT EXISTS exercice_sessions_utilisateurs (
    id_exercice_sessions_utilisateurs INT AUTO_INCREMENT PRIMARY KEY,
    id_exercice_sessions INT NOT NULL,
    id_utilisateurs INT NOT NULL,
    FOREIGN KEY (id_exercice_sessions) REFERENCES exercice_sessions(id_exercice_sessions),
    FOREIGN KEY (id_utilisateurs) REFERENCES utilisateurs(id_utilisateurs)
)