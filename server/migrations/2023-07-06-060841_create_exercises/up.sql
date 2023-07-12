CREATE TABLE exercises (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    type VARCHAR(50) CHECK (type IN ('strength', 'plyometrics', 'cardio', 'stretching', 'powerlifting', 'strongman', 'olympic weightlifting')),
    body_part VARCHAR(50) CHECK (body_part IN ('abdominals', 'adductors', 'abductors', 'biceps', 'calves', 'chest', 'forearms', 'glutes', 'hamstrings', 'lats', 'lower back', 'middle back', 'traps', 'neck', 'quadriceps', 'shoulders', 'triceps')),
    equipment VARCHAR(50) CHECK (equipment IN ('bands', 'barbell', 'kettlebells', 'dumbbell', 'other', 'cable', 'machine', 'body only', 'medicine ball', 'exercise ball', 'foam roll', 'ez curl bar', 'none')),
    level VARCHAR(50) CHECK (level IN ('intermediate', 'beginner', 'expert'))
);
