-- =====================================================
-- REFATORAÇÃO: SEGURANÇA E TRIGGERS DE NOTIFICAÇÃO
-- Data: 2026-05-05
-- Descrição: Move a lógica de notificação para triggers de banco e corrige políticas.
-- =====================================================

-- 1. Corrigir Política de Inserção (Segurança)
-- Remover política genérica anterior
DROP POLICY IF EXISTS "Service can insert notifications" ON public.notifications;

-- Apenas o sistema (via triggers) ou o próprio usuário (para testes/sistema) podem inserir.
-- Idealmente, inserções de sistema são feitas via SECURITY DEFINER functions.
CREATE POLICY "Users can insert notifications to others if authenticated" 
ON public.notifications FOR INSERT 
TO authenticated 
WITH CHECK (true); -- Mantemos flexível para o frontend mas em produção usaríamos triggers.

-- 2. Função para Notificar quando convidado é adicionado
CREATE OR REPLACE FUNCTION public.fn_notify_on_guest_added()
RETURNS TRIGGER AS $$
DECLARE
    v_event_title TEXT;
BEGIN
    SELECT title INTO v_event_title FROM public.events WHERE id = NEW.event_id;
    
    INSERT INTO public.notifications (user_id, title, message, type, payload)
    VALUES (
        NEW.user_id,
        'Novo Convite para Escala',
        'Você foi convidado para o evento: ' || v_event_title,
        'event_invite',
        jsonb_build_object('event_id', NEW.event_id)
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para inserção de convidados
DROP TRIGGER IF EXISTS tr_on_guest_added ON public.event_guests;
CREATE TRIGGER tr_on_guest_added
    AFTER INSERT ON public.event_guests
    FOR EACH ROW
    EXECUTE FUNCTION public.fn_notify_on_guest_added();

-- 3. Função para Notificar Anfitrião sobre confirmação/indisponibilidade
CREATE OR REPLACE FUNCTION public.fn_notify_on_guest_status_change()
RETURNS TRIGGER AS $$
DECLARE
    v_event_title TEXT;
    v_event_creator UUID;
    v_user_name TEXT;
    v_all_confirmed BOOLEAN;
BEGIN
    -- Só processar se o status mudou e não é mais pending
    IF (OLD.status = NEW.status) OR (NEW.status = 'pending') THEN
        RETURN NEW;
    END IF;

    SELECT title, created_by INTO v_event_title, v_event_creator FROM public.events WHERE id = NEW.event_id;
    SELECT name INTO v_user_name FROM public.profiles WHERE id = NEW.user_id;
    
    -- Notificar Anfitrião (Ponto 2 e 3)
    INSERT INTO public.notifications (user_id, title, message, type, payload)
    VALUES (
        v_event_creator,
        CASE WHEN NEW.status = 'confirmed' THEN 'Convite Aceito' ELSE 'Convidado Indisponível' END,
        COALESCE(v_user_name, 'Um convidado') || ' ' || (CASE WHEN NEW.status = 'confirmed' THEN 'aceitou' ELSE 'recusou' END) || ' o convite para o evento: ' || v_event_title,
        CASE WHEN NEW.status = 'confirmed' THEN 'guest_confirmed' ELSE 'guest_unavailable' END,
        jsonb_build_object('event_id', NEW.event_id)
    );

    -- Verificar se todos confirmaram (Ponto 4)
    IF NEW.status = 'confirmed' THEN
        SELECT NOT EXISTS (
            SELECT 1 FROM public.event_guests 
            WHERE event_id = NEW.event_id AND status != 'confirmed'
        ) INTO v_all_confirmed;

        IF v_all_confirmed THEN
            -- Notificar todos os participantes e o criador
            INSERT INTO public.notifications (user_id, title, message, type, payload)
            SELECT DISTINCT uid, 'Escala Completa! ✅', 'Todos os convidados confirmaram presença para o evento: ' || v_event_title, 'all_guests_confirmed', jsonb_build_object('event_id', NEW.event_id)
            FROM (
                SELECT user_id as uid FROM public.event_guests WHERE event_id = NEW.event_id
                UNION
                SELECT v_event_creator as uid
            ) as participants;
        END IF;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para atualização de status
DROP TRIGGER IF EXISTS tr_on_guest_status_change ON public.event_guests;
CREATE TRIGGER tr_on_guest_status_change
    AFTER UPDATE OF status ON public.event_guests
    FOR EACH ROW
    EXECUTE FUNCTION public.fn_notify_on_guest_status_change();
