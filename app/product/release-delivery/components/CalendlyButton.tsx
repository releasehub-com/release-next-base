"use client";

import Script from "next/script";
import { useEffect } from "react";
import React from "react";

interface CalendlyButtonProps {
  className?: string;
  children: React.ReactNode;
  url?: string;
}

interface CalendlyInterface {
  initPopupWidget: (options: { url: string }) => void;
}

declare global {
  interface Window {
    Calendly?: CalendlyInterface | undefined;
  }
}

export default function CalendlyButton({
  className,
  children,
  url = "https://calendly.com/release-tommy/release-delivery",
}: CalendlyButtonProps): JSX.Element {
  const [isReady, setIsReady] = React.useState(false);

  useEffect(() => {
    // Check if Calendly is already loaded
    if (window.Calendly) {
      setIsReady(true);
      return;
    }

    // Check if style is already loaded
    const existingLink = document.querySelector(
      'link[href*="calendly.com/assets/external/widget.css"]',
    );
    if (!existingLink) {
      const link = document.createElement("link");
      link.href = "https://assets.calendly.com/assets/external/widget.css";
      link.rel = "stylesheet";
      document.head.appendChild(link);
    }

    // Start checking for Calendly object
    const checkCalendly = setInterval(() => {
      if (window.Calendly) {
        setIsReady(true);
        clearInterval(checkCalendly);
      }
    }, 100);

    return () => {
      clearInterval(checkCalendly);
    };
  }, []);

  const openCalendly = () => {
    if (window.Calendly) {
      window.Calendly.initPopupWidget({ url });
    }
  };

  return (
    <>
      <Script
        src="https://assets.calendly.com/assets/external/widget.js"
        strategy="lazyOnload"
      />
      <button
        onClick={openCalendly}
        className={`${className} ${!isReady ? "opacity-50" : ""}`}
        type="button"
        disabled={!isReady}
      >
        {children}
      </button>
    </>
  );
}
