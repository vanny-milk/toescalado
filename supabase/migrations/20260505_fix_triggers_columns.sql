-- =====================================================
-- CORREÇÃO: NOMES DE COLUNAS NOS TRIGGERS
-- Data: 2026-05-05
-- =====================================================

-- 1. Corrigir função fn_notify_on_guest_status_change
-- O campo correto na tabela profiles é 'full_name', não 'name'.
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

    -- Buscar título e criador do evento
    SELECT title, created_by INTO v_event_title, v_event_creator FROM public.events WHERE id = NEW.event_id;
    
    -- CORREÇÃO: Usar full_name em vez de name
    SELECT full_name INTO v_user_name FROM public.profiles WHERE id = NEW.user_id;
    
    -- Notificar Anfitrião
    INSERT INTO public.notifications (user_id, title, message, type, payload)
    VALUES (
        v_event_creator,
        CASE WHEN NEW.status = 'confirmed' THEN 'Convite Aceito' ELSE 'Convidado Indisponível' END,
        COALESCE(v_user_name, 'Um convidado') || ' ' || (CASE WHEN NEW.status = 'confirmed' THEN 'aceitou' ELSE 'recusou' END) || ' o convite para o evento: ' || v_event_title,
        CASE WHEN NEW.status = 'confirmed' THEN 'guest_confirmed' ELSE 'guest_unavailable' END,
        jsonb_build_object('event_id', NEW.event_id)
    );

    -- Verificar se todos confirmaram
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
