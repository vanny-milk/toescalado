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

    // Transformar dados do banco para o formato EventItem da UI
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
    if (!createdBy) {
      console.error('[eventService.createEvent] Error: createdBy is missing');
      throw new Error('Usuário não identificado.');
    }

    // 1. Inserir o evento
    const { data: newEvent, error: eventError } = await (supabase
      .from('events') as any)
      .insert({
        title: event.title,
        description: event.description,
        type: event.type,
        start_time: event.start,
        event_date: event.start.split('T')[0],
        location: event.location,
        created_by: createdBy,
      })
      .select('id')
      .single();

    if (eventError) {
      console.error('[eventService.createEvent] Event Error Details:', {
        message: eventError.message,
        details: eventError.details,
        hint: eventError.hint,
        code: eventError.code,
        payload: { title: event.title, created_by: createdBy }
      });
      throw new Error(`Falha ao criar evento: ${eventError.message}`);
    }

    // 2. Inserir os convidados, se houver
    if (event.participants && event.participants.length > 0) {
      const guestsToInsert = event.participants.map(p => ({
        event_id: newEvent.id,
        user_id: p.id,
        role: p.role,
        status: 'pending' as const,
      }));

      const { error: guestError } = await (supabase
        .from('event_guests') as any)
        .insert(guestsToInsert);

      if (guestError) {
        console.error('[eventService.createEvent] Guests Error Details:', {
          message: guestError.message,
          details: guestError.details,
          payload: guestsToInsert
        });
        throw new Error('Evento criado, mas falha ao adicionar convidados.');
      }
    }
  },

  /**
   * Atualiza um evento existente e sincroniza convidados
   */
  async updateEvent(event: EventItem): Promise<void> {
    // 1. Atualizar dados do evento
    const { error: eventError } = await (supabase
      .from('events') as any)
      .update({
        title: event.title,
        description: event.description,
        type: event.type,
        start_time: event.start,
        event_date: event.start.split('T')[0],
        location: event.location,
      })
      .eq('id', event.id);

    if (eventError) {
      console.error('[eventService.updateEvent] Event Error:', eventError);
      throw new Error('Falha ao atualizar evento.');
    }

    // 2. Sincronizar convidados (simplificado: remove todos e insere novamente)
    // Em produção, o ideal seria fazer um "upsert" ou comparar as listas
    const { error: deleteError } = await supabase
      .from('event_guests')
      .delete()
      .eq('event_id', event.id);

    if (deleteError) {
      console.error('[eventService.updateEvent] Delete Guests Error:', deleteError);
      throw new Error('Falha ao sincronizar convidados.');
    }

    if (event.participants && event.participants.length > 0) {
      const guestsToInsert = event.participants.map(p => ({
        event_id: event.id,
        user_id: p.id,
        role: p.role,
        status: p.status || 'pending',
      }));

      const { error: guestError } = await (supabase
        .from('event_guests') as any)
        .insert(guestsToInsert);

      if (guestError) {
        console.error('[eventService.updateEvent] Insert Guests Error:', guestError);
        throw new Error('Evento atualizado, mas falha ao sincronizar novos convidados.');
      }
    }
  },

  /**
   * Remove um evento
   */
  async deleteEvent(eventId: string): Promise<void> {
    const { error } = await supabase
      .from('events')
      .delete()
      .eq('id', eventId);

    if (error) {
      console.error('[eventService.deleteEvent] Error:', error);
      throw new Error('Falha ao remover evento.');
    }
  }
};
