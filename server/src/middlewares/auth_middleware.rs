use actix_web::Result;
use actix_web::dev::Payload;
use actix_web::error::ErrorUnauthorized;
use actix_web::FromRequest;
use std::future::{ready, Ready};

use crate::handlers::jwt_handler::validate_jwt;
use crate::models::user_models::Claims;

impl FromRequest for Claims {
    type Error = actix_web::Error;
    type Future = Ready<Result<Self, Self::Error>>;

    fn from_request(req: &actix_web::HttpRequest, _payload: &mut Payload) -> Self::Future {
        // Extract the bearer token from the request headers
        if let Some(header_value) = req.headers().get("Authorization") {
            if let Ok(header_str) = header_value.to_str() {
                if header_str.starts_with("Bearer ") {
                    let token = header_str.trim_start_matches("Bearer ").to_owned();
                    if let Ok(claims) = validate_jwt(&token) {
                        return ready(Ok(claims.into()));
                    }
                }
            }
        }

        // If the bearer token is not found or is invalid, return an unauthorized error
        ready(Err(ErrorUnauthorized("Invalid token")))
    }
}