-- Function: Handle Bulk Import (Atomic Transaction)
-- Expects JSONB items array: [{"gameId": "ygo", "cardId": "001", "count": 3}, ...]
CREATE OR REPLACE FUNCTION public.handle_bulk_import(
    items JSONB,
    admin_id UUID
) RETURNS JSONB AS $$
DECLARE
    item RECORD;
    result JSONB;
    v_card_id UUID;
BEGIN
    -- 1. Validate if the items array is actually provided
    IF items IS NULL OR jsonb_array_length(items) = 0 THEN
        RAISE EXCEPTION 'No items provided for bulk import';
    END IF;

    -- 2. Iterate and process (within single transaction)
    FOR item IN SELECT * FROM jsonb_to_recordset(items) AS x(gameId TEXT, cardId TEXT, count INT)
    LOOP
        -- Find the actual card record by external gameId/cardId
        SELECT id INTO v_card_id FROM public.cards 
        WHERE game_id = item.gameId AND id = item.cardId;

        IF v_card_id IS NULL THEN
            RAISE EXCEPTION 'Card not found for pair: % / %', item.gameId, item.cardId;
        END IF;

        -- Here we insert or update inventory (listings)
        -- For simplicity, let's assume we are adding a generic listing from the store admin
        INSERT INTO public.listings (
            card_id, 
            seller_id, 
            price, 
            shipping_price, 
            quantity, 
            condition, 
            is_direct
        ) VALUES (
            v_card_id,
            admin_id,
            0, -- Placeholder for price calculation utility (to be updated)
            0,
            item.count,
            'NM'::item_condition,
            TRUE
        )
        ON CONFLICT (card_id, seller_id, condition) 
        DO UPDATE SET quantity = listings.quantity + EXCLUDED.count;
    END LOOP;

    RETURN jsonb_build_object('success', TRUE, 'count', jsonb_array_length(items));

EXCEPTION WHEN OTHERS THEN
    -- Rollback is implicit in PostgreSQL functions called as single units
    RETURN jsonb_build_object('success', FALSE, 'error', SQLERRM);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
