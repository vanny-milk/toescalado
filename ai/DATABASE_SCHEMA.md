# Estrutura de Dados - Tô Escalado

## Fonte de Verdade: `auth.users`

⚠️ **IMPORTANTE:** A tabela `auth.users` do Supabase Auth é a **fonte de verdade** para dados de usuário.

### Estrutura de `auth.users` (Gerenciada pelo Supabase)

```typescript
interface AuthUser {
  id: string;                              // UUID único do usuário
  email: string | null;                    // Email do usuário
  phone: string | null;                    // Telefone do usuário
  created_at: string;                      // Data de criação
  updated_at: string;                      // Data de última atualização
  last_sign_in_at: string | null;         // Último login
  email_confirmed_at: string | null;       // Data de confirmação do email
  confirmed_at: string | null;             // Data de confirmação geral
  user_metadata: Record<string, any>;      // Metadados customizados do usuário
  app_metadata: Record<string, any>;       // Metadados da aplicação
}
```

### Campos Importantes

- **`id`**: Chave primária, usada como FK em todas as tabelas relacionadas
- **`email`**: Único e obrigatório para autenticação
- **`user_metadata`**: Armazena dados customizados como `full_name`
- **`email_confirmed_at`**: Null se email não foi confirmado

## Tabela `public.profiles`

A tabela `profiles` **estende** `auth.users` com dados específicos do aplicativo.

### Estrutura

```sql
CREATE TABLE public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    full_name TEXT,
    city TEXT,
    role TEXT,
    phone TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);
```

### Tipos TypeScript

```typescript
interface Profile {
  id: string;                    // FK para auth.users(id)
  full_name: string | null;      // Nome completo
  city: string | null;           // Cidade
  role: string | null;           // Papel no sistema
  phone: string | null;          // Telefone
  avatar_url: string | null;     // URL do avatar
  created_at: string;            // Data de criação
  updated_at: string;            // Data de atualização
}
```

## Relacionamento entre Tabelas

```
auth.users (1) ←──── (1) public.profiles
    │
    └─ fonte de verdade para:
       - id
       - email
       - autenticação
       - metadados do usuário
```

### Regras de Integridade

1. ✅ Todo usuário em `auth.users` pode ter 1 perfil em `profiles`
2. ✅ Todo perfil em `profiles` DEVE ter um usuário correspondente em `auth.users`
3. ✅ Se um usuário é deletado de `auth.users`, o perfil é automaticamente deletado (CASCADE)
4. ❌ NUNCA duplique dados de `auth.users` em outras tabelas (violação de DRY)

## Políticas de Segurança (RLS)

### Row Level Security habilitado

```sql
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
```

### Políticas Aplicadas

```sql
-- Usuários podem ver apenas seu próprio perfil
CREATE POLICY "Users can view own profile"
ON public.profiles FOR SELECT
USING (auth.uid() = id);

-- Usuários podem inserir apenas seu próprio perfil
CREATE POLICY "Users can insert own profile"
ON public.profiles FOR INSERT
WITH CHECK (auth.uid() = id);

-- Usuários podem atualizar apenas seu próprio perfil
CREATE POLICY "Users can update own profile"
ON public.profiles FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);
```

## Triggers Automáticos

### 1. Criar perfil ao registrar usuário

```sql
CREATE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'full_name', '')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();
```

### 2. Atualizar timestamp automaticamente

```sql
CREATE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_profile_updated
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();
```

## Acesso aos Dados

### ❌ PROIBIDO

```typescript
// NUNCA acessar Supabase diretamente em componentes
function MyComponent() {
  const { data } = await supabase.from('profiles').select('*'); // ❌ ERRADO
}
```

### ✅ CORRETO

```typescript
// Usar camada de serviço
// src/services/profile.ts
export const profileService = {
  async getProfile(userId: string) {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, full_name, city, role')  // Selecionar apenas campos necessários
      .eq('id', userId)
      .single();
    
    if (error) throw error;
    return data;
  }
};

// src/components/Profile.tsx
function MyComponent() {
  const profile = useProfile(); // Hook que usa o serviço
}
```

## Queries Permitidas

### ✅ Exemplos Corretos

```typescript
// 1. Buscar perfil do usuário logado
const { data } = await supabase
  .from('profiles')
  .select('id, full_name, city, role')  // Apenas campos necessários
  .eq('id', userId)
  .single();

// 2. Atualizar perfil
const { data } = await supabase
  .from('profiles')
  .update({ city: 'São Paulo' })
  .eq('id', userId)
  .select();

// 3. Criar perfil (geralmente feito via trigger)
const { data } = await supabase
  .from('profiles')
  .insert({
    id: userId,
    full_name: 'Nome do Usuário'
  })
  .select();
```

### ❌ Queries Proibidas

```typescript
// ❌ Select * é proibido
const { data } = await supabase
  .from('profiles')
  .select('*');

// ❌ Query sem filtro (pode retornar todos os usuários)
const { data } = await supabase
  .from('profiles')
  .select('full_name');

// ❌ Query dentro de loop
users.forEach(async (user) => {
  const profile = await supabase.from('profiles').select('*').eq('id', user.id);
});
```

## Fluxo de Registro de Usuário

```typescript
// 1. Usuário preenche formulário
const formData = {
  email: 'user@example.com',
  password: 'senha123',
  fullName: 'Nome do Usuário'
};

// 2. authService cria usuário no auth.users
const { data, error } = await supabase.auth.signUp({
  email: formData.email,
  password: formData.password,
  options: {
    data: {
      full_name: formData.fullName  // Salvo em user_metadata
    }
  }
});

// 3. Trigger automático cria registro em profiles
// (handle_new_user é executado automaticamente)

// 4. Usuário recebe email de confirmação (se habilitado)

// 5. Após confirmar email, pode fazer login
```

## Checklist de Conformidade

Ao trabalhar com dados de usuário:

- [ ] Usar `auth.users` como fonte de verdade
- [ ] NUNCA duplicar campos de `auth.users` em `profiles`
- [ ] Sempre usar camada de serviço para acessar dados
- [ ] Selecionar apenas campos necessários (NUNCA `select('*')`)
- [ ] Validar RLS policies antes de fazer queries
- [ ] Usar tipos TypeScript do `src/types/supabase.ts`
- [ ] Documentar motivo de cada query
- [ ] Evitar queries em loops ou renders

## Referências

- Tipos: `src/types/supabase.ts`
- Tipos de Auth: `src/types/auth.ts`
- Serviços: `src/services/auth.ts`
- SQL Setup: `setup-supabase-rls.sql`
- Políticas: `ai/SECURITY_POLICIES.md`
