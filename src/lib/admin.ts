import { supabase } from './supabase';

// Check if user is admin
export const isAdmin = async (userId: string) => {
  const { data, error } = await supabase
    .from('admin_users')
    .select('role')
    .eq('id', userId)
    .eq('is_active', true)
    .single();
  
  if (error && error.code !== 'PGRST116') throw error;
  return !!data;
};

// Get admin stats
export const getAdminStats = async () => {
  const [
    { count: totalUsers },
    { count: activeUsers },
    { count: premiumUsers },
    { count: totalMatches },
    { count: pendingReports },
  ] = await Promise.all([
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('is_active', true),
    supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('is_premium', true),
    supabase.from('matches').select('*', { count: 'exact', head: true }).eq('is_active', true),
    supabase.from('reports').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
  ]);
  
  // Get today's stats
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const { count: newUsersToday } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })
    .gte('created_at', today.toISOString());
  
  const { count: messagesToday } = await supabase
    .from('messages')
    .select('*', { count: 'exact', head: true })
    .gte('created_at', today.toISOString());
  
  // Get revenue
  const { data: payments } = await supabase
    .from('payments')
    .select('amount')
    .eq('status', 'completed')
    .gte('created_at', new Date(new Date().setDate(1)).toISOString()); // This month
  
  const revenue = payments?.reduce((sum, p) => sum + parseFloat(p.amount as string), 0) || 0;
  
  return {
    totalUsers: totalUsers || 0,
    activeUsers: activeUsers || 0,
    premiumUsers: premiumUsers || 0,
    totalMatches: totalMatches || 0,
    pendingReports: pendingReports || 0,
    newUsersToday: newUsersToday || 0,
    messagesToday: messagesToday || 0,
    revenue,
  };
};

// Get all users (admin)
export const adminGetUsers = async (page = 1, limit = 50, search?: string) => {
  let query = supabase
    .from('profiles')
    .select('*, photos (url, is_primary)')
    .order('created_at', { ascending: false })
    .range((page - 1) * limit, page * limit - 1);
  
  if (search) {
    query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%`);
  }
  
  const { data, error, count } = await query;
  
  if (error) throw error;
  return { data, count };
};

// Ban user (admin)
export const adminBanUser = async (userId: string, reason?: string) => {
  const { error } = await supabase
    .from('profiles')
    .update({ is_banned: true, is_active: false })
    .eq('id', userId);
  
  if (error) throw error;
  
  // Log security event
  await supabase.from('security_events').insert({
    user_id: userId,
    event_type: 'user_banned',
    metadata: { reason },
  });
};

// Unban user (admin)
export const adminUnbanUser = async (userId: string) => {
  const { error } = await supabase
    .from('profiles')
    .update({ is_banned: false, is_active: true })
    .eq('id', userId);
  
  if (error) throw error;
};

// Verify user (admin)
export const adminVerifyUser = async (userId: string) => {
  const { error } = await supabase
    .from('profiles')
    .update({ 
      is_verified: true, 
      verification_method: 'admin',
      verification_date: new Date().toISOString() 
    })
    .eq('id', userId);
  
  if (error) throw error;
};

// Get pending reports (admin)
export const adminGetReports = async (status = 'pending') => {
  const { data, error } = await supabase
    .from('reports')
    .select(`
      *,
      reporter:profiles!reporter_id (name, avatar_url),
      reported_user:profiles!reported_user_id (name, avatar_url)
    `)
    .eq('status', status)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data;
};

// Resolve report (admin)
export const adminResolveReport = async (
  reportId: string,
  adminId: string,
  status: 'resolved' | 'dismissed',
  notes?: string
) => {
  const { error } = await supabase
    .from('reports')
    .update({
      status,
      resolved_by: adminId,
      resolved_at: new Date().toISOString(),
      resolution_notes: notes,
    })
    .eq('id', reportId);
  
  if (error) throw error;
};

// Get revenue analytics (admin)
export const adminGetRevenue = async (months = 12) => {
  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - months);
  
  const { data, error } = await supabase
    .from('payments')
    .select('amount, created_at, status')
    .eq('status', 'completed')
    .gte('created_at', startDate.toISOString())
    .order('created_at', { ascending: true });
  
  if (error) throw error;
  
  // Group by month
  const monthly = data?.reduce((acc: any, payment) => {
    const month = new Date(payment.created_at).toLocaleString('default', { month: 'short', year: 'numeric' });
    acc[month] = (acc[month] || 0) + parseFloat(payment.amount as string);
    return acc;
  }, {}) || {};
  
  return monthly;
};

// Get user growth analytics (admin)
export const adminGetUserGrowth = async (days = 30) => {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  
  const { data, error } = await supabase
    .from('profiles')
    .select('created_at')
    .gte('created_at', startDate.toISOString())
    .order('created_at', { ascending: true });
  
  if (error) throw error;
  
  // Group by day
  const daily = data?.reduce((acc: any, profile) => {
    const day = new Date(profile.created_at).toLocaleDateString();
    acc[day] = (acc[day] || 0) + 1;
    return acc;
  }, {}) || {};
  
  return daily;
};
