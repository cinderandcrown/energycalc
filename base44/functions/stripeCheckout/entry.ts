import Stripe from "npm:stripe@14";
import { createClientFromRequest } from "npm:@base44/sdk@0.8.21";

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { productId } = await req.json();

    if (!productId) {
      return Response.json({ error: "productId is required" }, { status: 400 });
    }

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY"));

    // Get prices for this product
    const prices = await stripe.prices.list({ product: productId, active: true, limit: 1 });

    if (!prices.data.length) {
      console.error("No active price found for product:", productId);
      return Response.json({ error: "No active price found for this product" }, { status: 404 });
    }

    const price = prices.data[0];
    const origin = req.headers.get("origin") || "https://app.base44.com";
    const isSubscription = !!price.recurring;

    // Check if user already has a Stripe customer, reuse it
    let customerId = user.stripe_customer_id || null;
    if (!customerId) {
      // Check if a customer with this email already exists in Stripe
      const existingCustomers = await stripe.customers.list({ email: user.email, limit: 1 });
      if (existingCustomers.data.length > 0) {
        customerId = existingCustomers.data[0].id;
      }
    }

    const sessionParams = {
      mode: isSubscription ? "subscription" : "payment",
      payment_method_types: ["card", "link"],
      line_items: [{ price: price.id, quantity: 1 }],
      success_url: `${origin}/dashboard?subscribed=true`,
      cancel_url: `${origin}/`,
      metadata: {
        base44_app_id: Deno.env.get("BASE44_APP_ID"),
        user_id: user.id,
        user_email: user.email,
      },
    };

    // If we have an existing customer, use it; otherwise let Stripe create one from email
    if (customerId) {
      sessionParams.customer = customerId;
    } else {
      sessionParams.customer_email = user.email;
    }

    // No Stripe trial — trial is handled at signup (3 days free, no credit card).
    // When user subscribes, they pay immediately.
    if (isSubscription) {
      sessionParams.subscription_data = {
        metadata: {
          base44_app_id: Deno.env.get("BASE44_APP_ID"),
          user_id: user.id,
          user_email: user.email,
        },
      };
    }

    const session = await stripe.checkout.sessions.create(sessionParams);

    console.log("Checkout session created:", session.id, "for user:", user.email);
    return Response.json({ url: session.url });
  } catch (error) {
    console.error("Stripe checkout error:", error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});