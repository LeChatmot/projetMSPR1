ALTER TABLE daily_foods 
DROP FOREIGN KEY daily_foods_ibfk_1;

ALTER TABLE daily_food_categories 
RENAME COLUMN id TO id_daily_foods_categories;

ALTER TABLE daily_foods 
ADD CONSTRAINT fk_daily_foods_category
FOREIGN KEY (category) REFERENCES daily_food_categories(id_daily_foods_categories);