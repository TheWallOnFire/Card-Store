-- Policy: Decks
ALTER TABLE public.decks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own decks" ON public.decks 
    FOR ALL USING (auth.uid() = user_id);
