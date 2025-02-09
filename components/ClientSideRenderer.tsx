"use client";

console.log("ClientSideRenderer - File loaded");

import React, { useState, useEffect } from "react";
import { useSearchParams, usePathname } from "next/navigation";
import dynamic from "next/dynamic";
import {
  getVersionFromStorage,
  isValidVersion,
  setVersionInStorage,
  getVersionFromPath,
  getCanonicalVersion,
  type VersionId,
  STORAGE_KEY,
} from "@/config/versions";
import LandingWrapper from "@/components/LandingWrapper";

const LandingPage = dynamic(() => import("@/components/LandingPage"), {
  ssr: false,
});
const GitLabLandingPage = dynamic(
  () => import("@/components/GitLabLandingPage"),
  { ssr: false },
);
const KubernetesLandingPage = dynamic(
  () => import("@/components/KubernetesLandingPage"),
  { ssr: false },
);
const ReplicatedLandingPage = dynamic(
  () => import("@/components/ReplicatedLandingPage"),
  { ssr: false },
);
const EphemeralLanding = dynamic(
  () => import("@/components/EphemeralLanding"),
  { ssr: false },
);
const CloudDevLanding = dynamic(() => import("@/components/CloudDevLanding"), {
  ssr: false,
});
const CloudLanding = dynamic(() => import("@/components/CloudLanding"), {
  ssr: false,
});

export default function ClientSideRenderer() {
  console.log("ClientSideRenderer - Component mounting");

  const [isLoading, setIsLoading] = useState(true);
  const [version, setVersion] = useState<VersionId | null>(null);
  const [componentsLoaded, setComponentsLoaded] = useState(false);
  const searchParams = useSearchParams();
  const pathname = usePathname();

  useEffect(() => {
    async function initializeComponent() {
      console.log("ClientSideRenderer - Initial mount effect");
      const versionParam = searchParams.get("version");
      const pathVersion = getVersionFromPath(pathname);
      const storedVersion = getVersionFromStorage();

      console.log("ClientSideRenderer - Version Resolution:", {
        versionParam,
        pathVersion,
        storedVersion,
        pathname,
        localStorage: localStorage.getItem(STORAGE_KEY),
      });

      // Priority: URL param > path > localStorage > default
      const resolvedVersion =
        versionParam && isValidVersion(versionParam)
          ? getCanonicalVersion(versionParam)
          : pathVersion && isValidVersion(pathVersion)
            ? getCanonicalVersion(pathVersion)
            : storedVersion;

      console.log("ClientSideRenderer - Setting version to:", resolvedVersion);
      setVersion(resolvedVersion);
      setVersionInStorage(resolvedVersion);

      // Load components after version is resolved
      console.log("ClientSideRenderer - Loading components...");
      await Promise.all([
        import("@/components/LandingPage"),
        import("@/components/GitLabLandingPage"),
        import("@/components/KubernetesLandingPage"),
        import("@/components/ReplicatedLandingPage"),
        import("@/components/EphemeralLanding"),
        import("@/components/CloudDevLanding"),
        import("@/components/CloudLanding"),
      ]);

      console.log("ClientSideRenderer - Components loaded");
      setComponentsLoaded(true);
      setIsLoading(false);
    }

    initializeComponent();
  }, [searchParams, pathname]);

  if (isLoading || !version || !componentsLoaded) {
    console.log("ClientSideRenderer - In loading state:", {
      isLoading,
      version,
      componentsLoaded,
    });
    return <div className="min-h-screen bg-gray-900" />;
  }

  console.log("ClientSideRenderer - Rendering with version:", version);
  return (
    <LandingWrapper
      initialVersion={version}
      LandingPage={LandingPage}
      GitLabLandingPage={GitLabLandingPage}
      KubernetesLandingPage={KubernetesLandingPage}
      ReplicatedLandingPage={ReplicatedLandingPage}
      EphemeralLanding={EphemeralLanding}
      CloudDevLanding={CloudDevLanding}
      CloudLanding={CloudLanding}
    />
  );
}
