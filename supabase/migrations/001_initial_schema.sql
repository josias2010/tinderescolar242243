-- ========================================
-- NEXORA - Database Schema
-- PostgreSQL + Supabase
-- ========================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ========================================
-- USERS & AUTHENTICATION
-- ========================================

CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  avatar_url TEXT,
  bio TEXT,
  age INTEGER,
  gender TEXT CHECK (gender IN ('male', 'female', 'other', 'non-binary')),
  city TEXT,
  country TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  profession TEXT,
  education TEXT,
  relationship_type TEXT CHECK (relationship_type IN ('serious', 'casual', 'friendship', 'open', 'dating')),
  personality_type TEXT CHECK (personality_type IN ('introvert', 'extrovert', 'ambivert')),
  lifestyle TEXT,
  family_importance TEXT CHECK (family_importance IN ('high', 'medium', 'low')),
  travel_preference TEXT,
  values_in_relationship TEXT,
  date_preference TEXT,
  is_verified BOOLEAN DEFAULT FALSE,
  verification_method TEXT,
  verification_date TIMESTAMP WITH TIME ZONE,
  is_premium BOOLEAN DEFAULT FALSE,
  premium_plan TEXT CHECK (premium_plan IN ('free', 'plus', 'elite')),
  premium_expires_at TIMESTAMP WITH TIME ZONE,
  last_active_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_active BOOLEAN DEFAULT TRUE,
  is_banned BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- PHOTOS
-- ========================================

CREATE TABLE public.photos (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  url TEXT NOT NULL,
  position INTEGER DEFAULT 0,
  is_primary BOOLEAN DEFAULT FALSE,
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- INTERESTS & HOBBIES
-- ========================================

CREATE TABLE public.interests (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  category TEXT,
  icon TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE public.user_interests (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  interest_id UUID REFERENCES public.interests(id) ON DELETE CASCADE NOT NULL,
  UNIQUE(user_id, interest_id)
);

CREATE TABLE public.hobbies (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  category TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE public.user_hobbies (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  hobby_id UUID REFERENCES public.hobbies(id) ON DELETE CASCADE NOT NULL,
  UNIQUE(user_id, hobby_id)
);

CREATE TABLE public.languages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  code TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE public.user_languages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  language_id UUID REFERENCES public.languages(id) ON DELETE CASCADE NOT NULL,
  proficiency TEXT CHECK (proficiency IN ('native', 'fluent', 'intermediate', 'basic')),
  UNIQUE(user_id, language_id)
);

-- ========================================
-- PREFERENCES (What users are looking for)
-- ========================================

CREATE TABLE public.preferences (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL UNIQUE,
  min_age INTEGER DEFAULT 18,
  max_age INTEGER DEFAULT 99,
  max_distance INTEGER DEFAULT 100, -- in km
  interested_in TEXT[] CHECK (interested_in <@ ARRAY['male', 'female', 'other', 'non-binary']),
  relationship_types TEXT[] CHECK (relationship_types <@ ARRAY['serious', 'casual', 'friendship', 'open', 'dating']),
  interests TEXT[],
  languages TEXT[],
  lifestyle TEXT[],
  is_hidden BOOLEAN DEFAULT FALSE,
  show_distance BOOLEAN DEFAULT TRUE,
  show_age BOOLEAN DEFAULT TRUE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- VIBESYNC - Compatibility System
-- ========================================

CREATE TABLE public.vibesync_answers (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  question_id TEXT NOT NULL,
  answer TEXT NOT NULL,
  answer_value INTEGER, -- For scoring
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, question_id)
);

CREATE TABLE public.vibesync_scores (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user1_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  user2_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  overall_score INTEGER NOT NULL CHECK (overall_score >= 0 AND overall_score <= 100),
  values_score INTEGER CHECK (values_score >= 0 AND values_score <= 100),
  lifestyle_score INTEGER CHECK (lifestyle_score >= 0 AND lifestyle_score <= 100),
  interests_score INTEGER CHECK (interests_score >= 0 AND interests_score <= 100),
  communication_score INTEGER CHECK (communication_score >= 0 AND communication_score <= 100),
  goals_score INTEGER CHECK (goals_score >= 0 AND goals_score <= 100),
  social_rhythm_score INTEGER CHECK (social_rhythm_score >= 0 AND social_rhythm_score <= 100),
  relationship_intention_score INTEGER CHECK (relationship_intention_score >= 0 AND relationship_intention_score <= 100),
  match_reasons TEXT[], -- Array of reason strings
  calculated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user1_id, user2_id)
);

-- ========================================
-- MATCHES & LIKES
-- ========================================

CREATE TABLE public.likes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  from_user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  to_user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  is_super_like BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(from_user_id, to_user_id)
);

