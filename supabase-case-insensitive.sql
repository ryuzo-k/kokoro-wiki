-- Make usernames case-insensitive
-- Drop existing unique constraint
DROP INDEX IF EXISTS idx_user_profiles_username;

-- Create case-insensitive unique index for username
CREATE UNIQUE INDEX idx_user_profiles_username_lower ON user_profiles(LOWER(username));

-- Also update thoughts and people_want_to_talk tables to be case-insensitive
CREATE INDEX IF NOT EXISTS idx_thoughts_username_lower ON thoughts(LOWER(username));
CREATE INDEX IF NOT EXISTS idx_people_username_lower ON people_want_to_talk(LOWER(username));
