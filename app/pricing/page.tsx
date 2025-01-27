'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function PricingPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the external pricing URL
    window.location.href = 'https://web.release.com/pricing';
  }, []);

  return null; // No UI is rendered as the page redirects immediately
}

