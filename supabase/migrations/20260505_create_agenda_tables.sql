-- =====================================================
-- CRIAÇÃO DAS TABELAS DE AGENDA/ESCALA
-- Data: 2026-05-05
-- Descrição: Cria as tabelas de eventos e convidados com RLS
-- =====================================================

-- 1. Criar tabela de eventos
CREATE TABLE IF NOT EXISTS public.events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    type TEXT CHECK (type IN ('reuniao', 'ensaio', 'culto', 'outro')),
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    event_date DATE NOT NULL,
    location TEXT,
    created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Comentários para documentação
COMMENT ON TABLE public.events IS 'Armazena os eventos da agenda/escala';
COMMENT ON COLUMN public.events.type IS 'Tipo do evento: reuniao, ensaio, culto ou outro';

-- 2. Criar tabela de convidados (event_guests)
CREATE TABLE IF NOT EXISTS public.event_guests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID REFERENCES public.events(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    status TEXT CHECK (status IN ('confirmed', 'pending', 'unavailable')) DEFAULT 'pending',
    role TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(event_id, user_id)
);

-- Comentários para documentação
COMMENT ON TABLE public.event_guests IS 'Associação de usuários aos eventos (Escala)';
COMMENT ON COLUMN public.event_guests.status IS 'Status de confirmação: confirmed, pending ou unavailable';

-- 3. Habilitar RLS
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_guests ENABLE ROW LEVEL SECURITY;

-- 4. Criar políticas de segurança para EVENTS

-- Todos os usuários autenticados podem ver todos os eventos
CREATE POLICY "Users can view all events"
ON public.events FOR SELECT
TO authenticated
USING (true);

-- Usuários podem criar eventos
CREATE POLICY "Users can insert events"
ON public.events FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = created_by);

-- Apenas o criador pode atualizar o evento
CREATE POLICY "Creators can update own events"
ON public.events FOR UPDATE
TO authenticated
USING (auth.uid() = created_by)
WITH CHECK (auth.uid() = created_by);

-- Apenas o criador pode deletar o evento
CREATE POLICY "Creators can delete own events"
ON public.events FOR DELETE
TO authenticated
USING (auth.uid() = created_by);

-- 5. Criar políticas de segurança para EVENT_GUESTS

-- Todos os usuários autenticados podem ver os convidados
CREATE POLICY "Users can view all event guests"
ON public.event_guests FOR SELECT
TO authenticated
USING (true);

-- Criadores de eventos podem gerenciar convidados
CREATE POLICY "Event creators can manage guests"
ON public.event_guests
FOR ALL
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.events
        WHERE events.id = event_guests.event_id
        AND events.created_by = auth.uid()
    )
);

-- Convidados podem atualizar seu próprio status
CREATE POLICY "Guests can update own status"
ON public.event_guests FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id AND (role IS NOT DISTINCT FROM role)); -- Garante que só mude status, não role se não for criador

-- 6. Trigger para updated_at em events
CREATE TRIGGER on_event_updated
    BEFORE UPDATE ON public.events
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();
