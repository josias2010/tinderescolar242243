import { supabase, storage } from './supabase';

export interface Profile {
  id: string;
  email: string;
  name: string;
  avatar_url?: string;
  bio?: string;
  age?: number;
  gender?: 'male' | 'female' | 'other' | 'non-binary';
  city?: string;
  country?: string;
  profession?: string;
  education?: string;
  relationship_type?: 'serious' | 'casual' | 'friendship' | 'open' | 'dating';
  personality_type?: 'introvert' | 'extrovert' | 'ambivert';
  lifestyle?: string;
  is_verified: boolean;
  is_premium: boolean;
  premium_plan?: 'free' | 'plus' | 'elite';
  last_active_at?: string;
  created_at: string;
}

export interface Photo {
  id: string;
  user_id: string;
  url: string;
  position: number;
  is_primary: boolean;
}

// Get profile by ID
export const getProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  
  if (error) throw error;
  return data as Profile;
};

// Get current user's profile
export const getMyProfile = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');
  
  return getProfile(user.id);
};

// Update profile
export const updateProfile = async (userId: string, updates: Partial<Profile>) => {
  const { data, error } = await supabase
    .from('profiles')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', userId)
    .select()
    .single();
  
  if (error) throw error;
  return data as Profile;
};

// Upload avatar
export const uploadAvatar = async (userId: string, file: File) => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${userId}/avatar.${fileExt}`;
  
  const { data, error } = await storage.avatars.upload(fileName, file, {
    upsert: true,
  });
  
  if (error) throw error;
  
  const { data: { publicUrl } } = storage.avatars.getPublicUrl(fileName);
  
  await updateProfile(userId, { avatar_url: publicUrl });
  
  return publicUrl;
};

// Get user's photos
export const getPhotos = async (userId: string) => {
  const { data, error } = await supabase
    .from('photos')
    .select('*')
    .eq('user_id', userId)
    .order('position');
  
  if (error) throw error;
  return data as Photo[];
};

// Upload photo
export const uploadPhoto = async (userId: string, file: File, position: number) => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${userId}/${Date.now()}.${fileExt}`;
  
  const { data, error } = await storage.photos.upload(fileName, file);
  
  if (error) throw error;
  
  const { data: { publicUrl } } = storage.photos.getPublicUrl(fileName);
  
  const { data: photo, error: photoError } = await supabase
    .from('photos')
    .insert({
      user_id: userId,
      url: publicUrl,
      position,
      is_primary: position === 0,
    })
    .select()
    .single();
  
  if (photoError) throw photoError;
  return photo as Photo;
};

// Delete photo
export const deletePhoto = async (photoId: string) => {
  const { error } = await supabase
    .from('photos')
    .delete()
    .eq('id', photoId);
  
  if (error) throw error;
};

// Discover profiles (with filters)
export const discoverProfiles = async (
  userId: string,
  filters?: {
    minAge?: number;
    maxAge?: number;
    maxDistance?: number;
    gender?: string[];
    interests?: string[];
  }
) => {
  let query = supabase
    .from('profiles')
    .select(`
      *,
      photos (url, position, is_primary),
      user_interests (interests (name)),
      user_languages (languages (name))
    `)
    .neq('id', userId)
    .eq('is_active', true)
    .eq('is_banned', false)
    .order('last_active_at', { ascending: false })
    .limit(50);
  
  if (filters?.minAge) query = query.gte('age', filters.minAge);
  if (filters?.maxAge) query = query.lte('age', filters.maxAge);
  if (filters?.gender && filters.gender.length > 0) {
    query = query.in('gender', filters.gender);
  }
  
  const { data, error } = await query;
  
  if (error) throw error;
  return data;
};

// Get user interests
export const getUserInterests = async (userId: string) => {
  const { data, error } = await supabase
    .from('user_interests')
    .select('interests (name, category)')
    .eq('user_id', userId);
  
  if (error) throw error;
  return data?.map((ui: any) => ui.interests) || [];
};

// Add interest
export const addInterest = async (userId: string, interestId: string) => {
  const { error } = await supabase
    .from('user_interests')
    .insert({ user_id: userId, interest_id: interestId });
  
  if (error) throw error;
};

// Remove interest
export const removeInterest = async (userId: string, interestId: string) => {
  const { error } = await supabase
    .from('user_interests')
    .delete()
    .eq('user_id', userId)
    .eq('interest_id', interestId);
  
  if (error) throw error;
};

// Get all interests
export const getAllInterests = async () => {
  const { data, error } = await supabase
    .from('interests')
    .select('*')
    .order('name');
  
  if (error) throw error;
  return data;
};

// Update preferences
export const updatePreferences = async (userId: string, preferences: any) => {
  const { data, error } = await supabase
    .from('preferences')
    .upsert({ user_id: userId, ...preferences, updated_at: new Date().toISOString() })
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

// Get preferences
export const getPreferences = async (userId: string) => {
  const { data, error } = await supabase
    .from('preferences')
    .select('*')
    .eq('user_id', userId)
    .single();
  
  if (error && error.code !== 'PGRST116') throw error; // PGRST116 = not found
  return data;
};
