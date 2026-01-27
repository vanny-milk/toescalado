# Diagnóstico do Sistema de Login - Tô Escalado

## Status da Integração com Supabase

### ✅ Verificações Bem-Sucedidas

1. **Credenciais Configuradas**
   - URL: `https://ycptcuhvxbglljsthiec.supabase.co`
   - Anon Key: Configurada corretamente
   - Arquivo `.env` existe e está configurado

2. **Conexão com Supabase**
   - ✅ Conexão estabelecida com sucesso
   - ✅ Serviço de autenticação está acessível
   - ✅ Tabela `profiles` existe e está acessível

3. **Código de Autenticação**
   - ✅ Implementação do `authService` está correta
   - ✅ Métodos de login, registro e recuperação de senha implementados
   - ✅ Tratamento de erros adequado

### ⚠️ Possíveis Problemas Identificados

1. **Tabela Profiles Vazia**
   - A tabela `profiles` existe mas não tem nenhum registro
   - Isso é esperado se você ainda não criou nenhum usuário

2. **Possíveis Causas de Falha no Login**
   
   a) **Nenhum usuário cadastrado**
      - Solução: Criar um usuário de teste
   
   b) **Confirmação de Email Obrigatória**
      - Se habilitado no Supabase, usuários precisam confirmar o email antes de fazer login
      - Verifique em: Supabase Dashboard → Authentication → Settings → Email Auth
   
   c) **Políticas RLS (Row Level Security)**
      - Se RLS estiver habilitado sem políticas adequadas, pode bloquear acesso aos dados
      - Verifique em: Supabase Dashboard → Table Editor → profiles → RLS
   
   d) **Servidor de Desenvolvimento**
      - Certifique-se de que o servidor está rodando na porta correta
      - Use: `npm run dev`

## Como Testar o Sistema de Login

### Opção 1: Criar Usuário de Teste via Script

```bash
node create-test-user.js
```

Siga as instruções para criar um usuário de teste.

### Opção 2: Testar Login com Usuário Existente

```bash
node test-login.js
```

Digite as credenciais de um usuário existente para testar o login.

### Opção 3: Criar Usuário pelo Dashboard do Supabase

1. Acesse: https://supabase.com/dashboard
2. Vá para o projeto: ycptcuhvxbglljsthiec
3. Authentication → Users → Add User
4. Preencha email e senha
5. (Opcional) Marque "Auto Confirm User" para não precisar confirmar email

## Verificações Recomendadas no Supabase Dashboard

### 1. Configurações de Autenticação

**Email Auth:**
- [ ] Email confirmation está configurado?
- [ ] SMTP está configurado para envio de emails?
- [ ] Template de confirmação está ativo?

**Caminho:** Authentication → Settings → Email Auth

### 2. Políticas de Segurança (RLS)

**Tabela profiles:**
```sql
-- Verificar se estas políticas existem:

-- Permitir usuários verem seu próprio perfil
CREATE POLICY "Users can view own profile"
ON profiles FOR SELECT
USING (auth.uid() = id);

-- Permitir usuários criarem seu próprio perfil
CREATE POLICY "Users can insert own profile"
ON profiles FOR INSERT
WITH CHECK (auth.uid() = id);

-- Permitir usuários atualizarem seu próprio perfil
CREATE POLICY "Users can update own profile"
ON profiles FOR UPDATE
USING (auth.uid() = id);
```

**Caminho:** Table Editor → profiles → Policies

### 3. Estrutura da Tabela Profiles

Verifique se a tabela tem estas colunas:
- `id` (uuid, primary key, referencia auth.users)
- `full_name` (text)
- `city` (text, optional)
- `role` (text, optional)
- `created_at` (timestamp)
- `updated_at` (timestamp)

**Caminho:** Table Editor → profiles

## Scripts de Teste Disponíveis

1. **test-supabase.js** - Testa conexão básica com Supabase
2. **test-database.js** - Verifica estrutura do banco de dados
3. **test-login.js** - Testa o processo de login
4. **create-test-user.js** - Cria um usuário de teste

## Solução Rápida

Se você quer testar o sistema imediatamente:

1. **Desabilitar confirmação de email temporariamente:**
   - Supabase Dashboard → Authentication → Settings
   - Desmarque "Enable email confirmations"

2. **Criar um usuário de teste:**
   ```bash
   node create-test-user.js
   ```

3. **Testar o login na aplicação:**
   ```bash
   npm run dev
   ```
   - Acesse http://localhost:5173
   - Use as credenciais criadas

## SQL para Criar/Verificar Políticas RLS

Execute no SQL Editor do Supabase:

```sql
-- Verificar se RLS está habilitado
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' AND tablename = 'profiles';

-- Habilitar RLS se necessário
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Criar políticas (se não existirem)
CREATE POLICY IF NOT EXISTS "Users can view own profile"
ON profiles FOR SELECT
USING (auth.uid() = id);

CREATE POLICY IF NOT EXISTS "Users can insert own profile"
ON profiles FOR INSERT
WITH CHECK (auth.uid() = id);

CREATE POLICY IF NOT EXISTS "Users can update own profile"
ON profiles FOR UPDATE
USING (auth.uid() = id);

-- Verificar políticas existentes
SELECT * FROM pg_policies WHERE tablename = 'profiles';
```

## Checklist de Resolução

- [ ] Variáveis de ambiente configuradas (.env)
- [ ] Conexão com Supabase funcionando
- [ ] Tabela profiles existe
- [ ] RLS configurado corretamente
- [ ] Políticas RLS criadas
- [ ] Email confirmation configurado OU desabilitado
- [ ] Usuário de teste criado
- [ ] Servidor de desenvolvimento rodando
- [ ] Teste de login bem-sucedido

## Próximos Passos

1. Verifique as configurações no Supabase Dashboard
2. Execute os scripts de teste
3. Crie um usuário de teste
4. Teste o login na aplicação
5. Se ainda houver problemas, verifique o console do navegador para erros específicos

## Suporte

Se o problema persistir, forneça:
- Mensagem de erro exata
- Console do navegador (F12 → Console)
- Resposta dos scripts de teste
- Configurações de RLS no Supabase
