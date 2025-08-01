-- Create thoughts table
CREATE TABLE IF NOT EXISTS thoughts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  username TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create people_want_to_talk table
CREATE TABLE IF NOT EXISTS people_want_to_talk (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  username TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_thoughts_username_created_at ON thoughts(username, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_people_username_created_at ON people_want_to_talk(username, created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE thoughts ENABLE ROW LEVEL SECURITY;
ALTER TABLE people_want_to_talk ENABLE ROW LEVEL SECURITY;

-- Create policies for thoughts table
-- Anyone can read thoughts (for public profiles)
CREATE POLICY "Anyone can view thoughts" ON thoughts
  FOR SELECT USING (true);

-- Anyone can insert their own thoughts (no auth required for simplicity)
CREATE POLICY "Anyone can insert thoughts" ON thoughts
  FOR INSERT WITH CHECK (true);

-- Users can only update/delete their own thoughts (if we add auth later)
CREATE POLICY "Users can update own thoughts" ON thoughts
  FOR UPDATE USING (auth.uid()::text = username OR auth.uid() IS NULL);

CREATE POLICY "Users can delete own thoughts" ON thoughts
  FOR DELETE USING (auth.uid()::text = username OR auth.uid() IS NULL);

-- Create policies for people_want_to_talk table
-- Anyone can read people entries (for public profiles)
CREATE POLICY "Anyone can view people entries" ON people_want_to_talk
  FOR SELECT USING (true);

-- Anyone can insert their own people entries (no auth required for simplicity)
CREATE POLICY "Anyone can insert people entries" ON people_want_to_talk
  FOR INSERT WITH CHECK (true);

-- Users can only update/delete their own people entries (if we add auth later)
CREATE POLICY "Users can update own people entries" ON people_want_to_talk
  FOR UPDATE USING (auth.uid()::text = username OR auth.uid() IS NULL);

CREATE POLICY "Users can delete own people entries" ON people_want_to_talk
  FOR DELETE USING (auth.uid()::text = username OR auth.uid() IS NULL);

-- Insert some sample data for testing
INSERT INTO thoughts (username, content) VALUES 
  ('demo-user', 'Welcome to kokoro.wiki! This is my first thought.'),
  ('demo-user', 'I''m excited to share my ideas and connect with like-minded people.');

INSERT INTO people_want_to_talk (username, content) VALUES 
  ('demo-user', 'I want to talk to creative people who are passionate about technology and human connection.'),
  ('demo-user', 'Looking for conversations about AI, philosophy, and the future of human interaction.');
