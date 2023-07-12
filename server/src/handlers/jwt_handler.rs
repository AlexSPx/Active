use jsonwebtoken::{DecodingKey, Validation, decode};

use crate::models::user_models::Claims;

pub fn validate_jwt(token: &str) -> Result<Claims, String> {
    let jwt_secret = std::env::var("JWT_SECRET")
    .expect("JWT_SECRET must be set");

    let decoding_key = DecodingKey::from_secret(jwt_secret.as_bytes());
    
    match decode::<Claims>(token, &decoding_key, &Validation::new(jsonwebtoken::Algorithm::HS256)) {
        Ok(token_data) => Ok(token_data.claims),
        Err(_) => Err("Invalid token".to_owned()),
    }
}