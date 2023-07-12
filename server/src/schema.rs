// @generated automatically by Diesel CLI.

diesel::table! {
    exercise_records (id) {
        id -> Int4,
        workout_record_id -> Nullable<Int4>,
        exercise_id -> Nullable<Int4>,
        reps -> Nullable<Array<Nullable<Int2>>>,
        weight -> Nullable<Array<Nullable<Float4>>>,
    }
}

diesel::table! {
    exercises (id) {
        id -> Int4,
        #[max_length = 255]
        title -> Varchar,
        description -> Nullable<Text>,
        #[max_length = 50]
        exercise_type -> Varchar,
        #[max_length = 50]
        body_part -> Varchar,
        #[max_length = 50]
        equipment -> Varchar,
        #[max_length = 50]
        level -> Varchar,
    }
}

diesel::table! {
    users (id) {
        id -> Uuid,
        created_date -> Nullable<Date>,
        #[max_length = 255]
        username -> Varchar,
        #[max_length = 255]
        firstname -> Varchar,
        #[max_length = 255]
        lastname -> Varchar,
        password -> Text,
        email -> Text,
        isconfirmed -> Bool,
    }
}

diesel::table! {
    workout_records (id) {
        id -> Int4,
        workout_id -> Nullable<Uuid>,
        created_at -> Nullable<Timestamp>,
    }
}

diesel::table! {
    workouts (id) {
        id -> Uuid,
        created_by -> Nullable<Uuid>,
        updated_at -> Nullable<Timestamp>,
    }
}

diesel::joinable!(exercise_records -> exercises (exercise_id));
diesel::joinable!(exercise_records -> workout_records (workout_record_id));
diesel::joinable!(workout_records -> workouts (workout_id));
diesel::joinable!(workouts -> users (created_by));

diesel::allow_tables_to_appear_in_same_query!(
    exercise_records,
    exercises,
    users,
    workout_records,
    workouts,
);
