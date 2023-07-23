-- Drop foreign key constraint on workout_records table
ALTER TABLE workout_records
DROP CONSTRAINT IF EXISTS workout_records_workout_id_fkey;

-- Drop tables in reverse order to resolve foreign key dependencies
DROP TABLE IF EXISTS exercise_records;
DROP TABLE IF EXISTS workouts;
DROP TABLE IF EXISTS workout_records;
