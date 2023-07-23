use chrono::NaiveDateTime;
use diesel::{Queryable, Insertable, Identifiable, Associations};
use serde::{Serialize, Deserialize};
use uuid::Uuid;

use crate::models::user_models::User;
use crate::schema::{workouts, exercise_records, workout_records};

#[derive(Queryable, Serialize, Debug, Identifiable, Default, Clone, PartialEq)]
#[diesel(table_name = workouts)]
pub struct Workout {
    pub id: Uuid,
    pub title: String,
    pub created_by: Option<Uuid>,
    pub updated_at: NaiveDateTime,
    pub structure_record_id: Option<i32>,
}

#[derive(Queryable, Serialize, Identifiable, Debug, PartialEq, Default, Clone)]
#[diesel(table_name = workout_records)]
pub struct WorkoutRecord {
    pub id: i32,
    pub created_at: Option<NaiveDateTime>,
    pub workout_id: Option<Uuid>,
}

#[derive(Queryable, Serialize, Debug, Identifiable, Associations, PartialEq, Clone, Default)]
#[diesel(belongs_to(WorkoutRecord))]
#[diesel(belongs_to(User))]
#[diesel(table_name = exercise_records)]
pub struct ExerciseRecord {
    pub id: i32,
    pub user_id: Option<Uuid>,
    pub workout_record_id: i32,
    pub exercise_id: i32,
    pub reps: Vec<Option<i16>>,
    pub weight: Vec<Option<f32>>,
}

#[derive(Serialize, Default, Clone)]
pub struct WorkoutWithRecords {
    pub workout: Workout,
    pub structure_record: WorkoutWithExercises
}

#[derive(Serialize, Default, Clone)]
pub struct WorkoutWithExercises {
    #[serde(flatten)]
    pub record: WorkoutRecord,
    pub exercises: Vec<ExerciseRecordWithTitle>
}
#[derive(Serialize, Default, Clone)]
pub struct ExerciseRecordWithTitle {
    pub title: String,
    #[serde(flatten)]
    pub record: ExerciseRecord
}

#[derive(Serialize, Deserialize, Debug, Insertable)]
#[diesel(table_name = exercise_records)]
pub struct ExerciseRecordRequest {
    pub exercise_id: i32,
    pub workout_record_id: Option<i32>,
    pub user_id: Option<Uuid>,
    pub reps: Vec<i16>,
    pub weight: Vec<f32>,
}

#[derive(Debug, Deserialize, Serialize)]
pub struct CreateWorkoutRequest {
    pub title: String,
    pub exercises: Vec<ExerciseRecordRequest>,
}

#[derive(Debug, Deserialize, Serialize)]
pub struct CreateWorkoutRecordRequest {
    pub workout_id: Uuid,
    pub exercises: Vec<ExerciseRecordRequest>,
}

#[derive(Insertable)]
#[diesel(table_name = workouts)]
pub struct NewWorkout<'a> {
    pub title: &'a str,
    pub created_by: &'a Uuid,
}

#[derive(Debug, Serialize, Default, Queryable, Identifiable, PartialEq)]
#[diesel(table_name = workout_records)]
pub struct WorkoutRecordWithTitle {
    pub title: String,
    pub id: i32,
    pub created_at: Option<NaiveDateTime>,
    pub workout_id: Option<Uuid>,
}

#[derive(Debug, Serialize, Default, Queryable, Associations, Identifiable, PartialEq)]
#[diesel(belongs_to(WorkoutRecordWithTitle, foreign_key = workout_record_id))]
#[diesel(table_name = exercise_records)]
pub struct ExerciseRecordWithName {
    pub id: i32,
    pub exercise_name: String,
    pub workout_record_id: i32,
    pub exercise_id: i32,
    pub reps: Vec<Option<i16>>,
    pub weight: Vec<Option<f32>>,
}

#[derive(Debug, Serialize, Default)]
pub struct WorkoutHistory {
    pub title: String,
    pub created_at: Option<NaiveDateTime>,
    pub exercises: Vec<ExerciseRecordWithName>
}