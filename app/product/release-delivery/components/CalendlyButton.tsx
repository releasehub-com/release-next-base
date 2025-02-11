'use client';

import Script from 'next/script';
import { useEffect, useState } from 'react';

interface CalendlyButtonProps {
  className?: string;
  children: React.ReactNode;
}

declare global {
  interface Window {
    Calendly?: any;
  }
}

export default function CalendlyButton({ className, children }: CalendlyButtonProps) {
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);

  useEffect(() => {
    // Add Calendly stylesheet
    const link = document.createElement('link');
    link.href = 'https://assets.calendly.com/assets/external/widget.css';
    link.rel = 'stylesheet';
    document.head.appendChild(link);

    return () => {
      document.head.removeChild(link);
    };
  }, []);

  const openCalendly = () => {
    if (isScriptLoaded && window.Calendly) {
      window.Calendly.initPopupWidget({
        url: 'https://calendly.com/release-tommy/release-delivery'
      });
    }
  };

  return (
    <>
      <Script
        src="https://assets.calendly.com/assets/external/widget.js"
        onLoad={() => setIsScriptLoaded(true)}
        strategy="lazyOnload"
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