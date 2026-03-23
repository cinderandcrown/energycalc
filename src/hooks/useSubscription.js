import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";

/**
 * Subscription statuses that grant access:
 * - "trialing" — 3-day free trial (Stripe manages expiry)
 * - "active" — paid subscription
 * - admin users always have access
 */
export default function useSubscription() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    base44.auth.me().then(u => {
      setUser(u);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const status = user?.subscription_status || "none";
  const isAdmin = user?.role === "admin";
  const isTrialing = status === "trialing";
  const isActive = status === "active";
  const isPastDue = status === "past_due";

  // Access granted if admin, trialing, or active subscription
  const hasAccess = isAdmin || isTrialing || isActive;

  // Trial info
  const trialEndsAt = user?.trial_ends_at ? new Date(user.trial_ends_at) : null;
  const trialDaysLeft = trialEndsAt ? Math.max(0, Math.ceil((trialEndsAt - new Date()) / (1000 * 60 * 60 * 24))) : 0;

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
  };
}