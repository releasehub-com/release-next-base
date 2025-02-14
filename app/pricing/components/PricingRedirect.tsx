"use client";

import { useEffect } from "react";

// Add a function that can be mocked in tests
export const navigateToExternalPricing = () => {
  window.location.href = "https://web.release.com/pricing";
};

export default function PricingRedirect() {
  useEffect(() => {
    // Use the mockable function
    navigateToExternalPricing();
  }, []);

  return null; // No UI is rendered as the page redirects immediately
}
