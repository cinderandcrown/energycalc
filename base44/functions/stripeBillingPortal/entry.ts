import Stripe from "npm:stripe@14";
import { createClientFromRequest } from "npm:@base44/sdk@0.8.21";

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!user.stripe_customer_id) {
      return Response.json({ error: "No active subscription found" }, { status: 400 });
    }

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY"));
    const origin = req.headers.get("origin") || "https://app.base44.com";

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: user.stripe_customer_id,
      return_url: `${origin}/settings`,
    });

    console.log("Billing portal session created for:", user.email);
    return Response.json({ url: portalSession.url });
  } catch (error) {
    console.error("Billing portal error:", error.message);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
});