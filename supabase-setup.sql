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

-- Create policies to allow public read access
CREATE POLICY "Allow public read access on thoughts" ON thoughts
  FOR SELECT USING (true);

CREATE POLICY "Allow public read access on people_want_to_talk" ON people_want_to_talk
  FOR SELECT USING (true);

-- Create policies to allow public insert access
CREATE POLICY "Allow public insert access on thoughts" ON thoughts
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public insert access on people_want_to_talk" ON people_want_to_talk
  FOR INSERT WITH CHECK (true);

-- Insert some sample data for testing
INSERT INTO thoughts (username, content) VALUES 
  ('demo-user', 'Welcome to kokoro.wiki! This is my first thought.'),
  ('demo-user', 'I''m excited to share my ideas and connect with like-minded people.');

INSERT INTO people_want_to_talk (username, content) VALUES 
  ('demo-user', 'I want to talk to creative people who are passionate about technology and human connection.'),
  ('demo-user', 'Looking for conversations about AI, philosophy, and the future of human interaction.');
