# 🔍 Diagnóstico Rápido - Sistema de Login

## ✅ O que está funcionando:

1. ✅ Conexão com Supabase estabelecida
2. ✅ Credenciais configuradas corretamente
3. ✅ Código de autenticação implementado
4. ✅ Tabela `profiles` existe no banco

## 🔧 Como Resolver o Problema

### Passo 1: Configure as Políticas RLS no Supabase

1. Acesse o [Supabase Dashboard](https://supabase.com/dashboard)
2. Selecione seu projeto
3. Vá em **SQL Editor** (menu lateral)
4. Copie e cole o conteúdo do arquivo `setup-supabase-rls.sql`
5. Clique em **Run** para executar

### Passo 2: Configure a Autenticação por Email

1. No Supabase Dashboard, vá em **Authentication** → **Settings**
2. Role até **Email Auth**
3. **OPÇÃO A - Desabilitar confirmação (para testes):**
   - Desmarque "Enable email confirmations"
   
   **OPÇÃO B - Configurar SMTP (produção):**
   - Configure um servidor SMTP (Gmail, SendGrid, etc.)
   - Mantenha "Enable email confirmations" marcado

### Passo 3: Crie um Usuário de Teste

**Pelo Terminal:**
```bash
node create-test-user.js
```

**OU pelo Dashboard:**
1. Supabase Dashboard → **Authentication** → **Users**
2. Clique em **Add User**
3. Preencha email e senha
4. Marque **Auto Confirm User** (se não tiver SMTP configurado)

### Passo 4: Teste o Login

1. Certifique-se que o servidor está rodando:
   ```bash
   npm run dev
   ```

2. Acesse http://localhost:5173

3. Faça login com as credenciais criadas

## 📋 Scripts de Teste Disponíveis

```bash
# Testar conexão básica
node test-supabase.js

# Verificar estrutura do banco
node test-database.js

# Testar login com credenciais
node test-login.js

# Criar usuário de teste
node create-test-user.js
```

## ⚠️ Problemas Comuns e Soluções

### "Invalid login credentials"
- ✅ Verifique se o usuário foi criado
- ✅ Confirme que o email foi verificado (se confirmação estiver habilitada)
- ✅ Verifique se a senha está correta (mínimo 6 caracteres)

### "Could not access profiles table"
- ✅ Execute o script SQL `setup-supabase-rls.sql`
- ✅ Verifique se RLS está configurado corretamente

### "Email not confirmed"
- ✅ Verifique o email de confirmação na caixa de entrada
- ✅ OU desabilite confirmação de email nas configurações
- ✅ OU marque "Auto Confirm User" ao criar usuário manualmente

### Console do navegador mostra erros
- Abra DevTools (F12)
- Vá na aba Console
- Copie o erro exato e compartilhe

## 🎯 Checklist Rápido

- [ ] Executei `setup-supabase-rls.sql` no Supabase
- [ ] Configurei email confirmation OU desabilitei
- [ ] Criei um usuário de teste
- [ ] Servidor está rodando (`npm run dev`)
- [ ] Testei o login na aplicação

## 📞 Ainda com problemas?

Execute os testes e me forneça:

```bash
# Execute este comando e copie a saída
node test-database.js
```

Também abra o console do navegador (F12 → Console) quando tentar fazer login e copie qualquer erro que aparecer.
