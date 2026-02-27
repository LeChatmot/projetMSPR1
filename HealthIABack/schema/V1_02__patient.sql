CREATE TABLE IF NOT EXISTS patient (
    id INT PRIMARY KEY AUTO_INCREMENT,
    age INT,
    gender VARCHAR(10),
    height_cm SMALLINT,
    current_weight_kg FLOAT,
    disease_type VARCHAR(50),
    diet_recommendation VARCHAR(50),
    daily_caloric_target INT
)