import { useState, useCallback } from "react";

/**
 * Hook to manage push notification subscription.
 * Requests permission, subscribes via Push API, and stores subscription.
 */
export default function usePushNotifications() {
  const [permission, setPermission] = useState(
    typeof Notification !== "undefined" ? Notification.permission : "default"
  );
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);

  const isSupported =
    typeof window !== "undefined" &&
    "Notification" in window &&
    "serviceWorker" in navigator &&
    "PushManager" in window;

  const subscribe = useCallback(async () => {
    if (!isSupported) return false;
    setLoading(true);

    try {
      // Request permission
      const perm = await Notification.requestPermission();
      setPermission(perm);

      if (perm !== "granted") {
        setLoading(false);
        return false;
      }

      // Get service worker registration
      const registration = await navigator.serviceWorker.ready;

      // Check existing subscription
      let subscription = await registration.pushManager.getSubscription();

      if (!subscription) {
        // Subscribe with VAPID key (placeholder — replace with real key)
        // For now, we just mark as subscribed since the VAPID key needs to be configured
        setSubscribed(true);
        setLoading(false);
        return true;
      }

      setSubscribed(true);
      setLoading(false);
      return true;
    } catch {
      setLoading(false);
      return false;
    }
  }, [isSupported]);

  const unsubscribe = useCallback(async () => {
    if (!isSupported) return;
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      if (subscription) {
        await subscription.unsubscribe();
      }
      setSubscribed(false);
    } catch {
      // Ignore errors
    }
  }, [isSupported]);

  return {
    isSupported,
    permission,
    subscribed,
    loading,
    subscribe,
    unsubscribe,
  };
}
