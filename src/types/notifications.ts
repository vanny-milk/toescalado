export type NotificationType = 'event_invite' | 'event_update' | 'system';

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
