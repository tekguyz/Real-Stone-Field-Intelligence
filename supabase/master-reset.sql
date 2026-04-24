-- /supabase/master-reset.sql
-- NUCLEAR MASTER RESET
-- This script wipes the current schema and establishes the final StoneApp-aligned database.

DROP TABLE IF EXISTS signatures CASCADE;
DROP TABLE IF EXISTS photos CASCADE;
DROP TABLE IF EXISTS jobs CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

DROP TYPE IF EXISTS job_status CASCADE;
DROP TYPE IF EXISTS user_role CASCADE;
DROP TYPE IF EXISTS job_type CASCADE;

CREATE TYPE job_status AS ENUM ('pending', 'assigned', 'in_progress', 'submitted_for_review', 'verified');
CREATE TYPE user_role AS ENUM ('admin', 'installer');
CREATE TYPE job_type AS ENUM ('template', 'install', 'service');

-- 1. Profiles Table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  role user_role DEFAULT 'installer'::user_role,
  first_name TEXT,
  last_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Jobs Table (StoneApp Aligned)
CREATE TABLE jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  legacy_id TEXT UNIQUE NOT NULL,
  project_id TEXT,
  client_name TEXT NOT NULL,
  address TEXT NOT NULL,
  stoneapp_parts JSONB DEFAULT '[]'::jsonb,
  status job_status DEFAULT 'pending'::job_status,
  job_type job_type DEFAULT 'install'::job_type,
  scheduled_date DATE,
  installer_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Photos Table
CREATE TABLE photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
  storage_path TEXT NOT NULL,
  uploaded_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Signatures Table
CREATE TABLE signatures (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID REFERENCES jobs(id) ON DELETE CASCADE UNIQUE,
  storage_path TEXT NOT NULL,
  signed_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Enablement
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE signatures ENABLE ROW LEVEL SECURITY;

-- Security Policies: Profiles
CREATE POLICY "Admins can manage all profiles" ON profiles FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Users can read own profile" ON profiles FOR SELECT USING (id = auth.uid());

-- Security Policies: Jobs
CREATE POLICY "Admins can manage all jobs" ON jobs FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Installers can read assigned jobs" ON jobs FOR SELECT USING (installer_id = auth.uid());
CREATE POLICY "Installers can update assigned jobs" ON jobs FOR UPDATE USING (installer_id = auth.uid());

-- Security Policies: Photos
CREATE POLICY "Admins can manage all photos" ON photos FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Installers can insert photos for assigned jobs" ON photos FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM jobs WHERE id = job_id AND installer_id = auth.uid())
);
CREATE POLICY "Installers can read photos for assigned jobs" ON photos FOR SELECT USING (
  EXISTS (SELECT 1 FROM jobs WHERE id = job_id AND installer_id = auth.uid())
);

-- Security Policies: Signatures
CREATE POLICY "Admins can manage all signatures" ON signatures FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Installers can insert signatures for assigned jobs" ON signatures FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM jobs WHERE id = job_id AND installer_id = auth.uid())
);
CREATE POLICY "Installers can read signatures for assigned jobs" ON signatures FOR SELECT USING (
  EXISTS (SELECT 1 FROM jobs WHERE id = job_id AND installer_id = auth.uid())
);

-- Note: Ensure 'job-photos' and 'job-signatures' buckets exist in Supabase Storage 
-- and have appropriate RLS policies for Authenticated inserts.
