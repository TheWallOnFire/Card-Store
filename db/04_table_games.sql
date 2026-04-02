-- Table: Games
CREATE TABLE IF NOT EXISTS public.games (
    id TEXT PRIMARY KEY, -- slug like 'ygo', 'mtg', 'pkm'
    name TEXT NOT NULL,
    logo_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
