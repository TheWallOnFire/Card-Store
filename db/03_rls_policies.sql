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
