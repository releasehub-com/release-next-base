"use client";

import { useEffect } from "react";
import { getVersionFromPath, setVersionInStorage } from "@/config/versions";
import { usePathname } from "next/navigation";
import Head from "next/head";

interface LandingPageWrapperProps {
  children: React.ReactNode;
}

export default function LandingPageWrapper({
  children,
}: LandingPageWrapperProps) {
  const pathname = usePathname();

  useEffect(() => {
    const version = getVersionFromPath(pathname);
    console.log("LandingPageWrapper - Setting version for path:", {
      pathname,
      version,
    });
    setVersionInStorage(version);
  }, [pathname]);

  return (
    <>
      <Head>
        <link rel="canonical" href={`https://release.com${pathname}`} />
      </Head>
      {children}
    </>
  );
}
