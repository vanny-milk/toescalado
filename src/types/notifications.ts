export type NotificationType = 
  | 'event_invite'          // 1. Novo Convite para Escala (convidado recebe)
  | 'guest_confirmed'       // 2. Fulano aceitou o Convite (anfitrião recebe)
  | 'guest_unavailable'     // 3. Fulano estará indisponível (anfitrião recebe)
  | 'all_guests_confirmed'  // 4. Todos Convidados Confirmados (todos recebem)
  | 'event_today'           // 5. O evento é hoje (todos recebem)
  | 'pending_reminder'      // 6. O evento é daqui X dias e ainda não foram confirmados (anfitrião recebe)
  | 'system';

export interface NotificationPayload {
  event_id?: string;
  external_url?: string;
  [key: string]: any;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: NotificationType;
  payload: NotificationPayload;
  is_read: boolean;
  created_at: string;
}

export interface CreateNotificationDTO {
  user_id: string;
  title: string;
  message: string;
  type: NotificationType;
  payload?: NotificationPayload;
}
