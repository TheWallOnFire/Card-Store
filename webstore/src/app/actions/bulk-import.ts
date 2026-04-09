"use server";

import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { SupabaseClient } from '@supabase/supabase-js';
import { parseBulkLines } from '@/lib/parsers';

const BulkImportSchema = z.object({
  rawLines: z.string().min(1, "Input cannot be empty"),
  userId: z.string().uuid(),
});

export interface IBulkImportResult {
  success: boolean;
  message: string;
  count?: number;
  errors?: string[];
}

interface IParsedItem {
  gameId: string;
  cardId: string;
  count: number;
}

export async function bulkImportAction(_prevState: IBulkImportResult | null, formData: FormData): Promise<IBulkImportResult> {
  const rawInput = formData.get('rawText') as string;
  const userId = formData.get('userId') as string;

  try {
    const validated = BulkImportSchema.parse({ rawLines: rawInput, userId });
    const { items, errors } = parseBulkLines(validated.rawLines);
    
    if (errors.length > 0) {
      return { success: false, message: "Parsing failed", errors };
    }

    const supabase = await createClient();
    const { error: txError } = await supabase.rpc('handle_bulk_import', {
      items,
      admin_id: userId
    });

    if (txError) {
      return { success: false, message: `Database Error: ${txError.message}` };
    }

    await recordImportAudit(supabase, userId, items);
    
    revalidatePath('/admin/inventory');
    revalidatePath('/search');

    return { success: true, message: `Successfully imported ${items.length} records.`, count: items.length };
  } catch (err) {
    return handleImportError(err);
  }
}


async function recordImportAudit(supabase: SupabaseClient, userId: string, items: IParsedItem[]) {
  return supabase.from('audit_logs').insert({
    admin_id: userId,
    action: 'BULK_IMPORT',
    target_table: 'listings/inventory',
    payload: { count: items.length, first_item: items[0] }
  });
}

async function handleImportError(err: unknown): Promise<IBulkImportResult> {
  if (err instanceof z.ZodError) {
    return { success: false, message: "Validation Error", errors: err.issues.map(e => e.message) };
  }
  return { success: false, message: "An unexpected error occurred during bulk import." };
}