CREATE TABLE public.matches (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user1_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  user2_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  liked_by_user1_at TIMESTAMP WITH TIME ZONE,
  liked_by_user2_at TIMESTAMP WITH TIME ZONE,
  matched_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_active BOOLEAN DEFAULT TRUE,
  UNIQUE(user1_id, user2_id)
);

-- ========================================
-- MESSAGES & CONVERSATIONS
-- ========================================

CREATE TABLE public.conversations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  match_id UUID REFERENCES public.matches(id) ON DELETE CASCADE NOT NULL UNIQUE,
  is_pinned BOOLEAN DEFAULT FALSE,
  is_muted BOOLEAN DEFAULT FALSE,
  is_archived BOOLEAN DEFAULT FALSE,
  last_message_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE public.messages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  conversation_id UUID REFERENCES public.conversations(id) ON DELETE CASCADE NOT NULL,
  sender_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  message_type TEXT CHECK (message_type IN ('text', 'emoji', 'image', 'voice', 'gif', 'sticker')) DEFAULT 'text',
  media_url TEXT,
  reply_to_id UUID REFERENCES public.messages(id) ON DELETE SET NULL,
  is_edited BOOLEAN DEFAULT FALSE,
  is_deleted BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE public.message_reads (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  message_id UUID REFERENCES public.messages(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  read_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(message_id, user_id)
);

-- ========================================
-- NOTIFICATIONS
-- ========================================

CREATE TABLE public.notifications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  type TEXT CHECK (type IN ('match', 'like', 'super_like', 'message', 'recommendation', 'reminder', 'security', 'system')) NOT NULL,
  title TEXT NOT NULL,
  body TEXT,
  data JSONB, -- Additional data (e.g., from_user_id, match_id)
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- FAVORITES
-- ========================================

CREATE TABLE public.favorites (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  favorite_user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, favorite_user_id)
);

-- ========================================
-- REPORTS & BLOCKS
-- ========================================

CREATE TABLE public.reports (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  reporter_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  reported_user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  reason TEXT CHECK (reason IN ('inappropriate_photos', 'harassment', 'fake_profile', 'spam', 'underage', 'offensive_behavior', 'other')) NOT NULL,
  description TEXT,
  message_id UUID REFERENCES public.messages(id) ON DELETE SET NULL,
  status TEXT CHECK (status IN ('pending', 'reviewing', 'resolved', 'dismissed')) DEFAULT 'pending',
  resolved_by UUID REFERENCES auth.users(id),
  resolved_at TIMESTAMP WITH TIME ZONE,
  resolution_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE public.blocks (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  blocked_user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, blocked_user_id)
);

-- ========================================
-- SUBSCRIPTIONS & PAYMENTS
-- ========================================

