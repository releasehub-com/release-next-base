"use client";

import Script from "next/script";
import { useEffect, useState, useCallback } from "react";

interface CalendlyButtonProps {
  className?: string;
  children: React.ReactNode;
  url?: string;
}

type CalendlyWidgetOptions = {
  url: string;
};

interface CalendlyInterface {
  initPopupWidget: (options: CalendlyWidgetOptions) => void;
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
  useEffect(() => {
    const link: HTMLLinkElement = document.createElement("link");
    link.href = "https://assets.calendly.com/assets/external/widget.css";
    link.rel = "stylesheet";
    document.head.appendChild(link);

    return () => {
      if (document.head.contains(link)) {
        document.head.removeChild(link);
      }
    };
  }, []);

  const openCalendly = useCallback((): void => {
    console.log('Opening Calendly:', { hasCalendly: !!window.Calendly, url });
    if (window.Calendly) {
      window.Calendly.initPopupWidget({
        url,
      });
    }
  }, [url]);

  return (
    <>
      <Script
        src="https://assets.calendly.com/assets/external/widget.js"
        strategy="beforeInteractive"
      />
      <button 
        onClick={openCalendly} 
        className={className} 
        type="button"
      >
        {children}
      </button>
    </>
  );
}
