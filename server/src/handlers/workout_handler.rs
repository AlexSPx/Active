use std::collections::HashMap;

use diesel::sql_types::Text;
use uuid::Uuid;

use crate::{DBPooledConnection, models::workout_models::{CreateWorkoutRequest, NewWorkout, ExerciseRecordRequest, Workout, WorkoutRecord, ExerciseRecord, WorkoutWithExercises, WorkoutWithRecords, ExerciseRecordWithTitle, WorkoutRecordWithTitle, ExerciseRecordWithName, WorkoutHistory}, schema::{workouts, workout_records, exercise_records, exercises}};

pub fn create_record_hdl(user_id_r: Uuid, workout_id_r: Uuid, exercises_data: Vec<ExerciseRecordRequest>, conn: &mut DBPooledConnection) -> Result<i32, diesel::result::Error> {
    use crate::schema::workout_records::dsl as wr;
    use crate::schema::exercise_records::dsl as er;
    use diesel::prelude::*;

    let workout_record = diesel::insert_into(wr::workout_records)
    .values((
        wr::workout_id.eq(workout_id_r),
    ))
    .returning(wr::id)
    .get_result::<i32>(conn)?;

    let exercies_data_with_record = exercises_data.into_iter().map(|mut edata| {
        edata.workout_record_id = Some(workout_record);
        edata.user_id = Some(user_id_r);
        edata
    }).collect::<Vec<ExerciseRecordRequest>>();

    diesel::insert_into(er::exercise_records)
        .values(exercies_data_with_record)
        .execute(conn)?;

    Ok(workout_record)
}

pub fn create_workout_hdl(user_id: Uuid, data: CreateWorkoutRequest,conn: &mut DBPooledConnection) -> Result<(), diesel::result::Error> {
    use crate::schema::workouts::dsl::*;
    use diesel::prelude::*;
    
    let new_workout = NewWorkout {
        title: &data.title,
        created_by: &user_id
    };

    let workout_id = diesel::insert_into(workouts)
        .values(&new_workout)
        .returning(id)
        .get_result::<Uuid>(conn)?;


    let workout_record_id = create_record_hdl(user_id, workout_id, data.exercises, conn)?;

    diesel::update(workouts.find(workout_id))
        .set(structure_record_id.eq(workout_record_id))
        .execute(conn)?;

    Ok(())
}

pub fn get_workouts_hdl(user_id: Uuid, conn: &mut DBPooledConnection) -> Result<Vec<WorkoutWithRecords>, diesel::result::Error> {
    use diesel::prelude::*;

    let user_workouts: Vec<Workout> = workouts::table
        .filter(workouts::created_by.eq(user_id))
        .load::<Workout>(conn)?;

    let structure_ids: Vec<Option<i32>> = user_workouts.iter().map(|wk| wk.structure_record_id).collect();

    let workout_structures: Vec<WorkoutRecord> = workout_records::table
        .filter(workout_records::id.nullable().eq_any(structure_ids))
        .load::<WorkoutRecord>(conn)?;
        
    let exercises: Vec<(ExerciseRecord, String)> = ExerciseRecord::belonging_to(&workout_structures)
        .inner_join(exercises::table)
        .select((exercise_records::all_columns, exercises::title))
        .load::<(ExerciseRecord, String)>(conn)?;

    let mut workout_records_map: HashMap<Option<i32>, WorkoutWithExercises> = HashMap::new();

    for (record, title) in exercises {

        let workout_with_exercises = workout_records_map
            .entry(Some(record.workout_record_id))
            .or_insert_with(|| WorkoutWithExercises {
                record: WorkoutRecord { id: record.workout_record_id, ..Default::default() },
                exercises: Vec::new(),
            });
        workout_with_exercises.exercises.push(ExerciseRecordWithTitle { title, record });
    };

    let workout_with_records: Vec<WorkoutWithRecords> = user_workouts
    .iter()
    .filter_map(|workout| {
        workout_records_map
            .get(&Some(workout.structure_record_id.unwrap()))
            .map(|workout_with_exercises| {
                WorkoutWithRecords {
                    workout: workout.clone(),
                    structure_record: workout_with_exercises.clone(),
                }
            })
    })
    .collect();

    Ok(workout_with_records)
    
}

pub fn get_history_hdl(user_id: Uuid, conn: &mut DBPooledConnection) -> Result<Vec<WorkoutHistory>, diesel::result::Error> {
    use diesel::prelude::*;
    use diesel::dsl::sql;

    let user_workouts: Vec<WorkoutRecordWithTitle> = workouts::table
    .inner_join(workout_records::table.on(workout_records::workout_id.eq(workouts::id.nullable())))
    .select((
        workouts::title, 
        workout_records::id,
        workout_records::created_at,
        workout_records::workout_id,
    ))
    .filter(workouts::created_by.eq(user_id))
    .filter(workout_records::id.nullable().ne(workouts::structure_record_id))
    .load::<WorkoutRecordWithTitle>(conn)?;

    let exercise_records_with_names: Vec<ExerciseRecordWithName> = ExerciseRecordWithName::belonging_to(&user_workouts)
        .inner_join(exercises::table)
        .select((
            exercise_records::id,
            sql::<Text>("exercises.title AS exercise_name"),
            exercise_records::workout_record_id,
            exercise_records::exercise_id,
            exercise_records::reps,
            exercise_records::weight,
        ))
        .load::<ExerciseRecordWithName>(conn)?;

    let workout_history: Vec<WorkoutHistory> = exercise_records_with_names
        .grouped_by(&user_workouts)
        .into_iter()
        .zip(user_workouts)
        .map(|(exercises, workout)| 
            WorkoutHistory {
                title: workout.title,
                created_at: workout.created_at,
                exercises
            }
        ).collect::<Vec<WorkoutHistory>>();

    Ok(workout_history)
}