import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ycptcuhvxbglljsthiec.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InljcHRjdWh2eGJnbGxqc3RoaWVjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI4OTc5MTIsImV4cCI6MjA3ODQ3MzkxMn0.Av4Nk1j9KhA-_Jm6ZTaySV8Ku-3LTjQJapcEazgzTBU';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkAgendaTables() {
  const tables = ['events', 'event_guests'];
  for (const table of tables) {
    const { data, error } = await supabase.from(table).select('*').limit(1);
    if (!error) {
      console.log(`✅ Tabela ${table} encontrada.`);
      if (data && data.length > 0) {
        console.log(`   Colunas em ${table}:`, Object.keys(data[0]));
      } else {
        console.log(`   Tabela ${table} está vazia.`);
      }
    } else {
      console.log(`❌ Erro ao acessar ${table}:`, error.message);
    }
  }
}

checkAgendaTables();
