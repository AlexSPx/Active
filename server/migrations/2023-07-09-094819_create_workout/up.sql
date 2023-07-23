-- Your SQL goes here
CREATE TABLE workout_records (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE workouts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    created_by UUID REFERENCES users(id),
    updated_at TIMESTAMP DEFAULT NOW() NOT NULL,
    structure_record_id INT UNIQUE REFERENCES workout_records(id)
);

CREATE TABLE exercise_records (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    workout_record_id INT REFERENCES workout_records(id) ON DELETE CASCADE NOT NULL,
    exercise_id INT REFERENCES exercises(id) NOT NULL,
    reps SMALLINT[] NOT NULL,
    weight REAL[] NOT NULL
);

-- Remove workout_id column from workout_records table
ALTER TABLE workout_records
DROP COLUMN IF EXISTS workout_id;

-- Add workout_id column back to workout_records table
ALTER TABLE workout_records
ADD COLUMN workout_id UUID REFERENCES workouts(id) ON DELETE CASCADE;
