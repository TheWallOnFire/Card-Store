-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Create Enums
CREATE TYPE item_condition AS ENUM (
    'Near Mint',
    'Lightly Played',
    'Moderately Played',
    'Heavily Played',
    'Damaged'
);

CREATE TYPE post_category AS ENUM (
    'blog',
    'strategy',
    'news'
);

-- 2. Create Tables
-- Profiles: Extends Supabase auth.users
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    username TEXT UNIQUE,
    avatar_url TEXT,
    role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Games: TCG Games metadata
CREATE TABLE IF NOT EXISTS public.games (
    id TEXT PRIMARY KEY, -- slug like 'ygo', 'mtg', 'pkm'
    name TEXT NOT NULL,
    logo_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Cards: Main card database
CREATE TABLE IF NOT EXISTS public.cards (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    game_id TEXT REFERENCES public.games(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    rarity TEXT,
    image_url TEXT,
    description TEXT,
    attributes JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Listings: Marketplace items
CREATE TABLE IF NOT EXISTS public.listings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    card_id UUID REFERENCES public.cards(id) ON DELETE CASCADE NOT NULL,
    seller_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    condition item_condition DEFAULT 'Near Mint' NOT NULL,
    price NUMERIC(12, 2) NOT NULL CHECK (price >= 0),
    quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity >= 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Posts: Content (Blog/Strategy/News)
CREATE TABLE IF NOT EXISTS public.posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    author_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    content TEXT NOT NULL, -- Markdown expected
    category post_category DEFAULT 'blog' NOT NULL,
    related_game_id TEXT REFERENCES public.games(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Decks: User-created deck containers
CREATE TABLE IF NOT EXISTS public.decks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    game_id TEXT REFERENCES public.games(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Deck Items: Junction table for cards in decks
CREATE TABLE IF NOT EXISTS public.deck_items (
    deck_id UUID REFERENCES public.decks(id) ON DELETE CASCADE NOT NULL,
    card_id UUID REFERENCES public.cards(id) ON DELETE CASCADE NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
    PRIMARY KEY (deck_id, card_id)
);

-- 3. Functions & Triggers
-- Automatically create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, username, avatar_url)
    VALUES (NEW.id, NEW.raw_user_meta_data->>'username', NEW.raw_user_meta_data->>'avatar_url');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Bulk Import Parser: Handles [gameid]_[cardid]_[count]
-- Format example: ygo_7f8a7e32-5a41-4c6e-8e8e-9e8e9e8e9e8e_3
CREATE OR REPLACE FUNCTION public.parse_bulk_deck_input(
    p_deck_id UUID,
    p_bulk_text TEXT
)
RETURNS VOID AS $$
DECLARE
    line TEXT;
    parts TEXT[];
    v_card_id UUID;
    v_quantity INTEGER;
BEGIN
    FOR line IN SELECT unnest(string_to_array(p_bulk_text, E'\n')) LOOP
        -- Remove spaces and handle carriage returns
        line := trim(line);
        IF line = '' THEN CONTINUE; END IF;

        -- Split by underscore
        parts := string_to_array(line, '_');
        
        -- We expect [gameid]_[cardid]_[count]
        IF array_length(parts, 1) >= 3 THEN
            v_card_id := parts[2]::UUID;
            v_quantity := parts[3]::INTEGER;

            -- Upsert into deck_items
            INSERT INTO public.deck_items (deck_id, card_id, quantity)
            VALUES (p_deck_id, v_card_id, v_quantity)
            ON CONFLICT (deck_id, card_id)
            DO UPDATE SET quantity = public.deck_items.quantity + EXCLUDED.quantity;
        END IF;
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- 4. Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.games ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.decks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deck_items ENABLE ROW LEVEL SECURITY;

-- Games/Cards/Posts: Read-only for all, write for admins
CREATE POLICY "Public read games" ON public.games FOR SELECT USING (true);
CREATE POLICY "Public read cards" ON public.cards FOR SELECT USING (true);
CREATE POLICY "Public read posts" ON public.posts FOR SELECT USING (true);

-- Profiles: Authenticated users can read all, but update only their own
CREATE POLICY "Public read profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Listings: Public read, Authenticated users can manage their own
CREATE POLICY "Public read listings" ON public.listings FOR SELECT USING (true);
CREATE POLICY "Users can manage own listings" ON public.listings 
    FOR ALL USING (auth.uid() = seller_id);

-- Decks: Users manage their own
CREATE POLICY "Users manage own decks" ON public.decks 
    FOR ALL USING (auth.uid() = user_id);

-- Deck Items: Users manage items in their own decks
CREATE POLICY "Users manage own deck items" ON public.deck_items 
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.decks 
            WHERE id = deck_id AND user_id = auth.uid()
        )
    );

-- Admin Policies (Simplified example: checks profile.role)
CREATE POLICY "Admins can manage games" ON public.games 
    FOR ALL USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admins can manage cards" ON public.cards 
    FOR ALL USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admins can manage posts" ON public.posts 
    FOR ALL USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));
