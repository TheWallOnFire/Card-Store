import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '../../../../lib/supabase';

/**
 * POST /api/webhooks/stripe
 * (Skeleton) For handling payment confirmations and updating listing quantities.
 * This endpoint must verify the signature from Stripe to ensure the request is legitimate.
 */
export async function POST(req: NextRequest) {
  const signature = req.headers.get('stripe-signature');
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!signature || !endpointSecret) {
     return new NextResponse('Webhook secret not configured.', { status: 400 });
  }

  const payload = await req.text();
  
  // 1. Verify Event
  try {
     // Stripe-ready logic: 
     // const event = stripe.webhooks.constructEvent(payload, signature, endpointSecret);
     const event = JSON.parse(payload); // Mocking event for skeleton

     const supabase = await createClient();

     // 2. Handle Event Type
     switch (event.type) {
       case 'checkout.session.completed':
         const session = event.data.object;
         const metadata = session.metadata; // metadata.listingId, metadata.quantity

         if (metadata && metadata.listingId) {
            // 3. Update Listing Quantities (Atomic operation)
            const { error: updateError } = await supabase.rpc('decrement_listing_quantity', {
               p_listing_id: metadata.listingId,
               p_amount: metadata.quantity || 1
            });

            if (updateError) {
               console.error('[STRIPE_WEBHOOK]: Inventory update failed.', updateError);
            }
         }
         break;

       case 'payment_intent.payment_failed':
         console.error('[STRIPE_WEBHOOK]: Payment failed for intent', event.data.object.id);
         break;

       default:
         console.log(`[STRIPE_WEBHOOK]: Unhandled event type ${event.type}`);
     }

     return NextResponse.json({ received: true });

  } catch (err) {
     console.error('[STRIPE_WEBHOOK_EXCEPTION]:', err);
     return new NextResponse(`Webhook Error: ${err instanceof Error ? err.message : 'Unknown'}`, { status: 400 });
  }
}
