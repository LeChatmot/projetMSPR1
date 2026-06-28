CREATE TABLE IF NOT EXISTS practice (
    id_pratiques   CHAR(36)    NOT NULL,
    id_utilisateur INT         NULL,
    id_exercice    INT         NULL,
    practiced_at   DATE        NULL,
    PRIMARY KEY (id_pratiques),
    CONSTRAINT fk_practice_utilisateur
        FOREIGN KEY (id_utilisateur) REFERENCES utilisateurs(id_utilisateurs),
    CONSTRAINT fk_practice_exercice
        FOREIGN KEY (id_exercice) REFERENCES exercice_sessions(id_exercice_sessions)
);