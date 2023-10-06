-- Your SQL goes here
-- Remove the unique constraint from the gid column
ALTER TABLE users
DROP CONSTRAINT IF EXISTS unique_gid;
