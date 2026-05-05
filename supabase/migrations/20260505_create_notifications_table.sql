-- =====================================================
-- CRIAÇÃO DA TABELA DE NOTIFICAÇÕES
-- Data: 2026-05-05
-- Descrição: Tabela para notificações real-time
-- =====================================================

-- 1. Criar tabela de notificações
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT NOT NULL, -- 'event_invite', 'event_update', 'system'
    payload JSONB DEFAULT '{}'::jsonb,
    is_read BOOLEAN DEFAULT false NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Comentários para documentação
COMMENT ON TABLE public.notifications IS 'Armazena notificações dos usuários';
COMMENT ON COLUMN public.notifications.type IS 'Tipo da notificação para lógica de redirecionamento';

-- 2. Habilitar RLS
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- 3. Criar políticas de segurança
-- Usuários podem ver apenas suas próprias notificações
CREATE POLICY "Users can view own notifications"
ON public.notifications FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Usuários podem atualizar suas próprias notificações (marcar como lida)
CREATE POLICY "Users can update own notifications"
ON public.notifications FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Apenas o sistema/serviço pode inserir notificações (usando service_role ou via triggers/functions)
-- Para facilitar o desenvolvimento inicial via frontend (se necessário), permitiremos insert se autenticado
-- Mas em produção isso seria restrito.
CREATE POLICY "Service can insert notifications"
ON public.notifications FOR INSERT
TO authenticated
WITH CHECK (true);

-- 4. Habilitar Realtime para a tabela
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
