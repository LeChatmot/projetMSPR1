-- Utilisateurs par défaut pour les tests et démonstrations.
-- Idempotent : le INSERT ... SELECT WHERE NOT EXISTS ne fait rien si l'email existe déjà.
-- Mots de passe hashés avec werkzeug scrypt (identiques à ceux produits par l'API /auth/register).
--   user@healthia.fr  → user123
--   admin@healthia.fr → admin123
-- id_gender et id_activity_level sont NULL car les tables de référence sont
-- alimentées par Airflow après les migrations, pas pendant.

INSERT INTO utilisateurs (nom, prenom, pseudo, email, mot_de_passe, role,
                          date_of_birth, height_cm, weight_kg,
                          id_gender, id_activity_level, experience_level, objectif)
SELECT 'Demo', 'Utilisateur', 'demo_user', 'user@healthia.fr',
       'scrypt:32768:8:1$SziFu1AYCs6KRKC2$aa84eb6da9456a362604f415824d229e10d0eec806c4baa0698a1e24f6cd01a4aa279a4ff92a3d038c7b783c37cc2ac212511fe0725cd1ea3b9ed9749b3d020e',
       'user', '1995-06-15', 175, 72.0, NULL, NULL, 2, 'maintien'
WHERE NOT EXISTS (SELECT 1 FROM utilisateurs WHERE email = 'user@healthia.fr');

INSERT INTO utilisateurs (nom, prenom, pseudo, email, mot_de_passe, role,
                          date_of_birth, height_cm, weight_kg,
                          id_gender, id_activity_level, experience_level, objectif)
SELECT 'Admin', 'HealthIA', 'admin_healthia', 'admin@healthia.fr',
       'scrypt:32768:8:1$l9lut3BGksJlrJV0$6eaa83b6e5cc66bff998f0c726e69b0fd4b7bf98b73c4907a5646b5a4546d20ca3aa2cfc3c0a41dd4159f7f9c2b75b57e407f258d4f1fe9f249b6530471eaa87',
       'admin', '1990-03-20', 180, 80.0, NULL, NULL, 3, 'prise_de_masse'
WHERE NOT EXISTS (SELECT 1 FROM utilisateurs WHERE email = 'admin@healthia.fr');
