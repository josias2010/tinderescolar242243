import { supabase } from './supabase';

export interface Notification {
  id: string;
  user_id: string;
  type: 'match' | 'like' | 'super_like' | 'message' | 'recommendation' | 'reminder' | 'security' | 'system';
  title: string;
  body?: string;
  data?: any;
  is_read: boolean;
  created_at: string;
}

// Get notifications for a user
export const getNotifications = async (userId: string, limit = 50) => {
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);
  
  if (error) throw error;
  return data as Notification[];
};

// Get unread count
export const getUnreadNotificationsCount = async (userId: string) => {
  const { count, error } = await supabase
    .from('notifications')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('is_read', false);
  
  if (error) throw error;
  return count || 0;
};

// Mark notification as read
export const markAsRead = async (notificationId: string) => {
  const { error } = await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('id', notificationId);
  
  if (error) throw error;
};

// Mark all as read
export const markAllAsRead = async (userId: string) => {
  const { error } = await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('user_id', userId)
    .eq('is_read', false);
  
  if (error) throw error;
};

// Create notification
export const createNotification = async (
  userId: string,
  type: Notification['type'],
  title: string,
  body?: string,
  data?: any
) => {
  const { data: notification, error } = await supabase
    .from('notifications')
    .insert({
      user_id: userId,
      type,
      title,
      body,
      data,
    })
    .select()
    .single();
  
  if (error) throw error;
  return notification as Notification;
};

// Subscribe to real-time notifications
export const subscribeToNotifications = (
  userId: string,
  onNewNotification: (notification: Notification) => void
) => {
  const channel = supabase
    .channel(`notifications:${userId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'notifications',
        filter: `user_id=eq.${userId}`,
      },
      (payload) => {
        onNewNotification(payload.new as Notification);
      }
    )
    .subscribe();
  
  return () => {
    supabase.removeChannel(channel);
  };
};

// Delete notification
export const deleteNotification = async (notificationId: string) => {
  const { error } = await supabase
    .from('notifications')
    .delete()
    .eq('id', notificationId);
  
  if (error) throw error;
};

// Clear all notifications
export const clearAllNotifications = async (userId: string) => {
  const { error } = await supabase
    .from('notifications')
    .delete()
    .eq('user_id', userId);
  
  if (error) throw error;
};
