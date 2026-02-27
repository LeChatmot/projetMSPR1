CREATE TABLE IF NOT EXISTS nutrition_log (
    id INT PRIMARY KEY AUTO_INCREMENT,
    patient_id INT,
    food_id INT,
    meal_type VARCHAR(20),
    date_consumed DATETIME,
    FOREIGN KEY (patient_id) REFERENCES patient(id),
    FOREIGN KEY (food_id) REFERENCES ref_food_item(id)
)