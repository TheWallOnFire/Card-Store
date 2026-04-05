'use server';

import { z } from 'zod';
import { createClient } from '@/lib/supabase';
import { logServerError } from '@/lib/error-logger';
import { revalidatePath } from 'next/cache';

const ListingSchema = z.object({
  card_id: z.string().uuid(),
  seller_id: z.string().uuid(),
  price: z.number().positive('Price must be greater than 0'),
  quantity: z.number().int().positive('Quantity must be at least 1'),
  condition: z.enum(['Near Mint', 'Lightly Played', 'Moderately Played', 'Heavily Played', 'Damaged']).default('Near Mint'),
});

export type ListingResult = {
  success: boolean;
  message: string;
  listingId?: string;
};

/**
 * Server Action: Validates and creates a new card listing.
 */
export async function createListingAction(
  _prevState: ListingResult | null,
  formData: FormData
): Promise<ListingResult> {
  const supabase = await createClient();
  
  // 1. Auth check
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return { success: false, message: 'Unauthorized access. Please login.' };
  }

  // 2. Validation
  const validatedFields = ListingSchema.safeParse({
    card_id: formData.get('card_id'),
    seller_id: user.id, // Enforce seller = current user
    price: Number(formData.get('price')),
    quantity: Number(formData.get('quantity')),
    condition: formData.get('condition'),
  });

  if (!validatedFields.success) {
    return {
      success: false,
      message: "Validation Error",
      // Flatten errors into single string for simplicity
      errors: validatedFields.error.flatten().fieldErrors,
    } as any;
  }

  const { card_id, seller_id, price, quantity, condition } = validatedFields.data;

  // 3. Database Interaction
  try {
    const { data, error } = await supabase
      .from('listings')
      .insert({
        card_id,
        seller_id,
        price,
        quantity,
        condition,
      })
      .select('id')
      .single();

    if (error) {
      const errorMessage = logServerError(error, 'createListingAction');
      return { success: false, message: errorMessage };
    }

    revalidatePath(`/product/${card_id}`);
    revalidatePath('/search');

    return { 
      success: true, 
      message: "Listing created successfully.", 
      listingId: data.id 
    };

  } catch (err) {
    const errorMessage = logServerError(err, 'createListingAction_Exception');
    return { success: false, message: errorMessage };
  }
}