CREATE TABLE public.subscriptions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  plan TEXT CHECK (plan IN ('plus', 'elite')) NOT NULL,
  status TEXT CHECK (status IN ('active', 'cancelled', 'past_due', 'trialing')) DEFAULT 'active',
  stripe_subscription_id TEXT UNIQUE,
  stripe_customer_id TEXT,
  current_period_start TIMESTAMP WITH TIME ZONE,
  current_period_end TIMESTAMP WITH TIME ZONE,
  cancelled_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE public.payments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  subscription_id UUID REFERENCES public.subscriptions(id) ON DELETE SET NULL,
  amount DECIMAL(10, 2) NOT NULL,
  currency TEXT DEFAULT 'EUR',
  stripe_payment_id TEXT UNIQUE,
  status TEXT CHECK (status IN ('pending', 'completed', 'failed', 'refunded')) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- BOOSTS
-- ========================================

CREATE TABLE public.boosts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  duration_minutes INTEGER NOT NULL,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  views_count INTEGER DEFAULT 0,
  likes_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- DATE PLANS (First Date Feature)
-- ========================================

CREATE TABLE public.date_plans (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  match_id UUID REFERENCES public.matches(id) ON DELETE CASCADE NOT NULL,
  proposed_by UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  date_type TEXT CHECK (date_type IN ('cafe', 'restaurant', 'walk', 'cinema', 'beach', 'event', 'activity', 'virtual')) NOT NULL,
  title TEXT,
  description TEXT,
  location TEXT,
  scheduled_at TIMESTAMP WITH TIME ZONE,
  status TEXT CHECK (status IN ('proposed', 'accepted', 'declined', 'completed')) DEFAULT 'proposed',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- SECURITY EVENTS
-- ========================================

CREATE TABLE public.security_events (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  ip_address TEXT,
  user_agent TEXT,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- ADMIN USERS
-- ========================================

CREATE TABLE public.admin_users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  role TEXT CHECK (role IN ('super_admin', 'admin', 'moderator', 'support')) NOT NULL,
  permissions JSONB DEFAULT '[]',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- INDEXES (Performance)
-- ========================================

CREATE INDEX idx_profiles_active ON public.profiles(is_active, is_banned) WHERE is_active = TRUE AND is_banned = FALSE;
CREATE INDEX idx_profiles_location ON public.profiles(city, country);
CREATE INDEX idx_profiles_premium ON public.profiles(is_premium) WHERE is_premium = TRUE;
CREATE INDEX idx_likes_from_user ON public.likes(from_user_id);
CREATE INDEX idx_likes_to_user ON public.likes(to_user_id);
CREATE INDEX idx_matches_user1 ON public.matches(user1_id);
CREATE INDEX idx_matches_user2 ON public.matches(user2_id);
CREATE INDEX idx_matches_active ON public.matches(is_active) WHERE is_active = TRUE;
CREATE INDEX idx_messages_conversation ON public.messages(conversation_id, created_at DESC);
CREATE INDEX idx_messages_sender ON public.messages(sender_id);
CREATE INDEX idx_notifications_user ON public.notifications(user_id, is_read, created_at DESC);
CREATE INDEX idx_vibesync_user1 ON public.vibesync_scores(user1_id);
CREATE INDEX idx_vibesync_user2 ON public.vibesync_scores(user2_id);
CREATE INDEX idx_reports_status ON public.reports(status) WHERE status = 'pending';
CREATE INDEX idx_boosts_active ON public.boosts(expires_at) WHERE expires_at > NOW();

-- ========================================
-- ROW LEVEL SECURITY (RLS)
-- ========================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vibesync_scores ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can read all active profiles, update only their own
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles
  FOR SELECT USING (is_active = TRUE AND is_banned = FALSE);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Photos: Public read, owner can manage
CREATE POLICY "Photos are viewable by everyone" ON public.photos
  FOR SELECT USING (TRUE);

CREATE POLICY "Users can manage own photos" ON public.photos
  FOR ALL USING (auth.uid() = user_id);

-- Likes: Owner can manage, target can read
CREATE POLICY "Users can view likes they sent or received" ON public.likes
  FOR SELECT USING (auth.uid() = from_user_id OR auth.uid() = to_user_id);

CREATE POLICY "Users can create likes" ON public.likes
  FOR INSERT WITH CHECK (auth.uid() = from_user_id);

CREATE POLICY "Users can delete own likes" ON public.likes
  FOR DELETE USING (auth.uid() = from_user_id);

-- Matches: Participants can view
CREATE POLICY "Users can view own matches" ON public.matches
  FOR SELECT USING (auth.uid() = user1_id OR auth.uid() = user2_id);

-- Conversations: Participants can view
CREATE POLICY "Users can view own conversations" ON public.conversations
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.matches
      WHERE matches.id = conversations.match_id
      AND (matches.user1_id = auth.uid() OR matches.user2_id = auth.uid())
    )
  );

