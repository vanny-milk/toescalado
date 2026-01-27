-- =====================================================
-- CONFIGURAÇÃO DE SEGURANÇA PARA TABELA PROFILES
-- Execute este script no SQL Editor do Supabase
-- =====================================================

-- 1. Verificar se a tabela profiles existe
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' 
AND table_name = 'profiles'
ORDER BY ordinal_position;

-- 2. Criar tabela profiles se não existir
-- Tabela profiles estende auth.users com dados adicionais do aplicativo
-- IMPORTANTE: id referencia auth.users(id) - auth.users é a fonte de verdade
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    full_name TEXT,
    city TEXT,
    role TEXT,
    phone TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Comentários para documentação
COMMENT ON TABLE public.profiles IS 'Perfis de usuários - estende auth.users com dados específicos do app';
COMMENT ON COLUMN public.profiles.id IS 'FK para auth.users.id - cada perfil corresponde a exatamente um usuário';
COMMENT ON COLUMN public.profiles.full_name IS 'Nome completo do usuário';
COMMENT ON COLUMN public.profiles.city IS 'Cidade do usuário';
COMMENT ON COLUMN public.profiles.role IS 'Papel do usuário no sistema';
COMMENT ON COLUMN public.profiles.phone IS 'Telefone do usuário (duplicado de auth.users para conveniência)';
COMMENT ON COLUMN public.profiles.avatar_url IS 'URL do avatar do usuário';

-- 3. Habilitar Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 4. Remover políticas antigas (se existirem)
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;

-- 5. Criar políticas de segurança

-- Permitir que usuários vejam seu próprio perfil
CREATE POLICY "Users can view own profile"
ON public.profiles
FOR SELECT
USING (auth.uid() = id);

-- Permitir que usuários criem seu próprio perfil
CREATE POLICY "Users can insert own profile"
ON public.profiles
FOR INSERT
WITH CHECK (auth.uid() = id);

-- Permitir que usuários atualizem seu próprio perfil
CREATE POLICY "Users can update own profile"
ON public.profiles
FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- OPCIONAL: Permitir que todos vejam perfis públicos (descomente se necessário)
-- CREATE POLICY "Public profiles are viewable by everyone"
-- ON public.profiles
-- FOR SELECT
-- USING (true);

-- 6. Criar função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 7. Criar trigger para atualizar updated_at
DROP TRIGGER IF EXISTS on_profile_updated ON public.profiles;
CREATE TRIGGER on_profile_updated
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- 8. Criar função para criar perfil automaticamente ao registrar
CREATE OR REPLACE FUNCTION public.handle_new_user()
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

-- 9. Criar trigger para criar perfil automaticamente
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- 10. Verificar políticas criadas
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE schemaname = 'public' AND tablename = 'profiles';

-- 11. Verificar RLS está habilitado
SELECT 
    tablename,
    rowsecurity
FROM pg_tables
WHERE schemaname = 'public' AND tablename = 'profiles';

-- =====================================================
-- COMANDOS ÚTEIS PARA TESTE
-- =====================================================

-- Listar todos os perfis (deve retornar apenas o perfil do usuário logado)
-- SELECT * FROM profiles;

-- Inserir perfil manualmente (apenas para teste)
-- INSERT INTO profiles (id, full_name, city, role)
-- VALUES (auth.uid(), 'Teste User', 'São Paulo', 'admin');

-- Verificar usuários cadastrados (requer permissões de service_role)
-- SELECT id, email, created_at, confirmed_at FROM auth.users;
