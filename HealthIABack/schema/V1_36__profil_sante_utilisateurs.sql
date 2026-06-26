ALTER TABLE utilisateurs
    ADD COLUMN age               TINYINT UNSIGNED  NULL,
    ADD COLUMN height_cm         SMALLINT UNSIGNED NULL,
    ADD COLUMN weight_kg         DECIMAL(5,2)      NULL,
    ADD COLUMN id_gender         INT               NULL,
    ADD COLUMN id_activity_level INT               NULL,
    ADD COLUMN experience_level  TINYINT UNSIGNED  NULL COMMENT '1=Débutant 2=Intermédiaire 3=Avancé',
    ADD COLUMN objectif          VARCHAR(50)       NULL COMMENT 'perte_de_poids | prise_de_masse | maintien | endurance',
    ADD CONSTRAINT fk_utilisateurs_gender
        FOREIGN KEY (id_gender) REFERENCES genders(id_genders),
    ADD CONSTRAINT fk_utilisateurs_activity
        FOREIGN KEY (id_activity_level) REFERENCES physical_activity_levels(id_physical_activity_levels);
