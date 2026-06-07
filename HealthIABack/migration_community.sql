-- ============================================================
-- Migration : authentification + forum communautaire
-- À appliquer sur health_ia_db (base de production)
-- ============================================================

-- Table utilisateurs
-- Note : mot_de_passe en varchar(255) pour accueillir un hash bcrypt (60+ chars) pour plus tard 

CREATE TABLE IF NOT EXISTS `utilisateurs` (
  `id_utilisateurs` int(11) NOT NULL AUTO_INCREMENT,
  `nom`             varchar(50)  NOT NULL,
  `prenom`          varchar(50)  NOT NULL,
  `pseudo`          varchar(50)  NOT NULL,
  `email`           varchar(100) NOT NULL,
  `mot_de_passe`    varchar(255) NOT NULL,
  `role`            varchar(20)  NOT NULL DEFAULT 'user',
  `created_at`      datetime     DEFAULT current_timestamp(),
  PRIMARY KEY (`id_utilisateurs`),
  UNIQUE KEY `email`  (`email`),
  UNIQUE KEY `pseudo` (`pseudo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Table publications (fils de discussion du forum)
CREATE TABLE IF NOT EXISTS `publications` (
  `id_publications`  int(11)      NOT NULL AUTO_INCREMENT,
  `libelle`          varchar(100) DEFAULT NULL,
  `contenu`          text         NOT NULL,
  `created_at`       datetime     DEFAULT current_timestamp(),
  `updated_at`       datetime     DEFAULT NULL ON UPDATE current_timestamp(),
  `id_utilisateurs`  int(11)      NOT NULL,
  PRIMARY KEY (`id_publications`),
  KEY `id_utilisateurs` (`id_utilisateurs`),
  CONSTRAINT `fk_pub_user` FOREIGN KEY (`id_utilisateurs`)
    REFERENCES `utilisateurs` (`id_utilisateurs`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Table commentaires (réponses, avec support de l'imbrication via parent)
CREATE TABLE IF NOT EXISTS `commentaires` (
  `id_commentaires`        int(11)      NOT NULL AUTO_INCREMENT,
  `contenu`                varchar(500) NOT NULL,
  `created_at`             datetime     DEFAULT current_timestamp(),
  `updated_at`             datetime     DEFAULT NULL ON UPDATE current_timestamp(),
  `id_commentaires_parent` int(11)      DEFAULT NULL,
  `id_publications`        int(11)      NOT NULL,
  `id_utilisateurs`        int(11)      NOT NULL,
  PRIMARY KEY (`id_commentaires`),
  KEY `id_commentaires_parent` (`id_commentaires_parent`),
  KEY `id_publications`        (`id_publications`),
  KEY `id_utilisateurs`        (`id_utilisateurs`),
  CONSTRAINT `fk_com_parent` FOREIGN KEY (`id_commentaires_parent`)
    REFERENCES `commentaires` (`id_commentaires`) ON DELETE SET NULL,
  CONSTRAINT `fk_com_pub`  FOREIGN KEY (`id_publications`)
    REFERENCES `publications` (`id_publications`) ON DELETE CASCADE,
  CONSTRAINT `fk_com_user` FOREIGN KEY (`id_utilisateurs`)
    REFERENCES `utilisateurs` (`id_utilisateurs`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Table de liaison utilisateur <-> session sport (isolation des données)
CREATE TABLE IF NOT EXISTS `utilisateur_exercice_session` (
  `id_exercice_sessions` int(11) NOT NULL,
  `id_utilisateurs`      int(11) NOT NULL,
  PRIMARY KEY (`id_exercice_sessions`, `id_utilisateurs`),
  KEY `id_utilisateurs` (`id_utilisateurs`),
  CONSTRAINT `fk_ues_session` FOREIGN KEY (`id_exercice_sessions`)
    REFERENCES `exercice_sessions` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_ues_user` FOREIGN KEY (`id_utilisateurs`)
    REFERENCES `utilisateurs` (`id_utilisateurs`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Table de liaison utilisateur <-> recommandation diet (isolation des données)
CREATE TABLE IF NOT EXISTS `utilisateur_diet_recommandation` (
  `id_diet_recommandations` int(11) NOT NULL,
  `id_utilisateurs`         int(11) NOT NULL,
  PRIMARY KEY (`id_diet_recommandations`, `id_utilisateurs`),
  KEY `id_utilisateurs` (`id_utilisateurs`),
  CONSTRAINT `fk_udr_diet` FOREIGN KEY (`id_diet_recommandations`)
    REFERENCES `diet_recommendations` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_udr_user` FOREIGN KEY (`id_utilisateurs`)
    REFERENCES `utilisateurs` (`id_utilisateurs`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
