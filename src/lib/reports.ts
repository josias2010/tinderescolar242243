import { supabase } from './supabase';

export interface Report {
  id: string;
  reporter_id: string;
  reported_user_id: string;
  reason: string;
  description?: string;
  status: 'pending' | 'reviewing' | 'resolved' | 'dismissed';
  created_at: string;
}

export interface Block {
  id: string;
  user_id: string;
  blocked_user_id: string;
  reason?: string;
  created_at: string;
}

// Report a user
export const reportUser = async (
  reporterId: string,
  reportedUserId: string,
  reason: string,
  description?: string
) => {
  const { data, error } = await supabase
    .from('reports')
    .insert({
      reporter_id: reporterId,
      reported_user_id: reportedUserId,
      reason,
      description,
    })
    .select()
    .single();
  
  if (error) throw error;
  return data as Report;
};

// Report a message
export const reportMessage = async (
  reporterId: string,
  reportedUserId: string,
  messageId: string,
  reason: string,
  description?: string
) => {
  const { data, error } = await supabase
    .from('reports')
    .insert({
      reporter_id: reporterId,
      reported_user_id: reportedUserId,
      message_id: messageId,
      reason,
      description,
    })
    .select()
    .single();
  
  if (error) throw error;
  return data as Report;
};

// Get user's reports
export const getMyReports = async (userId: string) => {
  const { data, error } = await supabase
    .from('reports')
    .select('*')
    .eq('reporter_id', userId)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data as Report[];
};

// Block a user
export const blockUser = async (userId: string, blockedUserId: string, reason?: string) => {
  // First, unmatch if they are matched
  const { data: match } = await supabase
    .from('matches')
    .select('id')
    .or(`and(user1_id.eq.${userId},user2_id.eq.${blockedUserId}),and(user1_id.eq.${blockedUserId},user2_id.eq.${userId})`)
    .eq('is_active', true)
    .single();
  
  if (match) {
    await supabase
      .from('matches')
      .update({ is_active: false })
      .eq('id', match.id);
  }
  
  // Remove any likes between them
  await supabase
    .from('likes')
    .delete()
    .or(`and(from_user_id.eq.${userId},to_user_id.eq.${blockedUserId}),and(from_user_id.eq.${blockedUserId},to_user_id.eq.${userId})`);
  
  // Create block
  const { data, error } = await supabase
    .from('blocks')
    .insert({
      user_id: userId,
      blocked_user_id: blockedUserId,
      reason,
    })
    .select()
    .single();
  
  if (error) throw error;
  return data as Block;
};

// Unblock a user
export const unblockUser = async (userId: string, blockedUserId: string) => {
  const { error } = await supabase
    .from('blocks')
    .delete()
    .eq('user_id', userId)
    .eq('blocked_user_id', blockedUserId);
  
  if (error) throw error;
};

// Get blocked users
export const getBlockedUsers = async (userId: string) => {
  const { data, error } = await supabase
    .from('blocks')
    .select(`
      *,
      blocked_user:profiles!blocked_user_id (id, name, avatar_url)
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data;
};

// Check if user is blocked
export const isBlocked = async (userId: string, otherUserId: string) => {
  const { data, error } = await supabase
    .from('blocks')
    .select('id')
    .or(`and(user_id.eq.${userId},blocked_user_id.eq.${otherUserId}),and(user_id.eq.${otherUserId},blocked_user_id.eq.${userId})`)
    .single();
  
  if (error && error.code !== 'PGRST116') throw error;
  return !!data;
};

// Add to favorites
export const addToFavorites = async (userId: string, favoriteUserId: string) => {
  const { data, error } = await supabase
    .from('favorites')
    .insert({
      user_id: userId,
      favorite_user_id: favoriteUserId,
    })
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

// Remove from favorites
export const removeFromFavorites = async (userId: string, favoriteUserId: string) => {
  const { error } = await supabase
    .from('favorites')
    .delete()
    .eq('user_id', userId)
    .eq('favorite_user_id', favoriteUserId);
  
  if (error) throw error;
};

// Get favorites
export const getFavorites = async (userId: string) => {
  const { data, error } = await supabase
    .from('favorites')
    .select(`
      *,
      favorite_user:profiles!favorite_user_id (id, name, avatar_url, age, city, is_verified)
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data;
};

// Check if user is favorited
export const isFavorited = async (userId: string, otherUserId: string) => {
  const { data, error } = await supabase
    .from('favorites')
    .select('id')
    .eq('user_id', userId)
    .eq('favorite_user_id', otherUserId)
    .single();
  
  if (error && error.code !== 'PGRST116') throw error;
  return !!data;
};
