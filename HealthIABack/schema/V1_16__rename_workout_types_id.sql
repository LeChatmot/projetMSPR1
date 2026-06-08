ALTER TABLE exercice_sessions 
DROP FOREIGN KEY exercice_sessions_ibfk_2;

ALTER TABLE workout_types 
RENAME COLUMN id TO id_workout_types;

ALTER TABLE exercice_sessions 
ADD CONSTRAINT fk_exercice_sessions_workout_type
FOREIGN KEY (workout_type) REFERENCES workout_types(id_workout_types);