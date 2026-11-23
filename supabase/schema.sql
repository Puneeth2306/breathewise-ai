-- ====================================================================
-- BreatheWise AI Database Schema
-- Production PostgreSQL / Supabase Schema with Row Level Security (RLS)
-- ====================================================================

-- 1. Profiles Table (extends auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  city TEXT DEFAULT 'Bengaluru',
  country TEXT DEFAULT 'India',
  latitude NUMERIC(9,6) DEFAULT 12.9716,
  longitude NUMERIC(9,6) DEFAULT 77.5946,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- 2. Family Vulnerability & Household Profiles
CREATE TABLE IF NOT EXISTS public.family_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  infants_or_children BOOLEAN DEFAULT false,
  elderly_members BOOLEAN DEFAULT false,
  pregnant_members BOOLEAN DEFAULT false,
  respiratory_conditions TEXT[] DEFAULT '{}',
  home_ventilation TEXT DEFAULT 'street-facing',
  has_air_purifier BOOLEAN DEFAULT false,
  purifier_type TEXT DEFAULT 'hepa-true',
  cooking_fuel TEXT DEFAULT 'lpg',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.family_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage their own family profile"
  ON public.family_profiles FOR ALL
  USING (auth.uid() = user_id);

-- 3. Lifestyle Preferences & Commute Schedules
CREATE TABLE IF NOT EXISTS public.lifestyle_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  work_start_time TIME DEFAULT '09:00:00',
  work_end_time TIME DEFAULT '18:00:00',
  commute_mode TEXT DEFAULT 'metro',
  commute_distance_km NUMERIC(5,2) DEFAULT 12.00,
  exercise_time_window TEXT DEFAULT 'evening',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.lifestyle_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage their own lifestyle preferences"
  ON public.lifestyle_preferences FOR ALL
  USING (auth.uid() = user_id);

-- 4. AI Conversations & Message Logs
CREATE TABLE IF NOT EXISTS public.ai_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  city_context TEXT,
  aqi_context INT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.ai_conversations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users access their own conversations"
  ON public.ai_conversations FOR ALL
  USING (auth.uid() = user_id OR auth.uid() IS NULL);

-- 5. Daily Planner Recommendations Cache
CREATE TABLE IF NOT EXISTS public.daily_recommendations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  recommendation_date DATE NOT NULL DEFAULT CURRENT_DATE,
  city TEXT NOT NULL,
  us_aqi INT NOT NULL,
  overall_rating TEXT NOT NULL,
  schedule_json JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.daily_recommendations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users read own daily recommendations"
  ON public.daily_recommendations FOR ALL
  USING (auth.uid() = user_id);

-- 6. Sustainability Activities & CO2 Tracker
CREATE TABLE IF NOT EXISTS public.sustainability_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  activity_date DATE NOT NULL DEFAULT CURRENT_DATE,
  activity_type TEXT NOT NULL CHECK (activity_type IN ('metro', 'bus', 'carpool', 'bicycle', 'walking', 'work-from-home')),
  distance_km NUMERIC(6,2) NOT NULL,
  co2_avoided_kg NUMERIC(6,2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.sustainability_activities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own sustainability activities"
  ON public.sustainability_activities FOR ALL
  USING (auth.uid() = user_id OR auth.uid() IS NULL);

-- 7. Community Statistics View / Table (Aggregated, Anonymized)
CREATE TABLE IF NOT EXISTS public.community_stats (
  id INT PRIMARY KEY DEFAULT 1,
  total_members INT DEFAULT 14200,
  total_clean_km NUMERIC(12,2) DEFAULT 328400.00,
  total_co2_avoided_kg NUMERIC(12,2) DEFAULT 48950.00,
  last_updated TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.community_stats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view community stats"
  ON public.community_stats FOR SELECT
  USING (true);
