-- SQL Script to set up Supabase tables and fix RLS errors
-- Copy and paste this into your Supabase SQL Editor: https://supabase.com/dashboard/project/_/sql

-- 1. Create the 'users' table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.users (
    id TEXT PRIMARY KEY,
    username TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create the 'scans' table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.scans (
    id BIGSERIAL PRIMARY KEY,
    item TEXT NOT NULL,
    category TEXT NOT NULL,
    confidence FLOAT NOT NULL,
    instructions TEXT NOT NULL,
    user_id TEXT NOT NULL REFERENCES public.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Disable Row Level Security (RLS) to allow the app to write data
-- Note: In a production app, you should instead create specific policies.
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.scans DISABLE ROW LEVEL SECURITY;

-- 4. Grant access to the anon role (used by the client SDK)
GRANT ALL ON public.users TO anon;
GRANT ALL ON public.scans TO anon;
GRANT ALL ON public.users TO authenticated;
GRANT ALL ON public.scans TO authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;
