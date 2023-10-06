use actix_cors::Cors;
use actix_web::{HttpServer, App, web, middleware::Logger};
use dotenvy::dotenv;
use diesel::{r2d2::ConnectionManager, PgConnection};
use r2d2::{PooledConnection, Pool};

mod models;
mod handlers;
mod routes;
mod middlewares;
mod schema;


pub type DBPooledConnection = PooledConnection<ConnectionManager<PgConnection>>;
pub type DBPool = Pool<ConnectionManager<PgConnection>>;

pub async fn run() -> std::io::Result<()> {
    dotenv().ok();

    std::env::set_var(
        "RUST_LOG",
        "trainingapp=debug,actix_web=info,actix_server=info",
    );
    env_logger::init();

    // postgres database
    let pg_database_url = std::env::var("DATABASE_URL")
        .expect("DATABASE_URL must be set");
    let manager = ConnectionManager::<PgConnection>::new(pg_database_url);
    let pool = r2d2::Pool::builder()
        .build(manager)
        .expect("Failed to create pool");

    HttpServer::new(move || {

        let cors = Cors::permissive();
        
        App::new()
            .wrap(cors)
            .wrap(Logger::default())
            .app_data(web::Data::new(pool.clone()))
            .service(web::scope("/api")
                .route("/register", web::post().to(routes::user_routes::register))
                .route("/login", web::post().to(routes::user_routes::login))
                
                .service(web::scope("/google")
                    .route("/login", web::post().to(routes::user_routes::login_google))
                    .route("/register", web::post().to(routes::user_routes::register_google))
                )  
                .service(web::scope("/user")
                    .route("/me", web::get().to(routes::user_routes::me))
                    .route("/connect-google", web::post().to(routes::user_routes::connect_google))
                )
                .service(web::scope("/exercise")
                    .route("", web::get().to(routes::exercise_routes::get_exercise_shells))
                    .route("/search", web::get().to(routes::exercise_routes::search_exercises))
                    .route("/{id}", web::get().to(routes::exercise_routes::get_exercise))
                )
                .service(web::scope("/workout")
                    .route("/create", web::post().to(routes::workout_routes::create_workout))
                    .route("", web::get().to(routes::workout_routes::get_workouts))
                    .route("/record", web::post().to(routes::workout_routes::add_workout_record))
                    .route("/history", web::get().to(routes::workout_routes::get_history))
                    .route("/{id}", web::delete().to(routes::workout_routes::delete_workout))
                )
            ) 
    })
    .bind(("0.0.0.0", 8080))?
    .run()
    .await
}