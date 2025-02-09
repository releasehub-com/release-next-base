"use client";

import { useEffect } from 'react';
import { getVersionFromPath, setVersionInStorage } from '@/config/versions';
import { usePathname } from 'next/navigation';

interface LandingPageWrapperProps {
  children: React.ReactNode;
}

export default function LandingPageWrapper({ children }: LandingPageWrapperProps) {
  const pathname = usePathname();

  useEffect(() => {
    const version = getVersionFromPath(pathname);
    console.log('LandingPageWrapper - Setting version for path:', {
      pathname,
      version
    });
    setVersionInStorage(version);
  }, [pathname]);

  return <>{children}</>;
} 