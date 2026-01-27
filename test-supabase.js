import { createClient } from '@supabase/supabase-js';

// Carregar variáveis de ambiente
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://ycptcuhvxbglljsthiec.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InljcHRjdWh2eGJnbGxqc3RoaWVjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI4OTc5MTIsImV4cCI6MjA3ODQ3MzkxMn0.Av4Nk1j9KhA-_Jm6ZTaySV8Ku-3LTjQJapcEazgzTBU';

console.log('Testing Supabase connection...');
console.log('URL:', supabaseUrl);
console.log('Key:', supabaseKey.substring(0, 20) + '...');

const supabase = createClient(supabaseUrl, supabaseKey);

// Teste básico de conexão
async function testConnection() {
  try {
    // Tentar fazer uma query simples
    const { data, error } = await supabase.from('profiles').select('count');
    
    if (error) {
      console.error('❌ Erro ao conectar com Supabase:', error.message);
      console.error('Detalhes:', error);
      return false;
    }
    
    console.log('✅ Conexão com Supabase bem-sucedida!');
    console.log('Dados:', data);
    return true;
  } catch (err) {
    console.error('❌ Erro inesperado:', err);
    return false;
  }
}

// Teste de autenticação
async function testAuth() {
  try {
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('❌ Erro ao verificar sessão:', error.message);
      return false;
    }
    
    console.log('✅ Serviço de autenticação está acessível');
    console.log('Sessão atual:', data.session ? 'Logado' : 'Não logado');
    return true;
  } catch (err) {
    console.error('❌ Erro ao testar auth:', err);
    return false;
  }
}

// Executar testes
(async () => {
  console.log('\n=== Teste de Conexão ===');
  await testConnection();
  
  console.log('\n=== Teste de Autenticação ===');
  await testAuth();
  
  console.log('\n=== Fim dos testes ===');
})();
