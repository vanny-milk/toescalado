import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { notificationService } from '../services/notificationService';
import { useNotificationSound } from './useNotificationSound';
import type { Notification } from '../types/notifications';
import { useAuthUser } from './useNavalHooks';

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { data: authUser } = useAuthUser();
  const { playSound } = useNotificationSound();

  const fetchNotifications = useCallback(async () => {
    if (!authUser?.id) return;
    try {
      const data = await notificationService.listNotifications();
      setNotifications(data);
    } catch (error) {
      console.error('[useNotifications] fetch error:', error);
    } finally {
      setIsLoading(false);
    }
  }, [authUser?.id]);

  const markAsRead = async (id: string) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications(prev => 
        prev.map(n => n.id === id ? { ...n, is_read: true } : n)
      );
    } catch (error) {
      console.error('[useNotifications] markAsRead error:', error);
    }
  };

  const markAllAsRead = async () => {
    if (!authUser?.id) return;
    try {
      await notificationService.markAllAsRead(authUser.id);
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    } catch (error) {
      console.error('[useNotifications] markAllAsRead error:', error);
    }
  };

  useEffect(() => {
    if (!authUser?.id) return;

    fetchNotifications();

    // Inscrição Realtime
    const channel = supabase
      .channel(`notifications:${authUser.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${authUser.id}`
        },
        (payload) => {
          const newNotification = payload.new as Notification;
          setNotifications(prev => [newNotification, ...prev]);
          playSound();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [authUser?.id, fetchNotifications, playSound]);

  const unreadCount = notifications.filter(n => !n.is_read).length;

  return {
    notifications,
    isLoading,
    unreadCount,
    markAsRead,
    markAllAsRead,
    refresh: fetchNotifications
  };
}
