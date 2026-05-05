import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ycptcuhvxbglljsthiec.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InljcHRjdWh2eGJnbGxqc3RoaWVjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI4OTc5MTIsImV4cCI6MjA3ODQ3MzkxMn0.Av4Nk1j9KhA-_Jm6ZTaySV8Ku-3LTjQJapcEazgzTBU';

const supabase = createClient(supabaseUrl, supabaseKey);

async function probeColumns() {
  const possibleColumns = [
    'id', 'title', 'description', 'type', 'start_time', 'end_time', 
    'event_date', 'event_time', 'location', 'created_by', 'created_at', 'updated_at',
    'date', 'time'
  ];
  
  console.log('Probing columns in "events"...');
  for (const col of possibleColumns) {
    const { error } = await supabase.from('events').select(col).limit(1);
    if (!error) {
      console.log(`✅ Column exists: ${col}`);
    } else if (error.code !== '42703') { // 42703 = column does not exist
      console.log(`⚠️  Column ${col}: ${error.message} (Code: ${error.code})`);
    } else {
      console.log(`❌ Column does not exist: ${col}`);
    }
  }
}

probeColumns();
