import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase';

/**
 * POST /api/webhooks/stripe
 * For handling payment confirmations and updating listing quantities.
 */
export async function POST(req: NextRequest) {
  const signature = req.headers.get('stripe-signature');
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!signature || !endpointSecret) {
     return new NextResponse('Webhook secret not configured.', { status: 400 });
  }

  const payload = await req.text();
  
  try {
     const event = JSON.parse(payload); 

     const supabase = await createClient();

     switch (event.type) {
       case 'checkout.session.completed':
         const session = event.data.object;
         const metadata = session.metadata;

         if (metadata && metadata.listingId) {
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
