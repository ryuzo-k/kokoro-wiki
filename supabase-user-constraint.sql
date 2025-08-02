-- Add user_email column to track which email owns which username
ALTER TABLE thoughts ADD COLUMN user_email TEXT;
ALTER TABLE people_want_to_talk ADD COLUMN user_email TEXT;

-- Create a users table to track username ownership
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  user_email TEXT NOT NULL,
  username TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on user_profiles
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- RLS policies for user_profiles
CREATE POLICY "Allow public read access" ON user_profiles
  FOR SELECT USING (true);

CREATE POLICY "Allow insert for authenticated users" ON user_profiles
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Allow update for authenticated users" ON user_profiles
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Allow delete for authenticated users" ON user_profiles
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Create unique constraint: one username per email
CREATE UNIQUE INDEX idx_user_profiles_email ON user_profiles(user_email);

-- Create index for performance
CREATE INDEX idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX idx_user_profiles_username ON user_profiles(username);
