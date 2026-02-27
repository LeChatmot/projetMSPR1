CREATE TABLE IF NOT EXISTS workout_session (
    id INT PRIMARY KEY AUTO_INCREMENT,
    patient_id INT,
    workout_type_id INT,
    duration_min SMALLINT,
    calories_burned SMALLINT,
    avg_bpm SMALLINT,
    max_bpm SMALLINT,
    water_intake_liters FLOAT,
    FOREIGN KEY (patient_id) REFERENCES patient(id),
    FOREIGN KEY (workout_type_id) REFERENCES ref_workout_type(id)
)