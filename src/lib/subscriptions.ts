import { supabase } from './supabase';

export interface Subscription {
  id: string;
  user_id: string;
  plan: 'plus' | 'elite';
  status: 'active' | 'cancelled' | 'past_due' | 'trialing';
  current_period_start?: string;
  current_period_end?: string;
  cancelled_at?: string;
}

// Get user's subscription
export const getSubscription = async (userId: string) => {
  const { data, error } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', userId)
    .eq('status', 'active')
    .single();
  
  if (error && error.code !== 'PGRST116') throw error;
  return data as Subscription | null;
};

// Create checkout session (would call Edge Function in production)
export const createCheckoutSession = async (
  userId: string,
  plan: 'plus' | 'elite',
  billingCycle: 'monthly' | 'quarterly' | 'annual'
) => {
  // In production, this would call an Edge Function that creates a Stripe Checkout session
  const { data, error } = await supabase.functions.invoke('create-checkout-session', {
    body: { userId, plan, billingCycle },
  });
  
  if (error) throw error;
  return data; // Returns { url: 'https://checkout.stripe.com/...' }
};

// Create billing portal session
export const createBillingPortalSession = async (userId: string) => {
  const { data, error } = await supabase.functions.invoke('create-billing-portal', {
    body: { userId },
  });
  
  if (error) throw error;
  return data; // Returns { url: 'https://billing.stripe.com/...' }
};

// Cancel subscription
export const cancelSubscription = async (subscriptionId: string) => {
  const { data, error } = await supabase.functions.invoke('cancel-subscription', {
    body: { subscriptionId },
  });
  
  if (error) throw error;
  return data;
};

// Get payment history
export const getPaymentHistory = async (userId: string) => {
  const { data, error } = await supabase
    .from('payments')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data;
};

// Check if user has premium access
export const hasPremiumAccess = async (userId: string): Promise<{ hasAccess: boolean; plan?: string }> => {
  const subscription = await getSubscription(userId);
  
  if (!subscription) {
    return { hasAccess: false };
  }
  
  return {
    hasAccess: subscription.status === 'active',
    plan: subscription.plan,
  };
};

// Get subscription limits based on plan
export const getSubscriptionLimits = (plan: 'free' | 'plus' | 'elite') => {
  const limits = {
    free: {
      dailyLikes: 15,
      weeklySuperLikes: 3,
      canSeeWhoLikedYou: false,
      canUseAdvancedFilters: false,
      canRewind: false,
      hasAds: true,
      boostsPerMonth: 0,
    },
    plus: {
      dailyLikes: Infinity,
      weeklySuperLikes: 5,
      canSeeWhoLikedYou: true,
      canUseAdvancedFilters: true,
      canRewind: true,
      hasAds: false,
      boostsPerMonth: 2,
    },
    elite: {
      dailyLikes: Infinity,
      weeklySuperLikes: 10,
      canSeeWhoLikedYou: true,
      canUseAdvancedFilters: true,
      canRewind: true,
      hasAds: false,
      boostsPerMonth: 4,
      priorityInDiscovery: true,
      profileHighlight: true,
    },
  };
  
  return limits[plan];
};
