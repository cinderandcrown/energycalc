import Stripe from "npm:stripe@14";
import { createClientFromRequest } from "npm:@base44/sdk@0.8.21";

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY"));

    const body = await req.text();
    const signature = req.headers.get("stripe-signature");
    const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");

    let event;
    try {
      event = await stripe.webhooks.constructEventAsync(body, signature, webhookSecret);
    } catch (err) {
      console.error("Webhook signature verification failed:", err.message);
      return Response.json({ error: "Invalid signature" }, { status: 400 });
    }

    console.log("Stripe webhook event:", event.type, event.id);

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const email = session.customer_email || session.customer_details?.email;
      const customerId = session.customer;
      const subscriptionId = session.subscription;

      console.log("Checkout completed for:", email, "customer:", customerId, "subscription:", subscriptionId);

      if (email) {
        const users = await base44.asServiceRole.entities.User.filter({ email });
        if (users.length > 0) {
          await base44.asServiceRole.entities.User.update(users[0].id, {
            subscription_status: "active",
            stripe_customer_id: customerId,
            stripe_subscription_id: subscriptionId,
            subscription_plan: "pro",
          });
          console.log("User updated to active subscription:", email);
        } else {
          console.log("No user found with email:", email);
        }
      }
    }

    if (event.type === "customer.subscription.updated") {
      const subscription = event.data.object;
      const customerId = subscription.customer;
      const status = subscription.status; // active, past_due, canceled, etc.

      console.log("Subscription updated:", customerId, "status:", status);

      const users = await base44.asServiceRole.entities.User.filter({ stripe_customer_id: customerId });
      if (users.length > 0) {
        await base44.asServiceRole.entities.User.update(users[0].id, {
          subscription_status: status === "active" ? "active" : "inactive",
        });
        console.log("User subscription status updated:", status);
      }
    }

    if (event.type === "customer.subscription.deleted") {
      const subscription = event.data.object;
      const customerId = subscription.customer;

      console.log("Subscription deleted for customer:", customerId);

      const users = await base44.asServiceRole.entities.User.filter({ stripe_customer_id: customerId });
      if (users.length > 0) {
        await base44.asServiceRole.entities.User.update(users[0].id, {
          subscription_status: "inactive",
          stripe_subscription_id: null,
          subscription_plan: null,
        });
        console.log("User subscription cancelled:", users[0].email);
      }
    }

    return Response.json({ received: true });
  } catch (error) {
    console.error("Webhook handler error:", error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});