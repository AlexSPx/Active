-- This file should undo anything in `up.sql`
-- Your SQL goes here
-- Revert the modifications made in up.sql

-- Remove gid column from the users table
ALTER TABLE users
DROP COLUMN IF EXISTS gid;

-- Make the password column mandatory again
ALTER TABLE users
ALTER COLUMN password SET NOT NULL;
