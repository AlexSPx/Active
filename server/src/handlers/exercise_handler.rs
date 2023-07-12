use serde::Deserialize;

use crate::DBPooledConnection;
use crate::handlers::paginating::Paginate;
use crate::models::exercise_models::{ExerciseShell, Exercise};

#[derive(PartialEq, Debug, Deserialize)]
pub enum SearchStrategy {
    #[serde(rename = "title")]
    Title,
    #[serde(rename = "type")]
    Type,
    #[serde(rename = "bodypart")]
    BodyPart,
    #[serde(rename = "equipment")]
    Equipment,
    #[serde(rename = "level")]
    Level
}

pub fn get_exercises(page: i32,conn: &mut DBPooledConnection) -> Result<(Vec<ExerciseShell>, i32), String> {
    use crate::schema::exercises::dsl::*;
    use diesel::prelude::*;

    let query = exercises
        .select((id,title))
        .paginate(page);

    query.load_and_count_pages::<ExerciseShell>(conn)
    .map_err(|err| format!("Couldn't load exercises: {}", err))
}

pub fn get_exercise_info(exerciseid: i32, conn: &mut DBPooledConnection) -> Result<Exercise, diesel::result::Error>{
    use crate::schema::exercises::dsl::*;
    use diesel::prelude::*;

    exercises.find(exerciseid).first::<Exercise>(conn)
}

pub fn search_exercises_fn(strategies: &Vec<SearchStrategy>, search_values: &Vec<String>, page: i32, conn: &mut DBPooledConnection) -> Result<(Vec<Exercise>, i32), diesel::result::Error>{
    use crate::schema::exercises::dsl::*;
    use diesel::prelude::*;

    println!("{:?}", *search_values);

    let mut query = exercises.into_boxed();
    for (strat, val) in strategies.iter().zip(search_values) {
        query = match strat {
            SearchStrategy::Title => query.filter(title.ilike(format!("%{}%", val))),
            SearchStrategy::Type => query.filter(exercise_type.eq(val)),
            SearchStrategy::BodyPart => query.filter(body_part.eq(val)),
            SearchStrategy::Equipment => query.filter(equipment.eq(val)),
            SearchStrategy::Level => query.filter(level.eq(val)),
        };
    };

    query.paginate(page).load_and_count_pages::<Exercise>(conn)
}