-- This file should undo anything in `up.sql`
-- Revert type column to nullable
ALTER TABLE exercises
ALTER COLUMN type DROP NOT NULL;

-- Revert body_part column to nullable
ALTER TABLE exercises
ALTER COLUMN body_part DROP NOT NULL;

-- Revert equipment column to nullable
ALTER TABLE exercises
ALTER COLUMN equipment DROP NOT NULL;

-- Revert level column to nullable
ALTER TABLE exercises
ALTER COLUMN level DROP NOT NULL;
