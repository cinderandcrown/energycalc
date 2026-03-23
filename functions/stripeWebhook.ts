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

    // Helper to find user by email or customer ID
    const findUser = async (email, customerId) => {
      if (customerId) {
        const byCustomer = await base44.asServiceRole.entities.User.filter({ stripe_customer_id: customerId });
        if (byCustomer.length > 0) return byCustomer[0];
      }
      if (email) {
        const byEmail = await base44.asServiceRole.entities.User.filter({ email });
        if (byEmail.length > 0) return byEmail[0];
      }
      return null;
    };

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const email = session.customer_email || session.customer_details?.email;
      const customerId = session.customer;
      const subscriptionId = session.subscription;

      console.log("Checkout completed for:", email, "customer:", customerId, "subscription:", subscriptionId);

      const foundUser = await findUser(email, customerId);
      if (foundUser) {
        // If subscription, fetch it to check trial status
        let status = "active";
        let trialEndsAt = null;
        if (subscriptionId) {
          const sub = await stripe.subscriptions.retrieve(subscriptionId);
          status = sub.status; // "trialing" or "active"
          if (sub.trial_end) {
            trialEndsAt = new Date(sub.trial_end * 1000).toISOString();
          }
        }

        await base44.asServiceRole.entities.User.update(foundUser.id, {
          subscription_status: status,
          stripe_customer_id: customerId,
          stripe_subscription_id: subscriptionId,
          subscription_plan: "pro",
          trial_ends_at: trialEndsAt,
        });
        console.log("User updated:", email, "status:", status, "trial_ends:", trialEndsAt);
      } else {
        console.error("No user found with email:", email);
      }
    }

    if (event.type === "customer.subscription.updated") {
      const subscription = event.data.object;
      const customerId = subscription.customer;
      const status = subscription.status;

      console.log("Subscription updated:", customerId, "status:", status);

      // Get customer email for fallback lookup
      const customer = await stripe.customers.retrieve(customerId);
      const foundUser = await findUser(customer.email, customerId);

      if (foundUser) {
        const updateData = {
          subscription_status: status, // trialing, active, past_due, canceled, etc.
        };
        if (subscription.trial_end) {
          updateData.trial_ends_at = new Date(subscription.trial_end * 1000).toISOString();
        }
        await base44.asServiceRole.entities.User.update(foundUser.id, updateData);
        console.log("User subscription status updated:", foundUser.email, "->", status);
      }
    }

    if (event.type === "customer.subscription.deleted") {
      const subscription = event.data.object;
      const customerId = subscription.customer;

      console.log("Subscription deleted for customer:", customerId);

      const customer = await stripe.customers.retrieve(customerId);
      const foundUser = await findUser(customer.email, customerId);

      if (foundUser) {
        await base44.asServiceRole.entities.User.update(foundUser.id, {
          subscription_status: "inactive",
          stripe_subscription_id: null,
          subscription_plan: null,
          trial_ends_at: null,
        });
        console.log("User subscription cancelled:", foundUser.email);
      }
    }

    return Response.json({ received: true });
  } catch (error) {
    console.error("Webhook handler error:", error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});