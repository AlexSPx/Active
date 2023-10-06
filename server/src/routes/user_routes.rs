use actix_web::{web::{self, Data}, Responder, HttpResponse};

use crate::{models::user_models::{RegisterBody, User, LoginBody, JWTBody, Claims, GoogleRegisterBody}, DBPool, handlers::{user_handlers::{RegisterError, LoginError}, google_handler::{get_google_id_token_claims}}};


pub async fn register(body: web::Json<RegisterBody>, pool: Data<DBPool>) -> impl Responder {
    let mut conn = pool.get().expect("couldn't get DB connection from pool");

    if let Err(e) = body.validate() {
        return HttpResponse::BadRequest().json(e.to_string());
    }

    match User::create(body.0, &mut conn).await {
        Ok(user) => HttpResponse::Created().json(JWTBody { token: user.get_tokens().unwrap() }),
        Err(err) => {
            match err {
                RegisterError::EmailInUse => HttpResponse::Conflict().json(err.to_string()),
                _ => HttpResponse::InternalServerError().json(err.to_string())
            }
        }
    }
}

pub async fn login_google(body: web::Json<JWTBody>, pool: Data<DBPool>) -> impl Responder {
    let mut conn = pool.get().expect("couldn't get DB connection from pool");

    match User::login_google(&body.token, &mut conn).await {
        Ok(user) => HttpResponse::Ok().json(JWTBody { token: user.get_tokens().unwrap() }),
        Err(e) => {println!("Error: {:?}", e); HttpResponse::Unauthorized().json(e.to_string())},
    }
}

pub async fn login(body: web::Json<LoginBody>, pool: Data<DBPool>) -> impl Responder {
    let mut conn = pool.get().expect("couldn't get DB connection from pool");

    match User::login(body.0, &mut conn).await {
        Ok(user) => HttpResponse::Ok().content_type("application/json").json(JWTBody { token: user.get_tokens().unwrap() }),
        Err(err) => {
            match err {
                LoginError::InvalidEmail => HttpResponse::Unauthorized().json(err.to_string()),
                LoginError::DatabaseError(_) =>  HttpResponse::Unauthorized().json(err.to_string()),
                _ => HttpResponse::BadGateway().json(err.to_string())
               }
        }
    }
}

pub async fn me(auth: Claims, pool: Data<DBPool>) -> impl Responder {
    let mut conn = pool.get().expect("couldn't get DB connection from pool");

    match User::get_user_by_id(&auth.sub, &mut conn) {
        Ok(user) => HttpResponse::Ok().json(user),
        Err(_) => HttpResponse::Unauthorized().json("Validation failed"),
    }
}

pub async fn connect_google(body: web::Json<JWTBody>, auth: Claims, pool: Data<DBPool>) -> impl Responder {
    let mut conn = pool.get().expect("couldn't get DB connection from pool");

    match User::connect_google_account(&body.token, &auth.sub,&mut conn).await {
        Ok(user) => HttpResponse::Ok().json(user),
        Err(e) => HttpResponse::Unauthorized().json(e.to_string()),
    }
}


pub async fn register_google(body: web::Json<GoogleRegisterBody>, pool: Data<DBPool>) -> impl Responder {
    let mut conn = pool.get().expect("couldn't get DB connection from pool");

    match User::register_google_account(&body.username, &body.token, &mut conn).await {
        Ok(user) => HttpResponse::Created().json(JWTBody { token: user.get_tokens().unwrap() }),
        Err(e) => {HttpResponse::Unauthorized().json(e.to_string())},
    }
}
