import { useEffect, useState, useCallback } from "react";

const REF_STORAGE_KEY = "ci_referral_code";

/**
 * Referral tracking hook.
 * Reads `ref` query param from URL, stores in localStorage for attribution.
 */
export default function useReferral() {
  const [referralCode, setReferralCode] = useState("");

  useEffect(() => {
    // Check URL for referral code
    const params = new URLSearchParams(window.location.search);
    const ref = params.get("ref");
    if (ref) {
      try {
        localStorage.setItem(REF_STORAGE_KEY, ref);
      } catch {
        // localStorage unavailable
      }
      setReferralCode(ref);
      // Clean the URL without reload
      const url = new URL(window.location.href);
      url.searchParams.delete("ref");
      window.history.replaceState({}, "", url.toString());
    } else {
      try {
        const stored = localStorage.getItem(REF_STORAGE_KEY);
        if (stored) setReferralCode(stored);
      } catch {
        // localStorage unavailable
      }
    }
  }, []);

  const getStoredReferralCode = useCallback(() => {
    try {
      return localStorage.getItem(REF_STORAGE_KEY) || "";
    } catch {
      return "";
    }
  }, []);

  const clearReferralCode = useCallback(() => {
    try {
      localStorage.removeItem(REF_STORAGE_KEY);
    } catch {
      // localStorage unavailable
    }
    setReferralCode("");
  }, []);

  return { referralCode, getStoredReferralCode, clearReferralCode };
}
