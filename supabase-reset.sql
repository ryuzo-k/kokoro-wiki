-- RESET DATABASE - Run this in Supabase SQL Editor

-- Drop all existing tables and policies
DROP TABLE IF EXISTS thoughts CASCADE;
DROP TABLE IF EXISTS people_want_to_talk CASCADE;
DROP TABLE IF EXISTS user_profiles CASCADE;

-- Create clean user_profiles table with name field
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  user_email TEXT NOT NULL UNIQUE,
  username TEXT NOT NULL UNIQUE,
  display_name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create thoughts table
CREATE TABLE thoughts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create people_want_to_talk table
CREATE TABLE people_want_to_talk (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE thoughts ENABLE ROW LEVEL SECURITY;
ALTER TABLE people_want_to_talk ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_profiles
CREATE POLICY "Allow public read access" ON user_profiles
  FOR SELECT USING (true);

CREATE POLICY "Allow insert for authenticated users" ON user_profiles
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Allow update for authenticated users" ON user_profiles
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Allow delete for authenticated users" ON user_profiles
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- RLS Policies for thoughts
CREATE POLICY "Allow public read access" ON thoughts
  FOR SELECT USING (true);

CREATE POLICY "Allow insert for authenticated users" ON thoughts
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Allow update for authenticated users" ON thoughts
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Allow delete for authenticated users" ON thoughts
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- RLS Policies for people_want_to_talk
CREATE POLICY "Allow public read access" ON people_want_to_talk
  FOR SELECT USING (true);

CREATE POLICY "Allow insert for authenticated users" ON people_want_to_talk
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Allow update for authenticated users" ON people_want_to_talk
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Allow delete for authenticated users" ON people_want_to_talk
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX idx_user_profiles_username ON user_profiles(username);
CREATE INDEX idx_user_profiles_user_email ON user_profiles(user_email);
CREATE INDEX idx_thoughts_username ON thoughts(username);
CREATE INDEX idx_thoughts_user_id ON thoughts(user_id);
CREATE INDEX idx_people_username ON people_want_to_talk(username);
CREATE INDEX idx_people_user_id ON people_want_to_talk(user_id);
