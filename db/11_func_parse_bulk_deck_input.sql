-- Function: parse_bulk_deck_input
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
