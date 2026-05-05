-- =====================================================
-- CORREÇÃO: COLUNA PAYLOAD NA TABELA DE NOTIFICAÇÕES
-- Data: 2026-05-05
-- =====================================================

-- 1. Adicionar coluna payload se ela não existir
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='notifications' AND column_name='payload') THEN
        ALTER TABLE public.notifications ADD COLUMN payload JSONB DEFAULT '{}'::jsonb;
    END IF;
END $$;

-- 2. Garantir que as notificações antigas tenham um payload vazio se necessário
UPDATE public.notifications SET payload = '{}'::jsonb WHERE payload IS NULL;
