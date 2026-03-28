import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "ci_exit_intent_dismissed";
const COOLDOWN_DAYS = 7;

/**
 * Detects exit intent (mouse leaves viewport on desktop).
 * Throttled to once per 7 days via localStorage.
 */
export default function useExitIntent() {
  const [showPopup, setShowPopup] = useState(false);

  const dismiss = useCallback(() => {
    setShowPopup(false);
    try {
      localStorage.setItem(STORAGE_KEY, Date.now().toString());
    } catch {
      // localStorage unavailable
    }
  }, []);

  useEffect(() => {
    // Check cooldown
    try {
      const lastDismissed = localStorage.getItem(STORAGE_KEY);
      if (lastDismissed) {
        const daysSince = (Date.now() - parseInt(lastDismissed, 10)) / (1000 * 60 * 60 * 24);
        if (daysSince < COOLDOWN_DAYS) return;
      }
    } catch {
      // localStorage unavailable — proceed
    }

    let triggered = false;

    const handleMouseLeave = (e) => {
      if (triggered) return;
      // Only trigger when mouse leaves through the top of the viewport
      if (e.clientY <= 0) {
        triggered = true;
        setShowPopup(true);
      }
    };

    // Delay adding listener to avoid triggering on page load
    const timer = setTimeout(() => {
      document.addEventListener("mouseleave", handleMouseLeave);
    }, 5000);

    return () => {
      clearTimeout(timer);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return { showPopup, dismiss };
}
