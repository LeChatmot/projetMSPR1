ALTER TABLE diet_recommendations 
DROP FOREIGN KEY diet_recommendations_ibfk_7;

ALTER TABLE allergies 
RENAME COLUMN id TO id_allergies;

ALTER TABLE diet_recommendations 
ADD CONSTRAINT fk_diet_recommendations_allergy
FOREIGN KEY (allergy) REFERENCES allergies(id_allergies);