// Edge Function: Create Stripe Checkout Session
// Deploy with: supabase functions deploy create-checkout-session

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import Stripe from 'https://esm.sh/stripe@13.10.0?target=deno'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!, {
  apiVersion: '2023-10-16',
})

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
)

const PRICES = {
  plus: {
    monthly: 'price_plus_monthly', // Replace with actual Stripe price IDs
    quarterly: 'price_plus_quarterly',
    annual: 'price_plus_annual',
  },
  elite: {
    monthly: 'price_elite_monthly',
    quarterly: 'price_elite_quarterly',
    annual: 'price_elite_annual',
  },
}

serve(async (req) => {
  try {
    const { userId, plan, billingCycle } = await req.json()

    // Verify user
    const { data: { user }, error: authError } = await supabase.auth.admin.getUserById(userId)
    if (authError || !user) {
      throw new Error('Unauthorized')
    }

    // Get or create Stripe customer
    let customerId = user.user_metadata?.stripe_customer_id

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: { userId },
      })
      customerId = customer.id

      await supabase.auth.admin.updateUserById(userId, {
        data: { stripe_customer_id: customerId },
      })
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      line_items: [
        {
          price: PRICES[plan][billingCycle],
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${Deno.env.get('APP_URL')}/app/premium?success=true`,
      cancel_url: `${Deno.env.get('APP_URL')}/app/premium?cancelled=true`,
      metadata: {
        userId,
        plan,
        billingCycle,
      },
    })

    return new Response(
      JSON.stringify({ url: session.url }),
      { headers: { 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    )
  }
})
