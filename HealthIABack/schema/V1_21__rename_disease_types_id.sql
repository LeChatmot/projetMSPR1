ALTER TABLE diet_recommendations 
DROP FOREIGN KEY diet_recommendations_ibfk_2;

ALTER TABLE disease_types 
RENAME COLUMN id TO id_disease_types;

ALTER TABLE diet_recommendations 
ADD CONSTRAINT fk_diet_recommendations_disease_type
FOREIGN KEY (disease_type) REFERENCES disease_types(id_disease_types);