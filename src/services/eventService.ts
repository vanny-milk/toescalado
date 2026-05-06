import { supabase } from '../lib/supabase';
import type { EventItem } from '../types/agenda';

export const eventService = {
  /**
   * Lista todos os eventos com seus convidados
   */
  async listEvents(): Promise<EventItem[]> {
    const { data, error } = await supabase
      .from('events')
      .select(`
        id,
        title,
        description,
        type,
        start_time,
        location,
        created_by,
        event_guests (
          id,
          status,
          role,
          user_id,
          profiles (
            id,
            name,
            full_name,
            avatar_url
          )
        )
      `)
      .order('start_time', { ascending: true });

    if (error) {
      console.error('[eventService.listEvents] Error:', error);
      throw new Error('Falha ao buscar eventos.');
    }

    return (data || []).map((event: any) => ({
      id: event.id,
      title: event.title,
      description: event.description,
      type: event.type,
      start: event.start_time,
      location: event.location,
      participants: event.event_guests.map((guest: any) => ({
        id: guest.user_id,
        name: guest.profiles?.name || guest.profiles?.full_name || 'Usuário',
        avatar_url: guest.profiles?.avatar_url,
        status: guest.status,
        role: guest.role,
      })),
    }));
  },

  /**
   * Cria um novo evento e associa os convidados
   */
  async createEvent(event: Omit<EventItem, 'id'>, createdBy: string): Promise<void> {
    if (!createdBy) throw new Error('Usuário não identificado.');

    // 1. Inserir o evento
    const { data: newEvent, error: eventError } = await supabase
      .from('events')
      .insert({
        title: event.title,
        description: event.description || null,
        type: event.type || null,
        start_time: event.start,
        event_date: event.start.split('T')[0],
        location: event.location || null,
        created_by: createdBy,
      })
      .select('id')
      .single();

    if (eventError) {
      console.error('[eventService.createEvent] Error:', eventError);
      throw new Error(`Falha ao criar evento: ${eventError.message}`);
    }

    // 2. Inserir os convidados (O gatilho DB cuidará das notificações)
    if (event.participants && event.participants.length > 0) {
      const guestsToInsert = event.participants.map(p => ({
        event_id: newEvent.id,
        user_id: p.id,
        role: p.role || null,
        status: 'pending',
      }));

      const { error: guestError } = await supabase
        .from('event_guests')
        .insert(guestsToInsert);

      if (guestError) {
        console.error('[eventService.createEvent] Guests Error details:', {
          message: guestError.message,
          details: guestError.details,
          hint: guestError.hint,
          code: guestError.code
        });
        throw new Error(`Evento criado, mas falha ao adicionar convidados: ${guestError.message}`);
      }
    }
  },

  /**
   * Atualiza um evento existente e sincroniza convidados
   */
  async updateEvent(event: EventItem): Promise<void> {
    const { error: eventError } = await supabase
      .from('events')
      .update({
        title: event.title,
        description: event.description || null,
        type: event.type || null,
        start_time: event.start,
        event_date: event.start.split('T')[0],
        location: event.location || null,
      })
      .eq('id', event.id);

    if (eventError) throw new Error(`Falha ao atualizar evento: ${eventError.message}`);

    // Sincronizar convidados
    // 1. Remover convidados que não estão mais na lista
    const currentParticipantIds = event.participants?.map(p => p.id) || [];
    
    if (currentParticipantIds.length > 0) {
      const { error: deleteError } = await supabase
        .from('event_guests')
        .delete()
        .eq('event_id', event.id)
        .not('user_id', 'in', `(${currentParticipantIds.join(',')})`);

      if (deleteError) {
        console.error('[eventService.updateEvent] Delete error:', deleteError);
      }
    } else {
      // Se não tem participantes, remove todos
      await supabase.from('event_guests').delete().eq('event_id', event.id);
    }

    // 2. Upsert convidados (insere novos ou atualiza existentes)
    if (event.participants && event.participants.length > 0) {
      const guestsToUpsert = event.participants.map(p => ({
        event_id: event.id,
        user_id: p.id,
        role: p.role || null,
        status: p.status || 'pending',
      }));

      const { error: upsertError } = await supabase
        .from('event_guests')
        .upsert(guestsToUpsert, { onConflict: 'event_id,user_id' });

      if (upsertError) {
        console.error('[eventService.updateEvent] Upsert error details:', {
          message: upsertError.message,
          details: upsertError.details,
          hint: upsertError.hint,
          code: upsertError.code
        });
        throw new Error(`Falha ao sincronizar convidados: ${upsertError.message}`);
      }
    }
  },

  /**
   * Remove um evento
   */
  async deleteEvent(eventId: string): Promise<void> {
    const { error } = await supabase.from('events').delete().eq('id', eventId);
    if (error) throw new Error('Falha ao remover evento.');
  },

  /**
   * Confirma ou recusa a presença (Gatilho DB cuidará de todas as notificações)
   */
  async confirmAttendance(eventId: string, userId: string, status: 'confirmed' | 'unavailable'): Promise<void> {
    const { error } = await supabase
      .from('event_guests')
      .update({ status })
      .eq('event_id', eventId)
      .eq('user_id', userId);

    if (error) {
      console.error('[eventService.confirmAttendance] Error:', error);
      throw new Error('Falha ao atualizar presença.');
    }
  }
};
