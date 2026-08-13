-- ============================================================================
-- Scratch'n'Travel — Supabase Database Schema (PostgreSQL)
-- Social Travel Platform for Families, Pets, Local Secrets & Digital Scratchbooks
-- ============================================================================

-- 1. Profiles (Travelers, Locals, Families & Pet Owners)
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(150),
    role VARCHAR(50) DEFAULT 'traveler', -- 'traveler', 'local', 'host', 'family_traveler'
    bio TEXT,
    city VARCHAR(100),
    country VARCHAR(100),
    has_kids BOOLEAN DEFAULT FALSE,
    has_pets BOOLEAN DEFAULT FALSE,
    pet_types JSONB DEFAULT '[]'::jsonb, -- e.g. ["dog", "cat"]
    hobbies JSONB DEFAULT '[]'::jsonb,   -- e.g. ["Hiking", "Photography", "Cooking"]
    subscription_tier VARCHAR(50) DEFAULT 'free', -- 'free', 'explorer_7', 'pro_family_15'
    karma_points INT DEFAULT 10,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Local Secrets & Spots
CREATE TABLE IF NOT EXISTS secret_spots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(200) NOT NULL,
    city VARCHAR(100) NOT NULL,
    country VARCHAR(100) NOT NULL,
    category VARCHAR(100) NOT NULL, -- 'secret_spot', 'family_friendly', 'pet_friendly', 'local_food', 'hobby_hub'
    description TEXT NOT NULL,
    latitude NUMERIC(10, 7),
    longitude NUMERIC(10, 7),
    is_secret BOOLEAN DEFAULT TRUE,
    etiquette_pledge_required BOOLEAN DEFAULT TRUE,
    family_attributes JSONB DEFAULT '{}'::jsonb, -- e.g. {"stroller_accessible": true, "playground_nearby": true}
    pet_attributes JSONB DEFAULT '{}'::jsonb,    -- e.g. {"fenced_garden": true, "dog_beach_nearby": true, "dogs_allowed_inside": true}
    created_by UUID REFERENCES profiles(id),
    likes_count INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Travel Checklists (Kids & Pets)
CREATE TABLE IF NOT EXISTS travel_checklists (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category VARCHAR(100) NOT NULL, -- 'family_kids', 'pet_dog', 'pet_cat', 'flight_pet_cargo', 'first_aid'
    title VARCHAR(200) NOT NULL,
    items JSONB NOT NULL, -- array of {id, text, is_essential}
    is_default BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Travel Scratchbooks & Memories
CREATE TABLE IF NOT EXISTS scratchbooks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id),
    trip_title VARCHAR(200) NOT NULL,
    city VARCHAR(100) NOT NULL,
    country VARCHAR(100) NOT NULL,
    start_date DATE,
    end_date DATE,
    spots_visited JSONB DEFAULT '[]'::jsonb,
    recipes_learned JSONB DEFAULT '[]'::jsonb,
    people_met JSONB DEFAULT '[]'::jsonb,
    photos JSONB DEFAULT '[]'::jsonb,
    notes TEXT,
    is_public BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Hermes City Brains (AI Seeding Data)
CREATE TABLE IF NOT EXISTS hermes_city_brains (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    city VARCHAR(100) UNIQUE NOT NULL,
    country VARCHAR(100) NOT NULL,
    baseline_spots JSONB DEFAULT '[]'::jsonb,
    family_highlights JSONB DEFAULT '[]'::jsonb,
    pet_highlights JSONB DEFAULT '[]'::jsonb,
    local_recipes JSONB DEFAULT '[]'::jsonb,
    health_score NUMERIC(5,2) DEFAULT 85.0,
    last_seeded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. Audit & Analytics Logs
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_type VARCHAR(100) NOT NULL, -- 'CHECKLIST_GENERATED', 'SECRET_UNLOCKED', 'AI_CONCIERGE_QUERY', 'AFFILIATE_CLICK'
    user_id UUID,
    payload JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE secret_spots ENABLE ROW LEVEL SECURITY;
ALTER TABLE travel_checklists ENABLE ROW LEVEL SECURITY;
ALTER TABLE scratchbooks ENABLE ROW LEVEL SECURITY;
ALTER TABLE hermes_city_brains ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
