-- Your SQL goes here
-- Add a unique constraint to the gid column
ALTER TABLE users
ADD CONSTRAINT unique_gid UNIQUE (gid);
