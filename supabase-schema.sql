-- Schema for Romantic Universe Proposals
-- Run this query in your Supabase SQL Editor (Dashboard -> SQL Editor -> New Query)

CREATE TABLE IF NOT EXISTS proposals (
    id TEXT PRIMARY KEY,
    sender TEXT NOT NULL,
    partner TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending', -- 'pending' (waiting) or 'accepted'
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
    payload JSONB -- Full configuration snapshot
);

-- Enable Row Level Security (RLS)
ALTER TABLE proposals ENABLE ROW LEVEL SECURITY;

-- Allow public read access to proposals by ID (for recipient and tracker)
CREATE POLICY "Allow public read access to proposals" 
ON proposals FOR SELECT 
USING (true);

-- Allow public insert access for creating proposals
CREATE POLICY "Allow public insert access to proposals" 
ON proposals FOR INSERT 
WITH CHECK (true);

-- Allow public update access for accepting proposals
CREATE POLICY "Allow public update access to proposals" 
ON proposals FOR UPDATE 
USING (true);

-- Index on created_at for fast admin/dashboard listing
CREATE INDEX IF NOT EXISTS idx_proposals_created_at ON proposals (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_proposals_status ON proposals (status);
