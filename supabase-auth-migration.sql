お-- Add user_id columns to existing tables for authentication
ALTER TABLE thoughts ADD COLUMN user_id UUID REFERENCES auth.users(id);
ALTER TABLE people_want_to_talk ADD COLUMN user_id UUID REFERENCES auth.users(id);

-- Create indexes for performance
CREATE INDEX idx_thoughts_user_id ON thoughts(user_id);
CREATE INDEX idx_people_want_to_talk_user_id ON people_want_to_talk(user_id);

-- Drop old policies
DROP POLICY IF EXISTS "Allow public read access" ON thoughts;
DROP POLICY IF EXISTS "Allow insert for authenticated users" ON thoughts;
DROP POLICY IF EXISTS "Allow update for authenticated users" ON thoughts;
DROP POLICY IF EXISTS "Allow delete for authenticated users" ON thoughts;

DROP POLICY IF EXISTS "Anyone can view people entries" ON people_want_to_talk;
DROP POLICY IF EXISTS "Anyone can insert people entries" ON people_want_to_talk;
DROP POLICY IF EXISTS "Users can update own people entries" ON people_want_to_talk;
DROP POLICY IF EXISTS "Users can delete own people entries" ON people_want_to_talk;

-- Create new RLS policies for thoughts
CREATE POLICY "Allow public read access" ON thoughts
  FOR SELECT USING (true);

CREATE POLICY "Allow insert for authenticated users" ON thoughts
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Allow update for authenticated users" ON thoughts
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Allow delete for authenticated users" ON thoughts
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Create new RLS policies for people_want_to_talk
CREATE POLICY "Allow public read access" ON people_want_to_talk
  FOR SELECT USING (true);

CREATE POLICY "Allow insert for authenticated users" ON people_want_to_talk
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Allow update for authenticated users" ON people_want_to_talk
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Allow delete for authenticated users" ON people_want_to_talk
  FOR DELETE TO authenticated USING (auth.uid() = user_id);
