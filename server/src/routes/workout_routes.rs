use actix_web::{Responder, web::{Data, self}, HttpResponse};

use crate::{models::{workout_models::{CreateWorkoutRequest, CreateWorkoutRecordRequest}, user_models::Claims}, DBPool, handlers::workout_handler::{create_workout_hdl, get_workouts_hdl, create_record_hdl, get_history_hdl}};


pub async fn create_workout(data: web::Json<CreateWorkoutRequest>, auth: Claims, pool: Data<DBPool>) -> impl Responder {
    let mut conn = pool.get().expect("couldn't get DB connection from pool");
    
    match create_workout_hdl(auth.sub, data.0, &mut conn) {
        Ok(()) => HttpResponse::Created().finish(),
        Err(err) => HttpResponse::BadRequest().json(err.to_string()),
    }
}

pub async fn get_workouts(auth: Claims, pool: Data<DBPool>) -> impl Responder {
    let mut conn = pool.get().expect("couldn't get DB connection from pool");

    match get_workouts_hdl(auth.sub, &mut conn) {
        Ok(data) => HttpResponse::Ok().json(data),
        Err(err) => HttpResponse::BadRequest().json(err.to_string()),
    }
}

pub async fn add_workout_record(auth: Claims, pool: Data<DBPool>, data: web::Json<CreateWorkoutRecordRequest>) -> impl Responder {
    let mut conn = pool.get().expect("couldn't get DB connection from pool");
    
    match create_record_hdl(auth.sub, data.0.workout_id, data.0.exercises, &mut conn) {
        Ok(_) => HttpResponse::Created().finish(),
        Err(err) => HttpResponse::BadRequest().json(err.to_string()),
    }
}

pub async fn get_history(auth: Claims, pool: Data<DBPool>) -> impl Responder {
    let mut conn = pool.get().expect("couldn't get DB connection from pool");

    match get_history_hdl(auth.sub, &mut conn) {
        Ok(records) => HttpResponse::Ok().json(records),
        Err(err) => HttpResponse::BadRequest().json(err.to_string()),
    }
}