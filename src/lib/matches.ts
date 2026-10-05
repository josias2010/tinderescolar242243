import { supabase } from './supabase';

export interface Match {
  id: string;
  user1_id: string;
  user2_id: string;
  matched_at: string;
  is_active: boolean;
}

export interface Like {
  id: string;
  from_user_id: string;
  to_user_id: string;
  is_super_like: boolean;
  created_at: string;
}

// Like a user
export const likeUser = async (fromUserId: string, toUserId: string, isSuperLike = false) => {
  const { data, error } = await supabase
    .from('likes')
    .insert({
      from_user_id: fromUserId,
      to_user_id: toUserId,
      is_super_like: isSuperLike,
    })
    .select()
    .single();
  
  if (error) {
    if (error.code === '23505') {
      // Already liked
      return null;
    }
    throw error;
  }
  
  return data as Like;
};

// Unlike a user
export const unlikeUser = async (fromUserId: string, toUserId: string) => {
  const { error } = await supabase
    .from('likes')
    .delete()
    .eq('from_user_id', fromUserId)
    .eq('to_user_id', toUserId);
  
  if (error) throw error;
};

// Check if user was liked by another user
export const hasLikedUser = async (fromUserId: string, toUserId: string) => {
  const { data, error } = await supabase
    .from('likes')
    .select('id')
    .eq('from_user_id', fromUserId)
    .eq('to_user_id', toUserId)
    .single();
  
  if (error && error.code !== 'PGRST116') throw error;
  return !!data;
};

// Get likes received
export const getLikesReceived = async (userId: string) => {
  const { data, error } = await supabase
    .from('likes')
    .select(`
      *,
      from_user:profiles!from_user_id (id, name, avatar_url, age, city)
    `)
    .eq('to_user_id', userId)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data;
};

// Get matches
export const getMatches = async (userId: string) => {
  const { data, error } = await supabase
    .from('matches')
    .select(`
      *,
      user1:profiles!user1_id (id, name, avatar_url, age, city, is_verified),
      user2:profiles!user2_id (id, name, avatar_url, age, city, is_verified),
      vibesync_scores (*)
    `)
    .or(`user1_id.eq.${userId},user2_id.eq.${userId}`)
    .eq('is_active', true)
    .order('matched_at', { ascending: false });
  
  if (error) throw error;
  return data;
};

// Get match by ID
export const getMatch = async (matchId: string) => {
  const { data, error } = await supabase
    .from('matches')
    .select(`
      *,
      user1:profiles!user1_id (*),
      user2:profiles!user2_id (*),
      vibesync_scores (*)
    `)
    .eq('id', matchId)
    .single();
  
  if (error) throw error;
  return data;
};

// Unmatch
export const unmatch = async (matchId: string) => {
  const { error } = await supabase
    .from('matches')
    .update({ is_active: false })
    .eq('id', matchId);
  
  if (error) throw error;
};

// Get VibeSync score between two users
export const getVibeSyncScore = async (user1Id: string, user2Id: string) => {
  const { data, error } = await supabase
    .from('vibesync_scores')
    .select('*')
    .or(`and(user1_id.eq.${user1Id},user2_id.eq.${user2Id}),and(user1_id.eq.${user2Id},user2_id.eq.${user1Id})`)
    .single();
  
  if (error && error.code !== 'PGRST116') throw error;
  return data;
};

// Get daily likes count
export const getDailyLikesCount = async (userId: string) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const { count, error } = await supabase
    .from('likes')
    .select('*', { count: 'exact', head: true })
    .eq('from_user_id', userId)
    .gte('created_at', today.toISOString());
  
  if (error) throw error;
  return count || 0;
};

// Get daily super likes count
export const getDailySuperLikesCount = async (userId: string) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const { count, error } = await supabase
    .from('likes')
    .select('*', { count: 'exact', head: true })
    .eq('from_user_id', userId)
    .eq('is_super_like', true)
    .gte('created_at', today.toISOString());
  
  if (error) throw error;
  return count || 0;
};
