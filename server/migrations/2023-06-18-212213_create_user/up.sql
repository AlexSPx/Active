-- Your SQL goes here
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE users (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    created_date DATE DEFAULT Now(),
    username VARCHAR(255) NOT NULL,
    firstname VARCHAR(255) NOT NULL,
    lastname VARCHAR(255) NOT NULL,
    password TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    isConfirmed BOOLEAN NOT NULL DEFAULT false
);