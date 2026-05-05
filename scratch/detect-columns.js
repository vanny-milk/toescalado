import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ycptcuhvxbglljsthiec.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InljcHRjdWh2eGJnbGxqc3RoaWVjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI4OTc5MTIsImV4cCI6MjA3ODQ3MzkxMn0.Av4Nk1j9KhA-_Jm6ZTaySV8Ku-3LTjQJapcEazgzTBU';

const supabase = createClient(supabaseUrl, supabaseKey);

async function getDetailedSchema() {
  // Tentando rpc se existir
  const { data: cols, error: err } = await supabase.rpc('get_table_columns', { 
    p_schema: 'public', 
    p_table: 'events' 
  });

  if (err) {
    console.log('RPC get_table_columns failed or not found. Trying information_schema via query...');
    // Se não tiver RPC, podemos tentar uma query se tivermos permissão, 
    // mas anon key geralmente não deixa ver information_schema.
    // Outra forma: tentar inserir um objeto vazio e ver o erro de colunas obrigatórias.
    const { error: insertErr } = await supabase.from('events').insert({}).select();
    console.log('Insert error hint:', insertErr?.message);
    console.log('Full Error:', JSON.stringify(insertErr, null, 2));
  } else {
    console.log('Columns in events:', cols);
  }
}

getDetailedSchema();
