-- Your SQL goes here
CREATE TABLE workouts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    created_by UUID REFERENCES users(id),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE workout_records (
    id SERIAL PRIMARY KEY,
    workout_id UUID REFERENCES workouts(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE exercise_records (
    id SERIAL PRIMARY KEY,
    workout_record_id INT REFERENCES workout_records(id) ON DELETE CASCADE,
    exercise_id INT REFERENCES exercises(id),
    reps SMALLINT[],
    weight REAL[]
);

