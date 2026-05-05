import { supabase } from '../lib/supabase';
import type { Notification, CreateNotificationDTO } from '../types/notifications';

export const notificationService = {
  /**
   * Busca as notificações do usuário logado
   */
  async listNotifications(): Promise<Notification[]> {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) {
      console.error('[notificationService.listNotifications] Error:', error);
      throw new Error('Falha ao buscar notificações.');
    }

    return data as Notification[];
  },

  /**
   * Marca uma notificação como lida
   */
  async markAsRead(id: string): Promise<void> {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', id);

    if (error) {
      console.error('[notificationService.markAsRead] Error:', error);
      throw new Error('Falha ao atualizar notificação.');
    }
  },

  /**
   * Marca todas as notificações como lidas para um usuário
   */
  async markAllAsRead(userId: string): Promise<void> {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('user_id', userId)
      .eq('is_read', false);

    if (error) {
      console.error('[notificationService.markAllAsRead] Error:', error);
      throw new Error('Falha ao atualizar notificações.');
    }
  },

  /**
   * Cria uma nova notificação
   */
  async createNotification(notification: CreateNotificationDTO): Promise<void> {
    const { error } = await supabase
      .from('notifications')
      .insert({
        user_id: notification.user_id,
        title: notification.title,
        message: notification.message,
        type: notification.type,
        payload: notification.payload || {},
      });

    if (error) {
      console.error('[notificationService.createNotification] Error:', error);
      // Não lançamos erro aqui para não travar o fluxo principal (ex: criação de evento)
      // mas registramos no console.
    }
  }
};
