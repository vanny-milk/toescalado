import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from 'jsr:@supabase/supabase-js@2';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

Deno.serve(async (req) => {
  try {
    const today = new Date().toISOString().split('T')[0];

    // 1. Notificar: "O evento é hoje" (Ponto 5)
    const { data: todayEvents } = await supabase
      .from('events')
      .select('id, title, created_by, event_guests(user_id)')
      .eq('event_date', today);

    if (todayEvents) {
      for (const event of todayEvents) {
        const recipients = [
          event.created_by,
          ...(event.event_guests?.map((g: any) => g.user_id) || [])
        ];

        for (const userId of [...new Set(recipients)]) {
          await supabase.from('notifications').insert({
            user_id: userId,
            title: 'O evento é hoje! 📅',
            message: `Lembrete: O evento "${event.title}" acontece hoje.`,
            type: 'event_today',
            payload: { event_id: event.id }
          });
        }
      }
    }

    // 2. Notificar: Lembrete de confirmações pendentes (Ponto 6)
    // Buscamos eventos nos próximos 3 dias que ainda tenham convidados pendentes
    const threeDaysFromNow = new Date();
    threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);
    const threeDaysStr = threeDaysFromNow.toISOString().split('T')[0];

    const { data: upcomingEvents } = await supabase
      .from('events')
      .select('id, title, created_by, event_guests(user_id, status)')
      .gte('event_date', today)
      .lte('event_date', threeDaysStr);

    if (upcomingEvents) {
      for (const event of upcomingEvents) {
        const pendingGuests = event.event_guests?.filter((g: any) => g.status === 'pending') || [];
        
        if (pendingGuests.length > 0) {
          const daysToEvent = Math.ceil((new Date(event.event_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
          
          await supabase.from('notifications').insert({
            user_id: event.created_by,
            title: 'Confirmações Pendentes ⏳',
            message: `O evento "${event.title}" é em ${daysToEvent} dias e ainda há convidados que não confirmaram.`,
            type: 'pending_reminder',
            payload: { event_id: event.id }
          });
        }
      }
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
});
