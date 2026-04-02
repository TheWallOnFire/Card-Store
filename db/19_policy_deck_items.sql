-- Policy: Deck Items
ALTER TABLE public.deck_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own deck items" ON public.deck_items 
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.decks 
            WHERE id = deck_id AND user_id = auth.uid()
        )
    );
