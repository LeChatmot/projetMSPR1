CREATE TABLE IF NOT EXISTS ref_food_item (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100),
    category VARCHAR(50),
    calories_kcal INT,
    protein_g FLOAT,
    carbs_g FLOAT,
    fat_g FLOAT
)