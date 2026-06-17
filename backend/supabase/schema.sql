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
