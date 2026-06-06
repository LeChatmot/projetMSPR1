ALTER TABLE diet_recommendations 
DROP FOREIGN KEY diet_recommendations_ibfk_8;

ALTER TABLE preferred_cuisine_types 
RENAME COLUMN id TO id_preferred_cuisine_types;

ALTER TABLE diet_recommendations 
ADD CONSTRAINT fk_diet_recommendations_preferred_cuisine_type
FOREIGN KEY (preferred_cuisine) REFERENCES preferred_cuisine_types(id_preferred_cuisine_types);