-- Messages: Conversation participants can view
CREATE POLICY "Users can view messages in their conversations" ON public.messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.conversations
      JOIN public.matches ON matches.id = conversations.match_id
      WHERE conversations.id = messages.conversation_id
      AND (matches.user1_id = auth.uid() OR matches.user2_id = auth.uid())
    )
  );

CREATE POLICY "Users can insert messages in their conversations" ON public.messages
  FOR INSERT WITH CHECK (
    auth.uid() = sender_id AND
    EXISTS (
      SELECT 1 FROM public.conversations
      JOIN public.matches ON matches.id = conversations.match_id
      WHERE conversations.id = conversation_id
      AND (matches.user1_id = auth.uid() OR matches.user2_id = auth.uid())
    )
  );

-- Notifications: Only owner can view
CREATE POLICY "Users can view own notifications" ON public.notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications" ON public.notifications
  FOR UPDATE USING (auth.uid() = user_id);

-- Favorites: Owner can manage
CREATE POLICY "Users can manage own favorites" ON public.favorites
  FOR ALL USING (auth.uid() = user_id);

-- Reports: Reporter can create, admins can manage
CREATE POLICY "Users can create reports" ON public.reports
  FOR INSERT WITH CHECK (auth.uid() = reporter_id);

CREATE POLICY "Users can view own reports" ON public.reports
  FOR SELECT USING (auth.uid() = reporter_id);

-- Blocks: Owner can manage
CREATE POLICY "Users can manage own blocks" ON public.blocks
  FOR ALL USING (auth.uid() = user_id);

-- VibeSync scores: Participants can view
CREATE POLICY "Users can view own vibe sync scores" ON public.vibesync_scores
  FOR SELECT USING (auth.uid() = user1_id OR auth.uid() = user2_id);

-- ========================================
-- FUNCTIONS
-- ========================================

-- Auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'name', 'Usuario'));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Calculate VibeSync score between two users
CREATE OR REPLACE FUNCTION public.calculate_vibesync(user1 UUID, user2 UUID)
RETURNS INTEGER AS $$
DECLARE
  score INTEGER;
  common_interests INTEGER;
  total_interests INTEGER;
BEGIN
  -- Calculate common interests
  SELECT COUNT(*) INTO common_interests
  FROM public.user_interests ui1
  JOIN public.user_interests ui2 ON ui1.interest_id = ui2.interest_id
  WHERE ui1.user_id = user1 AND ui2.user_id = user2;
  
  SELECT COUNT(*) INTO total_interests
  FROM public.user_interests
  WHERE user_id = user1 OR user_id = user2;
  
  -- Base score from interests (40%)
  score := CASE WHEN total_interests > 0 THEN (common_interests::DECIMAL / total_interests * 100 * 0.4)::INTEGER ELSE 0 END;
  
  -- Add compatibility from answers (60%)
  -- This would be more complex in production
  score := score + 50; -- Placeholder
  
  RETURN LEAST(100, GREATEST(0, score));
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update match when both users like each other
CREATE OR REPLACE FUNCTION public.check_for_match()
RETURNS TRIGGER AS $$
DECLARE
  reverse_like_exists BOOLEAN;
  match_id UUID;
