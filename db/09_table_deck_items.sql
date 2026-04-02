-- Table: Deck Items
CREATE TABLE IF NOT EXISTS public.deck_items (
    deck_id UUID REFERENCES public.decks(id) ON DELETE CASCADE NOT NULL,
    card_id UUID REFERENCES public.cards(id) ON DELETE CASCADE NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
    PRIMARY KEY (deck_id, card_id)
);
