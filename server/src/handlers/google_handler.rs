use jsonwebtoken as jwt;

use jwt::{decode, Validation, DecodingKey, Algorithm, decode_header};
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct GoogleTokenClaims {
    pub aud: String,
    pub azp: String,
    pub email: String,
    pub email_verified: bool,
    pub exp: i64,
    pub family_name: String,
    pub given_name: String,
    pub iat: i64,
    pub iss: String,
    pub locale: String,
    pub name: String,
    pub picture: String,
    pub sub: String,
}

async fn get_google_public_key(rkid: &str) -> Result<DecodingKey, Box<dyn std::error::Error>> {
    let response = reqwest::get("https://www.googleapis.com/oauth2/v3/certs").await?;
    let body = response.text().await?;
    let jwks = serde_json::from_slice::<serde_json::Value>(body.as_bytes())?;

    let keys = jwks["keys"].as_array().unwrap();


    for key in keys {
        let kid = key["kid"].as_str().unwrap();

        println!("{:?}",kid);
        if kid == rkid {
            let n = key["n"].as_str().unwrap();
            let e = key["e"].as_str().unwrap();

            // Convert the modulus and exponent from base64-encoded strings to `Vec<u8>`.
            let modulus: Vec<u8> = n.as_bytes().to_vec();
            let exponent: Vec<u8> = e.as_bytes().to_vec();

            // Convert the `Vec<u8>` modulus and exponent to `&str`.
            let modulus_str: &str = std::str::from_utf8(&modulus).unwrap();
            let exponent_str: &str = std::str::from_utf8(&exponent).unwrap();

            // Create the public key.
            let public_key = DecodingKey::from_rsa_components(modulus_str, exponent_str)?;
            return Ok(public_key);
        }
    }

    Err("Could not find public key")?
}

pub async fn get_google_id_token_claims(id_token: &str) -> Result<GoogleTokenClaims, Box<dyn std::error::Error>> {


    let payload_kid = decode_header(&id_token)?.kid.ok_or("Kid not found")?;


    let public_key = get_google_public_key(&payload_kid).await?;
    let validation = Validation::new(Algorithm::RS256);
    let payload = decode::<GoogleTokenClaims>(id_token, &public_key, &validation)?;

    if payload.claims.aud != std::env::var("GOOGLE_AUD")? { 
        return Err("Aud doesn't match".into());
    }

    Ok(payload.claims)
}