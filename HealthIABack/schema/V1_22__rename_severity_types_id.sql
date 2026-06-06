ALTER TABLE diet_recommendations 
DROP FOREIGN KEY diet_recommendations_ibfk_3;

ALTER TABLE severity_types 
RENAME COLUMN id TO id_severity_types;

ALTER TABLE diet_recommendations 
ADD CONSTRAINT fk_diet_recommendations_severity_type
FOREIGN KEY (severity) REFERENCES severity_types(id_severity_types);