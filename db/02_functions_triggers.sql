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
