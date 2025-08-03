-- Debug: Check table structure and policies
SELECT 
  schemaname,
  tablename,
  tableowner,
  hasindexes,
  hasrules,
  hastriggers,
  rowsecurity
FROM pg_tables 
WHERE tablename IN ('thoughts', 'people_want_to_talk', 'user_profiles');

-- Check columns
SELECT 
  table_name,
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_name IN ('thoughts', 'people_want_to_talk', 'user_profiles')
ORDER BY table_name, ordinal_position;

-- Check RLS policies
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename IN ('thoughts', 'people_want_to_talk', 'user_profiles');

-- Test insert into people_want_to_talk
-- Replace with actual user_id from auth.users
INSERT INTO people_want_to_talk (username, content, user_id) 
VALUES ('testuser', 'test content', (SELECT id FROM auth.users LIMIT 1));
