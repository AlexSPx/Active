-- Your SQL goes here
-- Modify the users table

-- Add gid column as optional
ALTER TABLE users
ADD COLUMN IF NOT EXISTS gid TEXT;

-- Make the password column optional
ALTER TABLE users
ALTER COLUMN password DROP NOT NULL;
