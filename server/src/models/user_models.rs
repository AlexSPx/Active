use chrono::NaiveDate;
use diesel::{Insertable, Queryable};
use serde::{Serialize, Deserialize};
use uuid::Uuid;
use crate::schema::users;

#[derive(Queryable, Serialize, Insertable, Debug)]
pub struct User {
    pub id: Uuid,
    pub created_date: Option<NaiveDate>,
    pub username: String,
    pub firstname: String,
    pub lastname: String,
    #[serde(skip_serializing)]
    pub password: String,
    pub email: String,
    pub isconfirmed: bool,
}

#[derive(Insertable, Deserialize, Serialize, Debug)]
#[diesel(table_name = users)]
pub struct RegisterBody {
    pub username: String,
    pub firstname: String,
    pub lastname: String,
    pub email: String,
    pub password: String,
}

#[derive(Deserialize, Serialize, Debug)]
pub struct LoginBody {
    pub email: String,
    pub password: String
}

#[derive(Debug, Deserialize, Serialize)]
pub struct Claims {
    pub sub: Uuid,
    pub exp: usize
}

#[derive(Debug, Serialize)]
pub struct LoginResponse {
    pub token: String
}