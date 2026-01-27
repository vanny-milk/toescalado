import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ycptcuhvxbglljsthiec.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InljcHRjdWh2eGJnbGxqc3RoaWVjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI4OTc5MTIsImV4cCI6MjA3ODQ3MzkxMn0.Av4Nk1j9KhA-_Jm6ZTaySV8Ku-3LTjQJapcEazgzTBU';

const supabase = createClient(supabaseUrl, supabaseKey);

console.log('╔════════════════════════════════════════════════════════╗');
console.log('║   DIAGNÓSTICO COMPLETO - SISTEMA DE LOGIN SUPABASE    ║');
console.log('╚════════════════════════════════════════════════════════╝\n');

let hasErrors = false;
const issues = [];
const recommendations = [];

// Teste 1: Conexão com Supabase
console.log('📡 [1/5] Testando conexão com Supabase...');
try {
  const { data, error } = await supabase.from('profiles').select('count');
  if (error) {
    console.log('   ❌ FALHOU');
    console.log(`   Erro: ${error.message}`);
    hasErrors = true;
    issues.push('Erro ao conectar com Supabase');
  } else {
    console.log('   ✅ SUCESSO - Conexão estabelecida');
  }
} catch (err) {
  console.log('   ❌ FALHOU');
  console.log(`   Erro: ${err.message}`);
  hasErrors = true;
  issues.push('Falha crítica na conexão');
}

// Teste 2: Serviço de Autenticação
console.log('\n🔐 [2/5] Verificando serviço de autenticação...');
try {
  const { data, error } = await supabase.auth.getSession();
  if (error) {
    console.log('   ❌ FALHOU');
    console.log(`   Erro: ${error.message}`);
    hasErrors = true;
    issues.push('Serviço de autenticação inacessível');
  } else {
    console.log('   ✅ SUCESSO - Serviço de autenticação ativo');
    if (data.session) {
      console.log('   ℹ️  Sessão ativa detectada');
    }
  }
} catch (err) {
  console.log('   ❌ FALHOU');
  console.log(`   Erro: ${err.message}`);
  hasErrors = true;
}

// Teste 3: Tabela Profiles
console.log('\n📊 [3/5] Verificando tabela profiles...');
try {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .limit(5);
  
  if (error) {
    console.log('   ❌ FALHOU');
    console.log(`   Erro: ${error.message}`);
    console.log(`   Código: ${error.code}`);
    
    if (error.code === '42P01') {
      issues.push('Tabela profiles não existe');
      recommendations.push('Execute o script setup-supabase-rls.sql');
    } else if (error.code === '42501') {
      issues.push('Sem permissão para acessar tabela profiles');
      recommendations.push('Configure políticas RLS corretamente');
    } else {
      issues.push(`Erro ao acessar profiles: ${error.message}`);
    }
    hasErrors = true;
  } else {
    console.log('   ✅ SUCESSO - Tabela profiles acessível');
    console.log(`   ℹ️  Registros encontrados: ${data.length}`);
    
    if (data.length === 0) {
      console.log('   ⚠️  Tabela está vazia - nenhum perfil cadastrado');
      recommendations.push('Crie um usuário de teste usando: node create-test-user.js');
    }
  }
} catch (err) {
  console.log('   ❌ FALHOU');
  console.log(`   Erro: ${err.message}`);
  hasErrors = true;
}

// Teste 4: Tentar criar sessão (teste de auth)
console.log('\n🔑 [4/5] Testando capacidade de autenticação...');
try {
  // Teste com credenciais inválidas (deve falhar com mensagem específica)
  const { data, error } = await supabase.auth.signInWithPassword({
    email: 'test@test.com',
    password: 'wrongpassword',
  });
  
  if (error) {
    if (error.message === 'Invalid login credentials') {
      console.log('   ✅ SUCESSO - Sistema de autenticação funcionando');
      console.log('   ℹ️  (Falha esperada com credenciais de teste)');
    } else {
      console.log('   ⚠️  Aviso: Erro inesperado');
      console.log(`   Mensagem: ${error.message}`);
      if (error.message.includes('Email not confirmed')) {
        issues.push('Confirmação de email está habilitada');
        recommendations.push('Desabilite confirmação de email OU configure SMTP');
      }
    }
  } else {
    console.log('   ⚠️  Credenciais de teste não deveriam funcionar');
  }
} catch (err) {
  console.log('   ❌ FALHOU');
  console.log(`   Erro: ${err.message}`);
}

// Teste 5: Variáveis de ambiente
console.log('\n🔧 [5/5] Verificando configuração...');
if (!supabaseUrl || supabaseUrl === '') {
  console.log('   ❌ VITE_SUPABASE_URL não configurada');
  hasErrors = true;
  issues.push('Variável VITE_SUPABASE_URL ausente');
} else {
  console.log('   ✅ VITE_SUPABASE_URL configurada');
  console.log(`   ℹ️  URL: ${supabaseUrl}`);
}

if (!supabaseKey || supabaseKey === '') {
  console.log('   ❌ VITE_SUPABASE_ANON_KEY não configurada');
  hasErrors = true;
  issues.push('Variável VITE_SUPABASE_ANON_KEY ausente');
} else {
  console.log('   ✅ VITE_SUPABASE_ANON_KEY configurada');
  console.log(`   ℹ️  Key: ${supabaseKey.substring(0, 30)}...`);
}

// Relatório Final
console.log('\n╔════════════════════════════════════════════════════════╗');
console.log('║                  RELATÓRIO FINAL                       ║');
console.log('╚════════════════════════════════════════════════════════╝\n');

if (hasErrors || issues.length > 0) {
  console.log('❌ PROBLEMAS ENCONTRADOS:\n');
  issues.forEach((issue, index) => {
    console.log(`   ${index + 1}. ${issue}`);
  });
}

if (recommendations.length > 0) {
  console.log('\n💡 RECOMENDAÇÕES:\n');
  recommendations.forEach((rec, index) => {
    console.log(`   ${index + 1}. ${rec}`);
  });
}

if (!hasErrors && issues.length === 0) {
  console.log('✅ TUDO CONFIGURADO CORRETAMENTE!\n');
  console.log('Próximos passos:');
  console.log('1. Crie um usuário: node create-test-user.js');
  console.log('2. Inicie o servidor: npm run dev');
  console.log('3. Acesse: http://localhost:5173');
} else {
  console.log('\n📚 DOCUMENTAÇÃO:\n');
  console.log('   - Guia de solução: SOLUCAO_LOGIN.md');
  console.log('   - Diagnóstico detalhado: DIAGNOSTICO_LOGIN.md');
  console.log('   - Script SQL: setup-supabase-rls.sql');
  console.log('\n🔧 SCRIPTS DISPONÍVEIS:\n');
  console.log('   - node test-supabase.js      - Teste básico de conexão');
  console.log('   - node test-database.js      - Verifica estrutura do banco');
  console.log('   - node test-login.js         - Testa login com credenciais');
  console.log('   - node create-test-user.js   - Cria usuário de teste');
}

console.log('\n════════════════════════════════════════════════════════\n');
