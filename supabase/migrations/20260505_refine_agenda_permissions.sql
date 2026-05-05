-- =====================================================
-- REFINAMENTO DE SEGURANÇA E REGRAS DE ACESSO (AGENDA)
-- Data: 2026-05-05
-- Descrição: Implementa regras de Admin e visibilidade restrita
-- =====================================================

-- 1. Helper para verificar se o usuário é ADMIN
-- Busca na tabela public.profiles o campo role
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Limpar políticas existentes para garantir aplicação limpa
DROP POLICY IF EXISTS "Users can view all events" ON public.events;
DROP POLICY IF EXISTS "Users can insert events" ON public.events;
DROP POLICY IF EXISTS "Creators can update own events" ON public.events;
DROP POLICY IF EXISTS "Creators can delete own events" ON public.events;
DROP POLICY IF EXISTS "View events" ON public.events;
DROP POLICY IF EXISTS "Insert events" ON public.events;
DROP POLICY IF EXISTS "Update events" ON public.events;
DROP POLICY IF EXISTS "Delete events" ON public.events;

-- 3. Novas Políticas para a tabela EVENTS

-- SELECT: Admin vê tudo. Usuário vê apenas o que criou OU onde é convidado.
CREATE POLICY "View events" ON public.events
FOR SELECT TO authenticated
USING (
  is_admin() OR 
  created_by = auth.uid() OR 
  id IN (SELECT event_id FROM public.event_guests WHERE user_id = auth.uid())
);

-- INSERT: Qualquer usuário autenticado pode criar, desde que se defina como criador
CREATE POLICY "Insert events" ON public.events
FOR INSERT TO authenticated
WITH CHECK (auth.uid() = created_by);

-- UPDATE: Admin pode tudo. Usuário comum apenas o que criou.
CREATE POLICY "Update events" ON public.events
FOR UPDATE TO authenticated
USING (is_admin() OR created_by = auth.uid())
WITH CHECK (is_admin() OR created_by = auth.uid());

-- DELETE: Admin pode tudo. Usuário comum apenas o que criou.
CREATE POLICY "Delete events" ON public.events
FOR DELETE TO authenticated
USING (is_admin() OR created_by = auth.uid());


-- 4. Novas Políticas para a tabela EVENT_GUESTS

DROP POLICY IF EXISTS "Users can view all event guests" ON public.event_guests;
DROP POLICY IF EXISTS "Event creators can manage guests" ON public.event_guests;
DROP POLICY IF EXISTS "Guests can update own status" ON public.event_guests;
DROP POLICY IF EXISTS "View guests" ON public.event_guests;
DROP POLICY IF EXISTS "Manage guests" ON public.event_guests;
DROP POLICY IF EXISTS "Update self status" ON public.event_guests;

-- SELECT: Admin vê tudo. Usuário vê apenas seus convites OU convidados de eventos que ele criou.
CREATE POLICY "View guests" ON public.event_guests
FOR SELECT TO authenticated
USING (
  is_admin() OR 
  user_id = auth.uid() OR 
  event_id IN (SELECT id FROM public.events WHERE created_by = auth.uid())
);

-- ALL (Insert/Update/Delete): Admin pode tudo. Criador do evento pode gerenciar os convidados.
CREATE POLICY "Manage guests" ON public.event_guests
FOR ALL TO authenticated
USING (
  is_admin() OR 
  event_id IN (SELECT id FROM public.events WHERE created_by = auth.uid())
);

-- UPDATE (Self status): Convidado pode atualizar apenas seu próprio status de confirmação.
CREATE POLICY "Update self status" ON public.event_guests
FOR UPDATE TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- 5. Garantir que RLS está habilitado
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_guests ENABLE ROW LEVEL SECURITY;
