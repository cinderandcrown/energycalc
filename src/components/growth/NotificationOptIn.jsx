import { Button } from "@/components/ui/button";
import { Bell, BellRing, Check, Loader2 } from "lucide-react";
import usePushNotifications from "@/hooks/usePushNotifications";

/**
 * Push notification opt-in prompt.
 * Shows a bell icon with CTA to enable notifications.
 */
export default function NotificationOptIn({ compact = false }) {
  const { isSupported, permission, subscribed, loading, subscribe } = usePushNotifications();

  if (!isSupported) return null;

  if (subscribed || permission === "granted") {
    return (
      <div className="flex items-center gap-2 py-2 px-3 rounded-xl bg-drill-green/10 border border-drill-green/20">
        <Check className="w-4 h-4 text-drill-green shrink-0" aria-hidden="true" />
        <span className="text-xs font-medium text-drill-green">Notifications enabled</span>
      </div>
    );
  }

  if (permission === "denied") {
    return (
      <div className="flex items-center gap-2 py-2 px-3 rounded-xl bg-muted/30 border border-border">
        <Bell className="w-4 h-4 text-muted-foreground shrink-0" aria-hidden="true" />
        <span className="text-xs text-muted-foreground">Notifications blocked. Enable in browser settings.</span>
      </div>
    );
  }

  if (compact) {
    return (
      <Button
        onClick={subscribe}
        disabled={loading}
        size="sm"
        variant="outline"
        className="gap-1.5 text-xs"
      >
        {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Bell className="w-3.5 h-3.5" />}
        Enable Notifications
      </Button>
    );
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-5 space-y-3">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-crude-gold/10 flex items-center justify-center shrink-0">
          <BellRing className="w-5 h-5 text-crude-gold" aria-hidden="true" />
        </div>
        <div>
          <h3 className="font-bold text-foreground text-sm">Enable Push Notifications</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Get instant price alerts and daily market briefs delivered to your device.
          </p>
        </div>
      </div>
      <Button
        onClick={subscribe}
        disabled={loading}
        className="w-full bg-crude-gold text-petroleum font-semibold hover:bg-crude-gold/90 gap-2"
      >
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Bell className="w-4 h-4" />}
        {loading ? "Enabling..." : "Enable Notifications"}
      </Button>
    </div>
  );
}
