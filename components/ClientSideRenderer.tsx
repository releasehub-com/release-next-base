"use client";

console.log('ClientSideRenderer - File loaded');

import React, { useState, useEffect } from "react";
import { useSearchParams, usePathname } from "next/navigation";
import dynamic from "next/dynamic";
import { 
  getVersionFromStorage, 
  isValidVersion, 
  setVersionInStorage,
  getVersionFromPath,
  type VersionId,
  STORAGE_KEY 
} from '@/lib/landingVersions';
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
  () =>
    import("@/components/ReplicatedLandingPage").then(
      (mod) => mod.ReleaseVsReplicated,
    ),
  { ssr: false },
);
const EphemeralLanding = dynamic(
  () => import("@/components/EphemeralLanding").then((mod) => mod.default),
  { ssr: false },
);
const CloudDevLanding = dynamic(
  () => import("@/components/CloudDevLanding").then((mod) => mod.default),
  { ssr: false },
);
const CloudLanding = dynamic(
  () => import("@/components/CloudLanding").then((mod) => mod.default),
  { ssr: false },
);

export default function ClientSideRenderer() {
  console.log('ClientSideRenderer - Component mounting');
  
  const [isLoading, setIsLoading] = useState(true);
  const [version, setVersion] = useState<VersionId | null>(null);
  const searchParams = useSearchParams();
  const pathname = usePathname();
  
  useEffect(() => {
    console.log('ClientSideRenderer - Initial mount effect');
    const versionParam = searchParams.get('version');
    const pathVersion = getVersionFromPath(pathname);
    const storedVersion = getVersionFromStorage();
    
    console.log('ClientSideRenderer - Version Resolution:', {
      versionParam,
      pathVersion,
      storedVersion,
      pathname,
      localStorage: localStorage.getItem(STORAGE_KEY)
    });

    // Priority: URL param > path > localStorage > default
    const resolvedVersion = (versionParam && isValidVersion(versionParam))
      ? versionParam
      : (pathVersion && isValidVersion(pathVersion))
        ? pathVersion
        : storedVersion;
    
    console.log('ClientSideRenderer - Setting version to:', resolvedVersion);
    
    setVersion(resolvedVersion);
    setVersionInStorage(resolvedVersion);
  }, [searchParams, pathname]);

  // Component loading effect
  useEffect(() => {
    console.log('ClientSideRenderer - Loading components...');
    Promise.all([
      import("@/components/LandingPage"),
      import("@/components/GitLabLandingPage"),
      import("@/components/KubernetesLandingPage"),
      import("@/components/ReplicatedLandingPage"),
      import("@/components/EphemeralLanding"),
      import("@/components/CloudDevLanding"),
      import("@/components/CloudLanding"),
    ]).then(() => {
      console.log('ClientSideRenderer - Components loaded');
      setIsLoading(false);
    });
  }, []);

  if (isLoading || !version) {
    console.log('ClientSideRenderer - In loading state:', { isLoading, version });
    return <div className="min-h-screen bg-gray-900" />;
  }

  console.log('ClientSideRenderer - Rendering with version:', version);
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
