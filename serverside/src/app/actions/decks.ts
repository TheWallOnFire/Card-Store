'use server';

import { z } from 'zod';
import { createClient } from '@/lib/supabase';
import { logServerError } from '@/lib/error-logger';
import { revalidatePath } from 'next/cache';

const DeckImportSchema = z.object({
  rawText: z.string().min(1, "Input cannot be empty"),
  deck_name: z.string().min(3).max(50),
  game_id: z.string(),
});

/**
 * Server Action: Accepts a raw input string, parses it using Regex,
 * and performs a Bulk deck import using a SQL transaction (via Supabase RPC).
 */
export async function processBulkDeckAction(
  _prevState: any,
  formData: FormData
) {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError || !user) {
    return { success: false, message: 'Unauthorized. Please login.' };
  }

  // 1. Validation
  const validatedFields = DeckImportSchema.safeParse({
    rawText: formData.get('rawText'),
    deck_name: formData.get('deck_name'),
    game_id: formData.get('game_id'),
  });

  if (!validatedFields.success) {
    return { success: false, message: 'Validation failed', errors: validatedFields.error.flatten() };
  }

  const { rawText, deck_name, game_id } = validatedFields.data;

  // 2. Regex Parsing
  // Format: gameid_cardid_count (e.g., mtg_123_4)
  const linePattern = /^([a-zA-Z0-9]+)_([a-fA-F0-9-]+)_(\d+)$/;
  const lines = rawText.split('\n').map(l => l.trim()).filter(l => l.length > 0);
  
  const deckItems: { card_id: string; quantity: number }[] = [];
  const errors: string[] = [];

  for (const [idx, line] of lines.entries()) {
    const match = line.match(linePattern);
    if (!match) {
      errors.push(`Line ${idx + 1}: Invalid format. Expected gameid_cardid_count.`);
      continue;
    }
    const [_, gi, ci, count] = match;
    
    // Simple game check
    if (gi !== game_id) {
        errors.push(`Line ${idx + 1}: Game mismatch (expected ${game_id}, got ${gi}).`);
        continue;
    }

    deckItems.push({ card_id: ci, quantity: parseInt(count, 10) });
  }

  if (errors.length > 0) {
    return { success: false, message: 'Parsing errors found.', errors };
  }

  // 3. Database Interaction (Transactional)
  try {
    // First, create the deck record
    const { data: deck, error: deckError } = await supabase
      .from('decks')
      .insert({
        name: deck_name,
        author_id: user.id,
        game_id: game_id,
      })
      .select('id')
      .single();

    if (deckError) {
        return { success: false, message: logServerError(deckError, 'createDeck') };
    }

    // Now, perform bulk insert into deck_items via RPC for transactional safety
    const { error: bulkError } = await supabase.rpc('handle_bulk_import', {
      items: deckItems as any,
      admin_id: user.id, 
    });

    if (bulkError) {
        return { success: false, message: logServerError(bulkError, 'bulkImport') };
    }

    revalidatePath('/decks');
    return { success: true, message: `Deck "${deck_name}" successfully imported with ${deckItems.length} items.` };

  } catch (err) {
    return { success: false, message: logServerError(err, 'processBulkDeckAction_Exception') };
  }
}
