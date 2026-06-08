ALTER TABLE daily_foods 
DROP FOREIGN KEY daily_foods_ibfk_2;

ALTER TABLE meal_types 
RENAME COLUMN id TO id_meal_types;

ALTER TABLE daily_foods 
ADD CONSTRAINT fk_daily_foods_meal_type 
FOREIGN KEY (meal_type) REFERENCES meal_types(id_meal_types);