import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ycptcuhvxbglljsthiec.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InljcHRjdWh2eGJnbGxqc3RoaWVjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI4OTc5MTIsImV4cCI6MjA3ODQ3MzkxMn0.Av4Nk1j9KhA-_Jm6ZTaySV8Ku-3LTjQJapcEazgzTBU';

const supabase = createClient(supabaseUrl, supabaseKey);

console.log('🔍 Verificando estrutura real das tabelas no Supabase...\n');

async function getTableStructure(schema, tableName) {
  try {
    const { data, error } = await supabase.rpc('get_table_columns', {
      p_schema: schema,
      p_table: tableName
    });
    
    if (error) {
      // Método alternativo: tentar pegar uma linha para ver a estrutura
      const { data: sample, error: sampleError } = await supabase
        .from(tableName)
        .select('*')
        .limit(1);
      
      if (sampleError) {
        console.error(`❌ Erro ao acessar ${schema}.${tableName}:`, sampleError.message);
        return null;
      }
      
      return sample;
    }
    
    return data;
  } catch (err) {
    console.error(`❌ Erro inesperado ao verificar ${schema}.${tableName}:`, err.message);
    return null;
  }
}

async function listAllTables() {
  console.log('📊 Listando todas as tabelas disponíveis...\n');
  
  // Tentar listar tabelas no schema public
  console.log('=== Schema: public ===\n');
  
  const tables = ['profiles', 'users', 'agenda', 'schedules', 'departments'];
  
  for (const table of tables) {
    const { data, error } = await supabase
      .from(table)
      .select('*')
      .limit(1);
    
    if (!error) {
      console.log(`✅ Tabela encontrada: ${table}`);
      if (data && data.length > 0) {
        console.log('   Estrutura:', Object.keys(data[0]));
      } else {
        console.log('   (Tabela vazia - estrutura não disponível via query)');
      }
    } else if (error.code !== '42P01') { // 42P01 = tabela não existe
      console.log(`⚠️  Tabela ${table}: ${error.message}`);
    }
  }
  
  console.log('\n=== Verificando auth.users (via getUser) ===\n');
  
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError) {
    console.log('ℹ️  Nenhum usuário logado - campos auth.users não disponíveis');
    console.log('   Campos típicos em auth.users:');
    console.log('   - id (uuid)');
    console.log('   - email (text)');
    console.log('   - created_at (timestamp)');
    console.log('   - updated_at (timestamp)');
    console.log('   - last_sign_in_at (timestamp)');
    console.log('   - email_confirmed_at (timestamp)');
    console.log('   - phone (text)');
    console.log('   - confirmed_at (timestamp)');
    console.log('   - user_metadata (jsonb)');
    console.log('   - app_metadata (jsonb)');
  } else if (user) {
    console.log('✅ Usuário logado detectado');
    console.log('   Campos disponíveis:', Object.keys(user));
    console.log('\n   Estrutura completa:');
    console.log(JSON.stringify(user, null, 2));
  }
}

async function generateTypeScriptTypes() {
  console.log('\n\n🔧 Gerando tipos TypeScript baseados na estrutura real...\n');
  
  // Verificar profiles
  const { data: profileSample, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .limit(1);
  
  let profileStructure = {};
  
  if (!profileError && profileSample && profileSample.length > 0) {
    profileStructure = profileSample[0];
    console.log('✅ Estrutura da tabela profiles detectada:');
    console.log(JSON.stringify(profileStructure, null, 2));
  } else {
    console.log('⚠️  Tabela profiles vazia ou inacessível');
    console.log('   Usando estrutura mínima baseada em auth.users');
  }
  
  console.log('\n📝 Tipos TypeScript recomendados:\n');
  console.log('```typescript');
  console.log('// src/types/supabase.ts');
  console.log('');
  console.log('export type Json =');
  console.log('  | string');
  console.log('  | number');
  console.log('  | boolean');
  console.log('  | null');
  console.log('  | { [key: string]: Json }');
  console.log('  | Json[];');
  console.log('');
  console.log('export interface Database {');
  console.log('  public: {');
  console.log('    Tables: {');
  console.log('      profiles: {');
  console.log('        Row: {');
  console.log('          id: string;');
  console.log('          full_name: string | null;');
  console.log('          city: string | null;');
  console.log('          role: string | null;');
  console.log('          phone: string | null;');
  console.log('          avatar_url: string | null;');
  console.log('          created_at: string;');
  console.log('          updated_at: string;');
  console.log('        };');
  console.log('        Insert: {');
  console.log('          id: string;');
  console.log('          full_name?: string | null;');
  console.log('          city?: string | null;');
  console.log('          role?: string | null;');
  console.log('          phone?: string | null;');
  console.log('          avatar_url?: string | null;');
  console.log('          created_at?: string;');
  console.log('          updated_at?: string;');
  console.log('        };');
  console.log('        Update: {');
  console.log('          id?: string;');
  console.log('          full_name?: string | null;');
  console.log('          city?: string | null;');
  console.log('          role?: string | null;');
  console.log('          phone?: string | null;');
  console.log('          avatar_url?: string | null;');
  console.log('          updated_at?: string;');
  console.log('        };');
  console.log('      };');
  console.log('    };');
  console.log('    Views: {};');
  console.log('    Functions: {};');
  console.log('  };');
  console.log('}');
  console.log('');
  console.log('// Tipo para auth.users (referência)');
  console.log('export interface AuthUser {');
  console.log('  id: string;');
  console.log('  email: string | null;');
  console.log('  phone: string | null;');
  console.log('  created_at: string;');
  console.log('  updated_at: string;');
  console.log('  last_sign_in_at: string | null;');
  console.log('  email_confirmed_at: string | null;');
  console.log('  confirmed_at: string | null;');
  console.log('  user_metadata: { [key: string]: any };');
  console.log('  app_metadata: { [key: string]: any };');
  console.log('}');
  console.log('```');
}

await listAllTables();
await generateTypeScriptTypes();

console.log('\n✅ Verificação concluída!');
