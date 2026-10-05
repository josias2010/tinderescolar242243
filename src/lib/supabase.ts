import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});

// Storage helpers
export const storage = {
  avatars: supabase.storage.from('avatars'),
  photos: supabase.storage.from('photos'),
};

// Realtime channels
export const realtime = {
  messages: (conversationId: string) => 
    supabase.channel(`messages:${conversationId}`),
  notifications: (userId: string) =>
    supabase.channel(`notifications:${userId}`),
  presence: (roomId: string, userId: string) =>
    supabase.channel(`presence:${roomId}`, { config: { presence: { key: userId } } }),
};

// Get current user ID
export const getCurrentUserId = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  return user?.id;
};
