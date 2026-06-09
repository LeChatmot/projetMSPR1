ALTER TABLE diet_recommendations 
DROP FOREIGN KEY diet_recommendations_ibfk_5;

ALTER TABLE physical_activity_levels 
RENAME COLUMN id TO id_physical_activity_levels;

ALTER TABLE diet_recommendations 
ADD CONSTRAINT fk_diet_recommendations_physical_activity_level
FOREIGN KEY (activity_level) REFERENCES physical_activity_levels(id_physical_activity_levels);