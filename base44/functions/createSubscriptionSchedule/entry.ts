import { createClientFromRequest } from 'npm:@base44/sdk@0.8.21';
import Stripe from 'npm:stripe@17.7.0';

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY"));

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { customerId } = await req.json();

    if (!customerId) {
      return Response.json({ error: 'customerId is required' }, { status: 400 });
    }

    console.log(`Creating subscription schedule for customer: ${customerId}`);

    const schedule = await stripe.subscriptionSchedules.create({
      customer: customerId,
      default_settings: {
        invoice_settings: {
          rendering: {
            template: Deno.env.get("STRIPE_INVOICE_TEMPLATE_ID") || 'inrtem_1TDdo6C3pmDPDjgXhWQSPadf',
          },
        },
      },
      end_behavior: 'cancel',
      phases: [
        {
          automatic_tax: { enabled: true },
          currency: 'usd',
          items: [
            {
              price: Deno.env.get("STRIPE_PRICE_ID") || 'price_1TDdkMC3pmDPDjgXQqf6Odcz',
              quantity: 1,
            },
          ],
          iterations: 1,
          proration_behavior: 'always_invoice',
        },
      ],
      start_date: 'now',
    });

    console.log(`Subscription schedule created: ${schedule.id}`);

    return Response.json({ scheduleId: schedule.id, status: schedule.status });
  } catch (error) {
    console.error('Error creating subscription schedule:', error.message);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
});