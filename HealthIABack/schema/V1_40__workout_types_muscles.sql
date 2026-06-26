ALTER TABLE workout_types
    ADD COLUMN muscles_sollicites VARCHAR(255) NULL COMMENT 'Ex: Jambes, Fessiers, Cardio',
    ADD COLUMN description        TEXT         NULL;

UPDATE workout_types SET muscles_sollicites = 'Jambes, Fessiers, Cardio'      WHERE name = 'Cardio';
UPDATE workout_types SET muscles_sollicites = 'Épaules, Dos, Bras, Pectoraux' WHERE name = 'Strength';
UPDATE workout_types SET muscles_sollicites = 'Corps entier, Cardio'           WHERE name = 'HIIT';
UPDATE workout_types SET muscles_sollicites = 'Souplesse, Dos, Abdominaux'     WHERE name = 'Yoga';
