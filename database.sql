-- ==============================================================================================
-- REAL STONE: FIELD INTELLIGENCE - SUPABASE POSTGRES SCHEMA
-- ==============================================================================================

-- 1. ENUMS
CREATE TYPE public.job_status AS ENUM (
  'pending', 
  'assigned', 
  'in_progress', 
  'submitted_for_review', 
  'verified'
);

CREATE TYPE public.user_role AS ENUM (
  'admin', 
  'installer'
);

-- 2. TABLES

-- Profiles Table (Linked to Supabase Auth)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  role public.user_role DEFAULT 'installer'::public.user_role NOT NULL,
  pin_code TEXT, -- 4-digit numeric string for offline/device bypass
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Jobs / Work Orders Table
CREATE TABLE public.jobs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  legacy_id TEXT UNIQUE NOT NULL, -- StoneApp ID (e.g., WO-8402)
  client_name TEXT NOT NULL,
  address TEXT NOT NULL,
  community TEXT,
  city TEXT NOT NULL,
  scope TEXT, -- Brief summary of material scope
  status public.job_status DEFAULT 'pending'::public.job_status NOT NULL,
  install_date TIMESTAMP WITH TIME ZONE,
  installer_id UUID REFERENCES public.profiles(id),
  logistics_notes TEXT, -- Gate codes, elevator restrictions, etc.
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Field Photos Table (Proof of Installation, Progress)
CREATE TABLE public.photos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_id UUID NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  lat DOUBLE PRECISION,
  lng DOUBLE PRECISION,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Digital Signatures Table (Customer Sign-off)
CREATE TABLE public.signatures (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_id UUID NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  signer_name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==============================================================================================
-- 3. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.signatures ENABLE ROW LEVEL SECURITY;

-- Helper to check if current user is an admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  );
$$ LANGUAGE sql SECURITY DEFINER;

-- -------------------------------------------------------------------------
-- Profiles Policies
-- -------------------------------------------------------------------------
-- Everyone can read profiles
CREATE POLICY "Profiles are viewable by everyone" ON public.profiles
  FOR SELECT USING (true);

-- Admins can update any profile; Users can update their own
CREATE POLICY "Users can update own profile or admins update all" ON public.profiles
  FOR UPDATE USING (
    auth.uid() = id OR public.is_admin()
  );

-- -------------------------------------------------------------------------
-- Jobs Policies
-- -------------------------------------------------------------------------
-- Admins: Full Access
CREATE POLICY "Admins have full access to jobs" ON public.jobs
  FOR ALL USING (public.is_admin());

-- Installers: Select
CREATE POLICY "Installers can only view their assigned jobs" ON public.jobs
  FOR SELECT USING (
    installer_id = auth.uid()
  );

-- Installers: Update Status & Notes Only
CREATE POLICY "Installers can update their assigned jobs" ON public.jobs
  FOR UPDATE USING (
    installer_id = auth.uid()
  );

-- -------------------------------------------------------------------------
-- Photos & Signatures Policies
-- -------------------------------------------------------------------------
-- Admins: Full Access
CREATE POLICY "Admins have full access to photos" ON public.photos
  FOR ALL USING (public.is_admin());

CREATE POLICY "Admins have full access to signatures" ON public.signatures
  FOR ALL USING (public.is_admin());

-- Installers: Can insert photos/signatures for their assigned jobs
CREATE POLICY "Installers can insert photos for own jobs" ON public.photos
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.jobs WHERE id = job_id AND installer_id = auth.uid())
  );

CREATE POLICY "Installers can view photos for own jobs" ON public.photos
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.jobs WHERE id = job_id AND installer_id = auth.uid())
  );

CREATE POLICY "Installers can insert signatures for own jobs" ON public.signatures
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.jobs WHERE id = job_id AND installer_id = auth.uid())
  );

CREATE POLICY "Installers can view signatures for own jobs" ON public.signatures
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.jobs WHERE id = job_id AND installer_id = auth.uid())
  );
