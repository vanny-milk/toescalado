import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ycptcuhvxbglljsthiec.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InljcHRjdWh2eGJnbGxqc3RoaWVjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI4OTc5MTIsImV4cCI6MjA3ODQ3MzkxMn0.Av4Nk1j9KhA-_Jm6ZTaySV8Ku-3LTjQJapcEazgzTBU';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkDatabase() {
  console.log('\n=== Verificação da Estrutura do Banco de Dados ===\n');
  
  // Verificar se a tabela profiles existe
  console.log('1. Verificando tabela profiles...');
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .limit(1);
    
    if (error) {
      console.error('❌ Erro ao acessar tabela profiles:');
      console.error('Código:', error.code);
      console.error('Mensagem:', error.message);
      console.error('Detalhes:', error.details);
      console.error('Dica:', error.hint);
    } else {
      console.log('✅ Tabela profiles está acessível');
      console.log('Estrutura de exemplo:', data.length > 0 ? data[0] : 'Tabela vazia');
    }
  } catch (err) {
    console.error('❌ Erro inesperado:', err);
  }
  
  // Verificar usuários
  console.log('\n2. Verificando usuários registrados...');
  try {
    const { data: users, error } = await supabase.auth.admin.listUsers();
    
    if (error) {
      console.log('⚠️ Não é possível listar usuários (requer permissões de admin)');
    } else {
      console.log(`✅ Total de usuários: ${users.users?.length || 0}`);
    }
  } catch (err) {
    console.log('⚠️ Listagem de usuários requer permissões de admin');
  }
  
  // Verificar se auth está funcionando
  console.log('\n3. Verificando serviço de autenticação...');
  try {
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('❌ Erro ao verificar sessão:', error.message);
    } else {
      console.log('✅ Serviço de autenticação está ativo');
      console.log('Sessão atual:', data.session ? 'Ativa' : 'Nenhuma');
    }
  } catch (err) {
    console.error('❌ Erro:', err);
  }
  
  console.log('\n=== Diagnóstico Completo ===\n');
  console.log('Problemas comuns:');
  console.log('1. Se a tabela profiles não existe, você precisa criá-la');
  console.log('2. Se RLS está habilitado mas sem políticas, usuários não conseguem acessar dados');
  console.log('3. Verifique se o email confirmation está habilitado nas configurações do Supabase');
  console.log('\nPara testar o login, execute: node test-login.js');
}

checkDatabase();
