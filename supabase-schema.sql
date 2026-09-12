-- Clean, robust schema for Romantic Universe Proposals
-- Copy and paste this directly into the Supabase SQL Editor and click Run

CREATE TABLE IF NOT EXISTS proposals (
    id TEXT PRIMARY KEY,
    sender TEXT NOT NULL,
    partner TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    reply_note TEXT DEFAULT '',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    accepted_at TIMESTAMPTZ,
    dynamic TEXT DEFAULT 'girl_to_boy',
    emotion TEXT DEFAULT 'rose',
    motion_mode TEXT DEFAULT 'pulse',
    anim_speed NUMERIC DEFAULT 1.0,
    particle_density TEXT DEFAULT 'medium',
    touch_fx TEXT DEFAULT 'sparkles',
    custom_note TEXT DEFAULT '',
    custom_vow TEXT DEFAULT '',
    payload JSONB
);

-- Enable Row Level Security (RLS)
ALTER TABLE proposals ENABLE ROW LEVEL SECURITY;

-- Reset and configure public access policies
DROP POLICY IF EXISTS "Allow public read access to proposals" ON proposals;
CREATE POLICY "Allow public read access to proposals" ON proposals FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public insert access to proposals" ON proposals;
CREATE POLICY "Allow public insert access to proposals" ON proposals FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public update access to proposals" ON proposals;
CREATE POLICY "Allow public update access to proposals" ON proposals FOR UPDATE USING (true);

-- Performance indices
CREATE INDEX IF NOT EXISTS idx_proposals_created_at ON proposals (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_proposals_status ON proposals (status);
