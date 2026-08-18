-- ==========================================
-- ANNAPURNA Campus Food Operations Platform
-- Comprehensive Supabase Database Schema & RLS Policies
-- ==========================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. ENUMS
CREATE TYPE user_role AS ENUM ('student', 'authority');
CREATE TYPE meal_type AS ENUM ('breakfast', 'lunch', 'snacks', 'dinner');
CREATE TYPE meal_status AS ENUM ('draft', 'published', 'open', 'closed', 'cancelled');
CREATE TYPE quantity_feedback AS ENUM ('too_little', 'just_right', 'too_much');

-- 3. PROFILES TABLE (Extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role user_role NOT NULL DEFAULT 'student',
  name TEXT NOT NULL,
  student_id TEXT,
  hostel TEXT,
  block TEXT,
  dietary_pref TEXT DEFAULT 'Vegetarian',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. MESSES TABLE
CREATE TABLE IF NOT EXISTS public.messes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  capacity INT DEFAULT 500,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. MEALS TABLE
CREATE TABLE IF NOT EXISTS public.meals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  date DATE NOT NULL,
  meal_type meal_type NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  items TEXT[] DEFAULT '{}',
  image_url TEXT,
  mess_id UUID REFERENCES public.messes(id) ON DELETE CASCADE,
  open_time TIME NOT NULL,
  close_time TIME NOT NULL,
  expected_qty INT NOT NULL DEFAULT 400,
  price NUMERIC(10,2) DEFAULT 0.00,
  status meal_status DEFAULT 'draft',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. MEAL SESSIONS (Dynamic QR Validation)
CREATE TABLE IF NOT EXISTS public.meal_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  meal_id UUID NOT NULL REFERENCES public.meals(id) ON DELETE CASCADE,
  session_token TEXT UNIQUE NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. CHECKINS TABLE (Turnstile Check-in Logs)
CREATE TABLE IF NOT EXISTS public.checkins (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  meal_id UUID NOT NULL REFERENCES public.meals(id) ON DELETE CASCADE,
  checked_in_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(student_id, meal_id) -- Blocks duplicate check-ins per meal
);

-- 8. REVIEWS TABLE (Multi-attribute Post-meal Feedback)
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  meal_id UUID NOT NULL REFERENCES public.meals(id) ON DELETE CASCADE,
  stars INT CHECK (stars >= 1 AND stars <= 5),
  quantity_feedback quantity_feedback DEFAULT 'just_right',
  taste_rating INT CHECK (taste_rating >= 1 AND taste_rating <= 5),
  quality_rating INT CHECK (quality_rating >= 1 AND quality_rating <= 5),
  temperature_rating INT CHECK (temperature_rating >= 1 AND temperature_rating <= 5),
  variety_rating INT CHECK (variety_rating >= 1 AND variety_rating <= 5),
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(student_id, meal_id)
);

-- 9. CONSUMPTION TABLE (Post-meal Operational Entry)
CREATE TABLE IF NOT EXISTS public.consumption (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  meal_id UUID UNIQUE NOT NULL REFERENCES public.meals(id) ON DELETE CASCADE,
  prepared INT NOT NULL,
  served INT NOT NULL,
  remaining INT NOT NULL,
  wasted INT NOT NULL,
  redistributed INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. SURPLUS TABLE (Food Rescue & Redistribution)
CREATE TABLE IF NOT EXISTS public.surplus (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  meal_id UUID REFERENCES public.meals(id) ON DELETE CASCADE,
  food TEXT NOT NULL,
  quantity INT NOT NULL, -- portions/kg
  prep_time TIMESTAMPTZ NOT NULL,
  temperature TEXT DEFAULT 'Hot (>60C)',
  storage_condition TEXT DEFAULT 'Stainless Steel Insulated Container',
  packaging TEXT DEFAULT 'Sealed Bulk Containers',
  pickup_deadline TIMESTAMPTZ NOT NULL,
  location TEXT NOT NULL,
  safety_verified BOOLEAN DEFAULT FALSE,
  matched_recipient TEXT,
  pickup_confirmed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. FORECASTS VIEW (Calculated Demand Predictor)
CREATE OR REPLACE VIEW public.forecasts AS
SELECT 
  m.id AS meal_id,
  m.date,
  m.meal_type,
  m.name AS meal_name,
  m.mess_id,
  m.expected_qty,
  COALESCE(COUNT(c.id), 0) AS historical_attendance,
  ROUND(COALESCE(COUNT(c.id)::NUMERIC / NULLIF(m.expected_qty, 0), 0.85) * 100, 1) AS participation_rate,
  ROUND(m.expected_qty * 0.92) AS predicted_demand,
  ROUND(m.expected_qty * 0.94) AS recommended_prep_qty
FROM public.meals m
LEFT JOIN public.checkins c ON c.meal_id = m.id
GROUP BY m.id, m.date, m.meal_type, m.name, m.mess_id, m.expected_qty;

-- ==========================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==========================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meal_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.checkins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.consumption ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.surplus ENABLE ROW LEVEL SECURITY;

-- Helper function to get current user role
CREATE OR REPLACE FUNCTION public.get_auth_role()
RETURNS user_role AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- PROFILES POLICIES
CREATE POLICY "Public profiles reading" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- MESSES POLICIES
CREATE POLICY "Anyone can view messes" ON public.messes FOR SELECT USING (true);
CREATE POLICY "Authorities manage messes" ON public.messes FOR ALL USING (public.get_auth_role() = 'authority');

-- MEALS POLICIES
-- Students only see published, open, or closed meals (never drafts)
CREATE POLICY "Students view non-draft meals" ON public.meals FOR SELECT 
  USING (status IN ('published', 'open', 'closed') OR public.get_auth_role() = 'authority');
CREATE POLICY "Authorities manage meals" ON public.meals FOR ALL 
  USING (public.get_auth_role() = 'authority');

-- MEAL SESSIONS POLICIES
CREATE POLICY "Authenticated users view active sessions" ON public.meal_sessions FOR SELECT USING (true);
CREATE POLICY "Authorities manage sessions" ON public.meal_sessions FOR ALL USING (public.get_auth_role() = 'authority');

-- CHECKINS POLICIES
CREATE POLICY "Students view own checkins" ON public.checkins FOR SELECT USING (student_id = auth.uid() OR public.get_auth_role() = 'authority');
CREATE POLICY "Students insert checkin" ON public.checkins FOR INSERT WITH CHECK (student_id = auth.uid());

-- REVIEWS POLICIES
CREATE POLICY "Anyone views reviews" ON public.reviews FOR SELECT USING (true);
CREATE POLICY "Students manage own reviews" ON public.reviews FOR ALL USING (student_id = auth.uid());

-- CONSUMPTION & SURPLUS POLICIES
CREATE POLICY "Anyone views consumption" ON public.consumption FOR SELECT USING (true);
CREATE POLICY "Authorities manage consumption" ON public.consumption FOR ALL USING (public.get_auth_role() = 'authority');

CREATE POLICY "Anyone views surplus" ON public.surplus FOR SELECT USING (true);
CREATE POLICY "Authorities manage surplus" ON public.surplus FOR ALL USING (public.get_auth_role() = 'authority');

-- ==========================================
-- REALTIME SETUP
-- ==========================================
BEGIN;
  DROP PUBLICATION IF EXISTS supabase_realtime;
  CREATE PUBLICATION supabase_realtime FOR TABLE checkins, meals, meal_sessions, reviews;
COMMIT;
