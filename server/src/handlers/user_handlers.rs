use chrono::Utc;
use derive_more::{Display};
use diesel::{RunQueryDsl, result::{Error as DieselError, DatabaseErrorKind}, QueryDsl};
use jsonwebtoken::{Header, encode, EncodingKey};
use scrypt::{password_hash::{SaltString, rand_core::OsRng, PasswordHasher, PasswordHash, PasswordVerifier}, Scrypt};
use uuid::Uuid;
use crate::{models::user_models::{RegisterBody, User, LoginBody, Claims}, DBPooledConnection };

#[derive(Debug, Display)]
pub enum RegisterError {
    #[display(fmt = "Missing credentials")]
    MissingCredentials,
    #[display(fmt = "Email is already in use")]
    EmailInUse,
    DatabaseError(String),
    #[display(fmt = "Error creating user")]
    OtherError,
}

impl RegisterBody {
    pub fn validate(&self) -> Result<&RegisterBody,RegisterError> {
        if self.firstname.is_empty() || self.lastname.is_empty() || self.username.len() < 6 || self.password.is_empty() || !self.email.contains('@') {
            return Err(RegisterError::MissingCredentials)
        }

        Ok(self)
    }
}


impl From<DieselError> for RegisterError {
    fn from(error: DieselError) -> Self {
        match error {
            DieselError::DatabaseError(kind, _) => {
                if let DatabaseErrorKind::UniqueViolation = kind {
                    RegisterError::EmailInUse
                } else {
                    RegisterError::DatabaseError(error.to_string())
                }
            }
            _ => RegisterError::OtherError,
        }
    }
}

#[derive(Debug, Display)]
pub enum LoginError {
    #[display(fmt = "User with this email does not exist")]
    InvalidEmail,
    #[display(fmt = "Wrong password")]
    WrongPassword,
    DatabaseError(String),
}

impl From<DieselError> for LoginError {
    fn from(error: DieselError) -> Self {
        match error {
            DieselError::NotFound => LoginError::InvalidEmail,
            _ => LoginError::DatabaseError(error.to_string()),
        }
    }
}

#[derive(Debug, Display)]
pub enum JWTError {

    #[display(fmt = "There was an error creating your tokens")]
    TokenCreationError
}

impl User {
    pub async fn create(credentials: RegisterBody, conn: &mut DBPooledConnection) -> Result<User, RegisterError> {
        use crate::schema::users::dsl::*;
    
        let salt = SaltString::generate(&mut OsRng);
        let hashed_password = Scrypt
            .hash_password(credentials.password.as_bytes(), &salt)
            .expect("Hash Error")
            .to_string()
            .to_owned();

            let new_user = RegisterBody {
                username: credentials.username,
                firstname: credentials.firstname,
                lastname: credentials.lastname,
                email: credentials.email,
                password: hashed_password,
            };

        diesel::insert_into(users)
            .values(&new_user)
            .get_result::<Self>(conn)
            .map_err(RegisterError::from)
    }

    
    pub async fn login(credentials: LoginBody, conn: &mut DBPooledConnection) -> Result<User, LoginError> {
        use crate::schema::users::dsl::*;
        use diesel::{expression_methods::ExpressionMethods};

        let user_data: User = users.filter(email.eq(credentials.email))
            .get_result::<Self>(conn)
            .map_err(LoginError::from)?;

        let parsed_hash = PasswordHash::new(&user_data.password).unwrap();
            Scrypt
                .verify_password(&credentials.password.as_bytes(), &parsed_hash)
                .map_err(|_| LoginError::WrongPassword)?;

        Ok(user_data)
    }

    pub fn get_tokens_by_id(id: Uuid) -> Result<String, JWTError>{
        let expiration = Utc::now()
            .checked_add_signed(chrono::Duration::minutes(60))
            .expect("valid timestamp")
            .timestamp();

        let claims = Claims {
            sub: id,
            exp: expiration as usize
        };

        let jwt_secret = std::env::var("JWT_SECRET")
            .expect("JWT_SECRET must be set");

        encode(&Header::default(), &claims, &EncodingKey::from_secret(&jwt_secret.as_bytes()))
            .map_err(|_| JWTError::TokenCreationError )
    }

    pub fn get_tokens(&self) -> Result<String, JWTError> {
        Self::get_tokens_by_id(self.id)
    }

    pub fn get_user_by_id(userid: Uuid, conn: &mut DBPooledConnection) -> Result<User, diesel::result::Error>{
        use diesel::prelude::*;
        use crate::schema::users::dsl::*;

        users.find(userid).first(conn)
    }
}
