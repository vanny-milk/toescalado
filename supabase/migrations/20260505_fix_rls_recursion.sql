-- =====================================================
-- CORREÇÃO DE RECURSIVIDADE INFINITA NAS POLÍTICAS RLS
-- Data: 2026-05-05
-- Descrição: Remove a dependência circular entre as políticas de 'events' e 'event_guests'
-- =====================================================

-- 1. Funções Auxiliares com SECURITY DEFINER
-- O uso de SECURITY DEFINER permite que a função execute com privilégios de superuser,
-- ignorando o RLS da tabela consultada e quebrando a recursividade.

-- Verifica se o usuário é o criador do evento
CREATE OR REPLACE FUNCTION public.is_event_creator(p_event_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.events
    WHERE id = p_event_id AND created_by = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Verifica se o usuário é um convidado do evento
CREATE OR REPLACE FUNCTION public.is_event_guest(p_event_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.event_guests
    WHERE event_id = p_event_id AND user_id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Atualizar políticas da tabela EVENTS

DROP POLICY IF EXISTS "View events" ON public.events;
CREATE POLICY "View events" ON public.events
FOR SELECT TO authenticated
USING (
  is_admin() OR 
  created_by = auth.uid() OR 
  is_event_guest(id)
);

-- 3. Atualizar políticas da tabela EVENT_GUESTS

DROP POLICY IF EXISTS "View guests" ON public.event_guests;
CREATE POLICY "View guests" ON public.event_guests
FOR SELECT TO authenticated
USING (
  is_admin() OR 
  user_id = auth.uid() OR 
  is_event_creator(event_id)
);

DROP POLICY IF EXISTS "Manage guests" ON public.event_guests;
CREATE POLICY "Manage guests" ON public.event_guests
FOR ALL TO authenticated
USING (
  is_admin() OR 
  is_event_creator(event_id)
);

-- Comentários para documentação
COMMENT ON FUNCTION public.is_event_creator IS 'Verifica se o usuário atual criou o evento, ignorando RLS.';
COMMENT ON FUNCTION public.is_event_guest IS 'Verifica se o usuário atual é convidado do evento, ignorando RLS.';
