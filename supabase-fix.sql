-- Fix: Ensure all tables exist with correct structure and RLS
-- Run this in Supabase SQL Editor

-- Ensure people_want_to_talk table exists with user_id column
CREATE TABLE IF NOT EXISTS people_want_to_talk (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT NOT NULL,
  content TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ensure thoughts table exists with user_id column  
CREATE TABLE IF NOT EXISTS thoughts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT NOT NULL,
  content TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE people_want_to_talk ENABLE ROW LEVEL SECURITY;
ALTER TABLE thoughts ENABLE ROW LEVEL SECURITY;

-- Drop and recreate policies for people_want_to_talk
DROP POLICY IF EXISTS "Allow public read access" ON people_want_to_talk;
DROP POLICY IF EXISTS "Allow insert for authenticated users" ON people_want_to_talk;
DROP POLICY IF EXISTS "Allow update for authenticated users" ON people_want_to_talk;
DROP POLICY IF EXISTS "Allow delete for authenticated users" ON people_want_to_talk;

CREATE POLICY "Allow public read access" ON people_want_to_talk
  FOR SELECT USING (true);

CREATE POLICY "Allow insert for authenticated users" ON people_want_to_talk
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Allow update for authenticated users" ON people_want_to_talk
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Allow delete for authenticated users" ON people_want_to_talk
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Drop and recreate policies for thoughts
DROP POLICY IF EXISTS "Allow public read access" ON thoughts;
DROP POLICY IF EXISTS "Allow insert for authenticated users" ON thoughts;
DROP POLICY IF EXISTS "Allow update for authenticated users" ON thoughts;
DROP POLICY IF EXISTS "Allow delete for authenticated users" ON thoughts;

CREATE POLICY "Allow public read access" ON thoughts
  FOR SELECT USING (true);

CREATE POLICY "Allow insert for authenticated users" ON thoughts
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Allow update for authenticated users" ON thoughts
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Allow delete for authenticated users" ON thoughts
  FOR DELETE TO authenticated USING (auth.uid() = user_id);
