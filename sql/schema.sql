-- ==========================================
-- Quickmind Database Schema
-- ==========================================

-- PROFILES (extends auth.users)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  display_name TEXT,
  avatar_url TEXT,
  xp INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- BADGES (static catalog)
CREATE TABLE public.badges (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('lesson', 'mathlympics', 'milestone')),
  xp_reward INTEGER DEFAULT 0
);

-- USER_BADGES (many-to-many junction)
CREATE TABLE public.user_badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  badge_id TEXT NOT NULL REFERENCES public.badges(id),
  earned_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, badge_id)
);

-- LESSONS (static curriculum catalog)
CREATE TABLE public.lessons (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  sort_order INTEGER NOT NULL,
  badge_id TEXT REFERENCES public.badges(id),
  content JSONB NOT NULL
);

-- USER_LESSON_PROGRESS
CREATE TABLE public.user_lesson_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  lesson_id TEXT NOT NULL REFERENCES public.lessons(id),
  completed BOOLEAN DEFAULT false,
  quiz_score INTEGER,
  completed_at TIMESTAMPTZ,
  UNIQUE(user_id, lesson_id)
);

-- MATHLYMPICS_SESSIONS
CREATE TABLE public.mathlympics_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  category TEXT NOT NULL CHECK (category IN ('2x1', '3x1', '2x2', 'squaring', 'multiples_11', 'day_of_week')),
  set_size INTEGER NOT NULL CHECK (set_size IN (10, 20, 40)),
  score INTEGER NOT NULL,
  accuracy REAL NOT NULL,
  total_time_ms INTEGER NOT NULL,
  avg_time_ms INTEGER NOT NULL,
  detail JSONB,
  played_at TIMESTAMPTZ DEFAULT now()
);

-- Index for leaderboard queries
CREATE INDEX idx_sessions_leaderboard
  ON public.mathlympics_sessions (category, set_size, accuracy DESC, total_time_ms ASC);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_lesson_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mathlympics_sessions ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Public profiles are viewable by everyone"
  ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can view own badges"
  ON public.user_badges FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can view own progress"
  ON public.user_lesson_progress FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress"
  ON public.user_lesson_progress FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own progress"
  ON public.user_lesson_progress FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Sessions are viewable by everyone (for leaderboard)"
  ON public.mathlympics_sessions FOR SELECT USING (true);

CREATE POLICY "Users can insert own sessions"
  ON public.mathlympics_sessions FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, username, display_name)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'username', 'user_' || left(new.id::text, 8)),
    COALESCE(new.raw_user_meta_data->>'username', 'User')
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
