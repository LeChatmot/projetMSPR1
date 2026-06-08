ALTER TABLE diet_recommendations 
DROP FOREIGN KEY diet_recommendations_ibfk_6;

ALTER TABLE dietary_restrictions 
RENAME COLUMN id TO id_dietary_restrictions;

ALTER TABLE diet_recommendations 
ADD CONSTRAINT fk_diet_recommendations_dietary_restriction
FOREIGN KEY (dietary_restrictions) REFERENCES dietary_restrictions(id_dietary_restrictions);