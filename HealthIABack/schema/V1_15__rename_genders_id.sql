ALTER TABLE diet_recommendations 
DROP FOREIGN KEY diet_recommendations_ibfk_1;

ALTER TABLE exercice_sessions 
DROP FOREIGN KEY exercice_sessions_ibfk_1;

ALTER TABLE genders 
RENAME COLUMN id TO id_genders;

ALTER TABLE diet_recommendations 
ADD CONSTRAINT fk_diet_recommendations_gender 
FOREIGN KEY (gender) REFERENCES genders(id_genders);

ALTER TABLE exercice_sessions 
ADD CONSTRAINT fk_exercice_sessions_gender 
FOREIGN KEY (gender) REFERENCES genders(id_genders);