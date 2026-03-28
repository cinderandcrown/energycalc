import { useState, useCallback } from "react";

const STORAGE_KEY = "ci_onboarding_completed";

/**
 * Hook to manage new user onboarding flow.
 * Uses localStorage to track completion (not dependent on backend entity field).
 */
export default function useOnboarding() {
  const [currentStep, setCurrentStep] = useState(0);

  const isCompleted = (() => {
    try {
      return localStorage.getItem(STORAGE_KEY) === "true";
    } catch {
      return false;
    }
  })();

  const [showOnboarding, setShowOnboarding] = useState(!isCompleted);

  const nextStep = useCallback(() => {
    setCurrentStep((prev) => prev + 1);
  }, []);

  const prevStep = useCallback(() => {
    setCurrentStep((prev) => Math.max(0, prev - 1));
  }, []);

  const completeOnboarding = useCallback(() => {
    try {
      localStorage.setItem(STORAGE_KEY, "true");
    } catch {
      // localStorage unavailable
    }
    setShowOnboarding(false);
  }, []);

  const skipOnboarding = useCallback(() => {
    completeOnboarding();
  }, [completeOnboarding]);

  return {
    showOnboarding,
    currentStep,
    nextStep,
    prevStep,
    completeOnboarding,
    skipOnboarding,
  };
}
