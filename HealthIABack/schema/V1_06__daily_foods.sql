CREATE TABLE IF NOT EXISTS daily_foods (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150),
    category INT,
    calories_kcal SMALLINT,
    protein_g FLOAT,
    carbs_g FLOAT,
    fat_g FLOAT,
    fiber_g FLOAT,
    sugar_g FLOAT,
    sodium SMALLINT,
    cholesterol SMALLINT,
    meal_type INT,
    water_intake_ml smallint,
    FOREIGN KEY (category) REFERENCES daily_food_categories(id),
    FOREIGN KEY (meal_type) REFERENCES meal_types(id)
)