BEGIN
  -- Check if reverse like exists
  SELECT EXISTS(
    SELECT 1 FROM public.likes
    WHERE from_user_id = NEW.to_user_id AND to_user_id = NEW.from_user_id
  ) INTO reverse_like_exists;
  
  IF reverse_like_exists THEN
    -- Create match
    INSERT INTO public.matches (user1_id, user2_id, liked_by_user1_at, liked_by_user2_at)
    VALUES (
      LEAST(NEW.from_user_id, NEW.to_user_id),
      GREATEST(NEW.from_user_id, NEW.to_user_id),
      NOW(),
      NOW()
    )
    RETURNING id INTO match_id;
    
    -- Create conversation
    INSERT INTO public.conversations (match_id)
    VALUES (match_id);
    
    -- Calculate VibeSync
    INSERT INTO public.vibesync_scores (user1_id, user2_id, overall_score, match_reasons)
    VALUES (
      LEAST(NEW.from_user_id, NEW.to_user_id),
      GREATEST(NEW.from_user_id, NEW.to_user_id),
      public.calculate_vibesync(LEAST(NEW.from_user_id, NEW.to_user_id), GREATEST(NEW.from_user_id, NEW.to_user_id)),
      ARRAY['Intereses compatibles', 'Valores similares', 'Estilo de vida afín']
    );
    
    -- Send notifications
    INSERT INTO public.notifications (user_id, type, title, body, data)
    VALUES 
      (NEW.from_user_id, 'match', '¡Es Match!', 'Tú y tienen intereses en común', jsonb_build_object('matched_user_id', NEW.to_user_id)),
      (NEW.to_user_id, 'match', '¡Es Match!', 'Tú y tienen intereses en común', jsonb_build_object('matched_user_id', NEW.from_user_id));
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER after_like_insert
  AFTER INSERT ON public.likes
  FOR EACH ROW EXECUTE FUNCTION public.check_for_match();

-- Update last_active_at
CREATE OR REPLACE FUNCTION public.update_last_active()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.profiles SET last_active_at = NOW() WHERE id = auth.uid();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ========================================
-- STORAGE BUCKETS
-- ========================================

-- Create storage buckets for avatars and photos
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', TRUE);

INSERT INTO storage.buckets (id, name, public)
VALUES ('photos', 'photos', TRUE);

-- Storage policies
CREATE POLICY "Avatar images are publicly accessible" ON storage.objects
  FOR SELECT USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload their own avatar" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own avatar" ON storage.objects
  FOR UPDATE USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own avatar" ON storage.objects
  FOR DELETE USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Photos are publicly accessible" ON storage.objects
  FOR SELECT USING (bucket_id = 'photos');

CREATE POLICY "Users can upload their own photos" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'photos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own photos" ON storage.objects
  FOR DELETE USING (bucket_id = 'photos' AND auth.uid()::text = (storage.foldername(name))[1]);

-- ========================================
-- SEED DATA (Optional - for development)
-- ========================================

-- Insert sample interests
INSERT INTO public.interests (name, category) VALUES
  ('Viajes', 'lifestyle'),
  ('Fotografía', 'art'),
  ('Yoga', 'wellness'),
  ('Lectura', 'culture'),
  ('Cocina', 'lifestyle'),
  ('Música', 'art'),
  ('Cine', 'entertainment'),
  ('Deportes', 'fitness'),
  ('Arte', 'art'),
  ('Tecnología', 'tech'),
  ('Naturaleza', 'outdoors'),
  ('Baile', 'art'),
  ('Meditación', 'wellness'),
  ('Senderismo', 'outdoors'),
  ('Surf', 'outdoors'),
  ('Escritura', 'art'),
  ('Gaming', 'tech'),
  ('Moda', 'lifestyle'),
  ('Café', 'food'),
  ('Vino', 'food');

-- Insert sample languages
INSERT INTO public.languages (name, code) VALUES
  ('Español', 'es'),
  ('Inglés', 'en'),
  ('Francés', 'fr'),
  ('Portugués', 'pt'),
  ('Italiano', 'it'),
  ('Alemán', 'de');
