use actix_web::{web::{Data, self}, Responder, HttpResponse};
use serde::{Deserialize, Serialize};

use crate::{DBPool, handlers::exercise_handler::{get_exercises, get_exercise_info, SearchStrategy, search_exercises_fn}, models::exercise_models::{ExerciseShell, Exercise}};

#[derive(Deserialize)]
pub struct PageQuery {
    page: i32
}

#[derive(Serialize)]
pub struct ShellResponse {
    exercises: Vec<ExerciseShell>,
    total: i32
}

#[derive(Deserialize)]
pub struct ExerciseId {
    id: i32
}

#[derive(Deserialize, Debug)]
pub struct SearchParams {
    strategy_tags: String,
    search_value_tags: String,
    page: i64
}

#[derive(Serialize)]
pub struct SearchResponse {
    exercises: Vec<Exercise>,
    total: i32
}

pub async fn get_exercise_shells(info: web::Query<PageQuery> ,pool: Data<DBPool>) -> impl Responder {
    let mut conn = pool.get().expect("couldn't get DB connection from pool");

    let query_page = info.page;

    match get_exercises(query_page, &mut conn) {
        Ok(res) => HttpResponse::Ok().json(ShellResponse { exercises: res.0, total: res.1 }),
        Err(err) => HttpResponse::BadRequest().json(err),
    }
}

pub async fn get_exercise(info: web::Path<ExerciseId>,pool: Data<DBPool>) -> impl Responder {
    let mut conn = pool.get().expect("couldn't get DB connection from pool");

    match get_exercise_info(info.id, &mut conn) {
        Ok(exercise) => HttpResponse::Ok().json(exercise),
        Err(err) => HttpResponse::BadRequest().json(err.to_string()),
    }
}

pub async fn search_exercises(info: web::Query<SearchParams>, pool: Data<DBPool>) -> impl Responder{
    let mut conn = pool.get().expect("couldn't get DB connection from pool");

    let strategies: Vec<SearchStrategy> = info.strategy_tags.split(",").map(|strategy| match strategy {
            "exercisetype" => SearchStrategy::Type,
            "bodypart" => SearchStrategy::BodyPart,
            "equipment" => SearchStrategy::Equipment,
            "level" => SearchStrategy::Level,
            "title" => SearchStrategy::Title,
            _ => panic!("Invalid search strategy: {}", strategy),
    }).collect();

    let values: Vec<String> = info.search_value_tags.split(",").map(|val| val.to_string()).collect();



    // println!("{:?}", values);
    // HttpResponse::Ok()
    match search_exercises_fn(&strategies, &values, info.page as i32, &mut conn) {
        Ok(res) => HttpResponse::Ok().json(SearchResponse { exercises: res.0, total: res.1 }),
        Err(err) => HttpResponse::BadRequest().json(err.to_string()),
    }
}