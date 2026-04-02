import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";

/**
 * Subscription model:
 * - New users automatically get a 3-day free trial (no credit card)
 * - After trial expires, they must subscribe ($10/mo or $99/yr)
 * - "trialing" — free trial active
 * - "active" — paid subscription
 * - admin users always have access
 */
export default function useSubscription() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    base44.auth.me().then(async (u) => {
      // Auto-provision 3-day trial for new users with no subscription history
      if (u && !u.subscription_status && !u.trial_ends_at) {
        const trialEnd = new Date();
        trialEnd.setDate(trialEnd.getDate() + 3);
        try {
          await base44.entities.User.update(u.id, {
            subscription_status: "trialing",
            trial_ends_at: trialEnd.toISOString(),
          });
          u.subscription_status = "trialing";
          u.trial_ends_at = trialEnd.toISOString();
        } catch (err) {
          console.error("Failed to provision trial:", err);
        }
      }
      setUser(u);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const status = user?.subscription_status || "none";
  const isAdmin = user?.role === "admin";
  const isTrialing = status === "trialing";
  const isActive = status === "active";
  const isPastDue = status === "past_due";

  // Check if trial has expired
  const trialEndsAt = user?.trial_ends_at ? new Date(user.trial_ends_at) : null;
  const trialDaysLeft = trialEndsAt ? Math.max(0, Math.ceil((trialEndsAt - new Date()) / (1000 * 60 * 60 * 24))) : 0;
  const trialExpired = isTrialing && trialEndsAt && trialEndsAt <= new Date();

  // Access granted if admin, active subscription, or trialing AND trial hasn't expired
  const hasAccess = isAdmin || isActive || (isTrialing && !trialExpired);

  return {
    user,
    loading,
    status,
    isAdmin,
    isTrialing,
    isActive,
    isPastDue,
    hasAccess,
    trialEndsAt,
    trialDaysLeft,
    trialExpired,
  };
}
