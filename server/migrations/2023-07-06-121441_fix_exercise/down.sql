-- Drop the renamed column and re-add the original column
ALTER TABLE exercises DROP COLUMN exercise_type;
ALTER TABLE exercises ADD COLUMN type VARCHAR(50);

-- Rename the original column back to "type"
ALTER TABLE exercises RENAME COLUMN type TO exercise_type;
