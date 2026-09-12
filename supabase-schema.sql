-- Romantic Universe Proposals Database Schema & Security Policies
-- Compatible with Supabase PostgreSQL & Row Level Security (RLS)

-- 1. Create table if not exists with all required fields
CREATE TABLE IF NOT EXISTS proposals (
    id TEXT PRIMARY KEY,
    sender TEXT NOT NULL,
    partner TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    reply_note TEXT DEFAULT '',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    accepted_at TIMESTAMPTZ,
    dynamic TEXT DEFAULT 'boy_to_girl',
    emotion TEXT DEFAULT 'rose',
    motion_mode TEXT DEFAULT 'pulse',
    anim_speed NUMERIC DEFAULT 1.0,
    particle_density TEXT DEFAULT 'medium',
    touch_fx TEXT DEFAULT 'sparkles',
    custom_note TEXT DEFAULT '',
    custom_vow TEXT DEFAULT '',
    payload JSONB DEFAULT '{}'::jsonb
);

-- Ensure any existing table has all required columns (safe migrations)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='proposals' AND column_name='custom_vow') THEN
        ALTER TABLE proposals ADD COLUMN custom_vow TEXT DEFAULT '';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='proposals' AND column_name='payload') THEN
        ALTER TABLE proposals ADD COLUMN payload JSONB DEFAULT '{}'::jsonb;
    END IF;
END $$;

-- 2. Performance Indexes
CREATE INDEX IF NOT EXISTS idx_proposals_created_at ON proposals (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_proposals_status ON proposals (status);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE proposals ENABLE ROW LEVEL SECURITY;

-- 4. Audit & Remove dangerous open public access policies
DROP POLICY IF EXISTS "Allow public read access to proposals" ON proposals;
DROP POLICY IF EXISTS "Allow public insert access to proposals" ON proposals;
DROP POLICY IF EXISTS "Allow public update access to proposals" ON proposals;
DROP POLICY IF EXISTS "Service role full access" ON proposals;
DROP POLICY IF EXISTS "Allow controlled proposal creation" ON proposals;
DROP POLICY IF EXISTS "Allow anon insert new pending proposal" ON proposals;

-- 5. Service Role Policy (allows full access to server-side backend with SUPABASE_SERVICE_ROLE_KEY)
CREATE POLICY "Service role full access"
    ON proposals
    FOR ALL
    TO service_role
    USING (auth.role() = 'service_role')
    WITH CHECK (auth.role() = 'service_role');

-- 6. Strict Anon Insertion Policy (allows creating a new proposal only with pending status and valid fields)
CREATE POLICY "Allow anon insert new pending proposal"
    ON proposals
    FOR INSERT
    TO anon
    WITH CHECK (
        id IS NOT NULL AND
        length(id) >= 12 AND
        sender IS NOT NULL AND
        length(trim(sender)) > 0 AND
        partner IS NOT NULL AND
        length(trim(partner)) > 0 AND
        status = 'pending'
    );

-- Notice: Direct blanket SELECT, UPDATE, and DELETE are strictly BLOCKED for anon.
-- Anonymous visitors cannot run "SELECT * FROM proposals" to enumerate or harvest anyone's proposals.

-- 7. Secure Single Proposal Access Function (RPC)
-- Allows reading ONLY a specific proposal by its exact unguessable ID
CREATE OR REPLACE FUNCTION get_proposal(p_id TEXT)
RETURNS SETOF proposals
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT * FROM proposals WHERE id = p_id LIMIT 1;
$$;

-- 8. Secure Proposal Acceptance Function (RPC)
-- Allows updating ONLY the status, accepted_at timestamp, and reply_note.
-- Strictly prevents modifying sender, partner, vows, created_at, or other proposal parameters.
-- Enforces that only 'pending' proposals can be accepted, making acceptance immutable once confirmed.
CREATE OR REPLACE FUNCTION accept_proposal(p_id TEXT, p_reply_note TEXT DEFAULT '')
RETURNS SETOF proposals
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    RETURN QUERY
    UPDATE proposals
    SET status = 'accepted',
        accepted_at = COALESCE(accepted_at, NOW()),
        reply_note = substr(COALESCE(p_reply_note, ''), 1, 500)
    WHERE id = p_id AND status = 'pending'
    RETURNING *;
END;
$$;

-- 9. Grant RPC Execution Permissions
GRANT EXECUTE ON FUNCTION get_proposal(TEXT) TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION accept_proposal(TEXT, TEXT) TO anon, authenticated, service_role;
