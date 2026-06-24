-- Drop existing tables (clean slate)
DROP TABLE IF EXISTS care_team CASCADE;
DROP TABLE IF EXISTS pet_ids CASCADE;
DROP TABLE IF EXISTS pet_profiles CASCADE;
 
-- PET PROFILES TABLE
CREATE TABLE pet_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  petolife_id TEXT UNIQUE NOT NULL,   -- e.g. POL-DOG-A1B2C3
  pet_type TEXT NOT NULL,
  pet_name TEXT NOT NULL,
  breed TEXT,
  gender TEXT,
  birth_date DATE,
  weight NUMERIC,
  color TEXT,
  blood_group TEXT,
  identification_marks TEXT,
  pet_photo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- PET IDS TABLE
CREATE TABLE pet_ids (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  pet_profile_id UUID REFERENCES pet_profiles(id) ON DELETE CASCADE,
  id_name TEXT NOT NULL,
  id_number TEXT NOT NULL
);

-- CARE TEAM TABLE
CREATE TABLE care_team (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  pet_profile_id UUID REFERENCES pet_profiles(id) ON DELETE CASCADE,
  clinic_name TEXT,
  vet_name TEXT,
  vet_contact TEXT,
  emergency_contact_name TEXT NOT NULL,
  emergency_relationship TEXT,
  emergency_contact_number TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Unique constraint: one care team per pet
ALTER TABLE care_team ADD CONSTRAINT care_team_pet_profile_id_key UNIQUE (pet_profile_id);

-- STORAGE: Create bucket named "pet-photos" as Public in Supabase Dashboard > Storage

-- PET HEALTH IDS (Sequence Tracker)
CREATE TABLE IF NOT EXISTS pet_health_ids (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  health_id TEXT UNIQUE NOT NULL,
  pet_profile_id UUID REFERENCES pet_profiles(id) ON DELETE CASCADE,
  city_code TEXT NOT NULL,
  pet_type_code TEXT NOT NULL,
  sequence_number INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- MEDICAL RECORDS TABLE
CREATE TABLE IF NOT EXISTS medical_records (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  pet_profile_id UUID REFERENCES pet_profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_type TEXT,
  file_size INTEGER,
  storage_path TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- STORAGE BUCKETS TO CREATE IN SUPABASE (Public):
-- 1. "pet-photos"
-- 2. "medical-docs"
