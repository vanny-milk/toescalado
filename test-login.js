import { createClient } from '@supabase/supabase-js';
import * as readline from 'readline/promises';
import { stdin as input, stdout as output } from 'process';

const supabaseUrl = 'https://ycptcuhvxbglljsthiec.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InljcHRjdWh2eGJnbGxqc3RoaWVjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI4OTc5MTIsImV4cCI6MjA3ODQ3MzkxMn0.Av4Nk1j9KhA-_Jm6ZTaySV8Ku-3LTjQJapcEazgzTBU';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testLogin() {
  const rl = readline.createInterface({ input, output });
  
  try {
    console.log('\n=== Teste de Login do Supabase ===\n');
    
    const email = await rl.question('Digite o email: ');
    const password = await rl.question('Digite a senha: ');
    
    console.log('\nTentando fazer login...');
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password: password.trim(),
    });
    
    if (error) {
      console.error('\n❌ Erro no login:');
      console.error('Código:', error.status);
      console.error('Mensagem:', error.message);
      console.error('Detalhes completos:', JSON.stringify(error, null, 2));
      return;
    }
    
    console.log('\n✅ Login bem-sucedido!');
    console.log('User ID:', data.user?.id);
    console.log('Email:', data.user?.email);
    console.log('Email confirmado:', data.user?.email_confirmed_at ? 'Sim' : 'Não');
    
    // Testar acesso ao perfil
    if (data.user?.id) {
      console.log('\nVerificando perfil...');
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();
      
      if (profileError) {
        console.error('❌ Erro ao buscar perfil:', profileError.message);
        console.error('Detalhes:', profileError);
      } else {
        console.log('✅ Perfil encontrado:', profile);
      }
    }
    
  } catch (err) {
    console.error('\n❌ Erro inesperado:', err);
  } finally {
    rl.close();
  }
}

testLogin();
