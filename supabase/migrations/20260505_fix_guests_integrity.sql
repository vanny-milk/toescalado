-- =====================================================
-- CORREÇÃO: INTEGRIDADE DE CONVIDADOS E UPSERT
-- Data: 2026-05-05
-- =====================================================

-- 1. Adicionar restrição única para evitar duplicados e permitir upsert
ALTER TABLE public.event_guests 
DROP CONSTRAINT IF EXISTS event_guests_event_id_user_id_key;

ALTER TABLE public.event_guests 
ADD CONSTRAINT event_guests_event_id_user_id_key UNIQUE (event_id, user_id);

-- 2. Ajustar trigger de inserção para lidar com UPSERT (caso necessário)
-- O trigger AFTER INSERT já funciona bem para novos registros.

-- 3. Limpar possíveis duplicados antes de aplicar a constraint (opcional, caso já existam)
-- DELETE FROM public.event_guests a USING public.event_guests b
-- WHERE a.id < b.id AND a.event_id = b.event_id AND a.user_id = b.user_id;
