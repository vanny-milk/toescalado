import { createClient } from '@supabase/supabase-js';
import * as readline from 'readline/promises';
import { stdin as input, stdout as output } from 'process';

const supabaseUrl = 'https://ycptcuhvxbglljsthiec.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InljcHRjdWh2eGJnbGxqc3RoaWVjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI4OTc5MTIsImV4cCI6MjA3ODQ3MzkxMn0.Av4Nk1j9KhA-_Jm6ZTaySV8Ku-3LTjQJapcEazgzTBU';

const supabase = createClient(supabaseUrl, supabaseKey);

async function createTestUser() {
  const rl = readline.createInterface({ input, output });
  
  try {
    console.log('\n=== Criar Usuário de Teste ===\n');
    
    const email = await rl.question('Email para o usuário de teste: ');
    const password = await rl.question('Senha (mínimo 6 caracteres): ');
    const fullName = await rl.question('Nome completo: ');
    
    console.log('\nCriando usuário...');
    
    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password: password.trim(),
      options: {
        data: {
          full_name: fullName.trim(),
        },
      },
    });
    
    if (error) {
      console.error('\n❌ Erro ao criar usuário:');
      console.error('Código:', error.status);
      console.error('Mensagem:', error.message);
      console.error('\nPossíveis causas:');
      console.error('- Senha muito curta (mínimo 6 caracteres)');
      console.error('- Email já registrado');
      console.error('- Email inválido');
      return;
    }
    
    console.log('\n✅ Usuário criado com sucesso!');
    console.log('User ID:', data.user?.id);
    console.log('Email:', data.user?.email);
    console.log('Confirmação necessária:', data.user?.confirmed_at ? 'Não' : 'Sim');
    
    if (data.user && !data.user.confirmed_at) {
      console.log('\n⚠️ IMPORTANTE:');
      console.log('Verifique sua caixa de email para confirmar o cadastro.');
      console.log('Se não receber o email, verifique:');
      console.log('1. Pasta de spam');
      console.log('2. Configurações de SMTP no Supabase Dashboard');
      console.log('3. Se email confirmation está habilitado no Supabase');
    }
    
    if (data.session) {
      console.log('\n✅ Usuário já está logado!');
      console.log('Tentando criar perfil...');
      
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: data.user.id,
          full_name: fullName.trim(),
        })
        .select()
        .single();
      
      if (profileError) {
        console.error('❌ Erro ao criar perfil:', profileError.message);
        console.error('Detalhes:', profileError);
      } else {
        console.log('✅ Perfil criado:', profile);
      }
    }
    
  } catch (err) {
    console.error('\n❌ Erro inesperado:', err);
  } finally {
    rl.close();
  }
}

createTestUser();
