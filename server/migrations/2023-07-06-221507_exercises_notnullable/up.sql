-- Your SQL goes here
ALTER TABLE exercises
ALTER COLUMN exercise_type SET NOT NULL;

ALTER TABLE exercises
ALTER COLUMN body_part SET NOT NULL;

ALTER TABLE exercises
ALTER COLUMN equipment SET NOT NULL;

ALTER TABLE exercises
ALTER COLUMN level SET NOT NULL;
