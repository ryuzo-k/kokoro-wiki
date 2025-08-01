const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://gaeyxtsktniywhzjgyml.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdhZXl4dHNrdG5peXdoempneW1sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQwODk3MjgsImV4cCI6MjA2OTY2NTcyOH0.BEabBbw3rFYKEKMlR1qo5ykOfpPuXAyzOGH83DdPFYM'

const supabase = createClient(supabaseUrl, supabaseKey)

async function testConnection() {
  try {
    console.log('Testing Supabase connection...')
    
    // Test connection by trying to fetch from thoughts table
    const { data, error } = await supabase
      .from('thoughts')
      .select('*')
      .limit(1)
    
    if (error) {
      console.error('Error:', error.message)
      console.log('You need to run the SQL setup script in your Supabase dashboard.')
    } else {
      console.log('✅ Supabase connection successful!')
      console.log('Sample data:', data)
    }
  } catch (err) {
    console.error('Connection failed:', err.message)
  }
}

testConnection()
