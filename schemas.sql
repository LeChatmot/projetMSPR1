-- 1. Création de la base de données (si elle n'existe pas)
CREATE DATABASE IF NOT EXISTS mspr_health_db
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE mspr_health_db;

-- =======================================================
-- MODULE 1 : UTILISATEURS (Source: diet_recommendations.csv)
-- =======================================================

-- Table principale des patients
CREATE TABLE IF NOT EXISTS patient (
    patient_id VARCHAR(20) PRIMARY KEY, -- Correspond à 'P0001' du CSV
    age INT NOT NULL,
    gender VARCHAR(10),
    height_cm INT,
    current_weight_kg FLOAT,
    bmi FLOAT, -- Calculé ou importé
    disease_type VARCHAR(100), -- Ex: 'Hypertension', 'None'
    diet_recommendation VARCHAR(50), -- Ex: 'Low_Carb'
    daily_caloric_target INT,
    activity_level_label VARCHAR(50), -- Ex: 'Sedentary', 'Active'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;


-- =======================================================
-- MODULE 2 : SPORT (Source: gym_members + synthetic.csv)
-- =======================================================

-- Référentiel des types de sport (pour éviter la répétition de texte)
CREATE TABLE IF NOT EXISTS ref_workout_type (
    workout_type_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL -- Ex: 'Yoga', 'HIIT', 'Cardio'
) ENGINE=InnoDB;

-- Table des séances d'entraînement
CREATE TABLE IF NOT EXISTS workout_session (
    session_id INT AUTO_INCREMENT PRIMARY KEY,
    patient_id VARCHAR(20) NOT NULL,
    workout_type_id INT NOT NULL,
    
    -- Métriques de la séance
    duration_minutes INT, -- Convertir les heures du CSV en minutes ici
    calories_burned INT,
    avg_bpm INT,
    max_bpm INT,
    water_intake_liters FLOAT, -- Harmonisé en Litres
    fat_percentage FLOAT, -- Snapshot de la graisse au moment du sport
    
    session_date DATETIME DEFAULT CURRENT_TIMESTAMP, -- Date simulée par Python
    
    -- Clés étrangères
    CONSTRAINT fk_workout_patient 
        FOREIGN KEY (patient_id) REFERENCES patient(patient_id)
        ON DELETE CASCADE,
    CONSTRAINT fk_workout_type 
        FOREIGN KEY (workout_type_id) REFERENCES ref_workout_type(workout_type_id)
) ENGINE=InnoDB;


-- =======================================================
-- MODULE 3 : NUTRITION (Source: daily_food_nutrition.csv)
-- =======================================================

-- Référentiel des aliments (Catalogue)
CREATE TABLE IF NOT EXISTS ref_food_item (
    food_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL, -- Ex: 'Scrambled Eggs'
    category VARCHAR(100), -- Ex: 'Protein/Dairy'
    
    -- Valeurs nutritionnelles pour une portion standard
    calories_kcal INT,
    protein_g FLOAT,
    carbs_g FLOAT,
    fat_g FLOAT,
    fiber_g FLOAT,
    sugars_g FLOAT
) ENGINE=InnoDB;

-- Journal des repas consommés
CREATE TABLE IF NOT EXISTS nutrition_log (
    log_id INT AUTO_INCREMENT PRIMARY KEY,
    patient_id VARCHAR(20) NOT NULL,
    food_id INT NOT NULL,
    
    meal_type VARCHAR(50), -- Ex: 'Breakfast', 'Lunch' (Nettoyé en minuscule par Python)
    quantity_consumed FLOAT DEFAULT 1.0, -- Nombre de portions
    date_consumed DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    -- Clés étrangères
    CONSTRAINT fk_nutrition_patient 
        FOREIGN KEY (patient_id) REFERENCES patient(patient_id)
        ON DELETE CASCADE,
    CONSTRAINT fk_nutrition_food 
        FOREIGN KEY (food_id) REFERENCES ref_food_item(food_id)
) ENGINE=InnoDB;


-- =======================================================
-- MODULE 4 : TECHNIQUE (Pour le rapport MSPR)
-- =======================================================

-- Table pour tracer les imports ETL (Bonus apprécié par le jury)
CREATE TABLE IF NOT EXISTS etl_job_log (
    job_id INT AUTO_INCREMENT PRIMARY KEY,
    job_name VARCHAR(50), -- Ex: 'IMPORT_PATIENTS'
    start_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20), -- 'SUCCESS', 'ERROR'
    rows_processed INT,
    error_message TEXT
) ENGINE=InnoDB;