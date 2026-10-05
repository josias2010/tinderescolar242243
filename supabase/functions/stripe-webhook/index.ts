// Edge Function: Stripe Webhook Handler
// Deploy with: supabase functions deploy stripe-webhook

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

serve(async (req) => {
  const signature = req.headers.get('stripe-signature')!
  const body = await req.text()

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      Deno.env.get('STRIPE_WEBHOOK_SECRET')!
    )
  } catch (err) {
    return new Response(
      JSON.stringify({ error: `Webhook Error: ${err.message}` }),
      { status: 400 }
    )
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        const userId = session.metadata?.userId
        const plan = session.metadata?.plan as 'plus' | 'elite'

        if (userId && plan) {
          // Create subscription record
          await supabase.from('subscriptions').insert({
            user_id: userId,
            plan,
            status: 'active',
            stripe_subscription_id: session.subscription as string,
            stripe_customer_id: session.customer as string,
            current_period_start: new Date().toISOString(),
            current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          })

          // Update user profile
          await supabase.from('profiles').update({
            is_premium: true,
            premium_plan: plan,
            premium_expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          }).eq('id', userId)

          // Create payment record
          await supabase.from('payments').insert({
            user_id: userId,
            amount: session.amount_total! / 100,
            currency: session.currency,
            stripe_payment_id: session.payment_intent as string,
            status: 'completed',
          })

          // Send notification
          await supabase.from('notifications').insert({
            user_id: userId,
            type: 'system',
            title: '¡Bienvenido a NEXORA Premium!',
            body: `Tu suscripción ${plan.toUpperCase()} está activa. Disfruta de todas las funciones premium.`,
          })
        }
        break
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription
        const userId = subscription.metadata?.userId

        if (userId) {
          const status = subscription.status === 'active' ? 'active' :
                        subscription.status === 'past_due' ? 'past_due' :
                        subscription.status === 'canceled' ? 'cancelled' : 'active'

          await supabase.from('subscriptions')
            .update({
              status,
              current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
              cancelled_at: subscription.cancel_at ? new Date(subscription.cancel_at * 1000).toISOString() : null,
            })
            .eq('stripe_subscription_id', subscription.id)
        }
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        const userId = subscription.metadata?.userId

        if (userId) {
          await supabase.from('subscriptions')
            .update({ status: 'cancelled' })
            .eq('stripe_subscription_id', subscription.id)

          await supabase.from('profiles')
            .update({
              is_premium: false,
              premium_plan: 'free',
            })
            .eq('id', userId)
        }
        break
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice
        const customerId = invoice.customer as string

        const { data: subscription } = await supabase
          .from('subscriptions')
          .select('user_id')
          .eq('stripe_customer_id', customerId)
          .single()

        if (subscription) {
          await supabase.from('notifications').insert({
            user_id: subscription.user_id,
            type: 'security',
            title: 'Pago fallido',
            body: 'No pudimos procesar tu pago. Por favor, actualiza tu método de pago para mantener tu suscripción activa.',
          })
        }
        break
      }
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
})
