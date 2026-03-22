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

    const session = await stripe.checkout.sessions.create({
      mode: price.recurring ? "subscription" : "payment",
      line_items: [{ price: price.id, quantity: 1 }],
      customer_email: user.email,
      success_url: `${origin}/dashboard?subscribed=true`,
      cancel_url: `${origin}/`,
      metadata: {
        base44_app_id: Deno.env.get("BASE44_APP_ID"),
        user_id: user.id,
        user_email: user.email,
      },
    });

    console.log("Checkout session created:", session.id, "for user:", user.email);
    return Response.json({ url: session.url });
  } catch (error) {
    console.error("Stripe checkout error:", error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});