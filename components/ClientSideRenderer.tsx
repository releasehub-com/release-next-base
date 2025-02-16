"use client";

console.log("ClientSideRenderer - File loaded");

import React, { useState, useEffect } from "react";
import { useSearchParams, usePathname } from "next/navigation";
import dynamic from "next/dynamic";
import { useVersion } from "@/lib/version/VersionContext";
import LandingWrapper from "@/components/shared/layout/LandingWrapper";

const EphemeralContent = dynamic(
  () =>
    import("@/app/ephemeral-environments-platform/components/EphemeralContent"),
  { ssr: false },
);

const KubernetesContent = dynamic(
  () => import("@/app/kubernetes-management/components/KubernetesContent"),
  { ssr: false },
);

const CloudDevContent = dynamic(
  () =>
    import("@/app/cloud-development-environments/components/CloudDevContent"),
  { ssr: false },
);

const ReplicatedContent = dynamic(
  () => import("@/app/replicated/components/ReplicatedContent"),
  { ssr: false },
);

const GitLabContent = dynamic(
  () => import("@/app/gitlab/components/GitLabContent"),
  { ssr: false },
);

const PaasContent = dynamic(
  () => import("@/app/platform-as-a-service/components/PaasContent"),
  { ssr: false },
);

const AIPipelineContent = dynamic(
  () =>
    import(
      "@/app/ai-ready-infrastructure-pipeline/components/AIPipelineContent"
    ),
  { ssr: false },
);

export default function ClientSideRenderer() {
  console.log("ClientSideRenderer - Component mounting");

  const [isLoading, setIsLoading] = useState(true);
  const [componentsLoaded, setComponentsLoaded] = useState(false);
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { version } = useVersion();

  useEffect(() => {
    async function initializeComponent() {
      // Load components
      console.log("ClientSideRenderer - Loading components...");
      await Promise.all([
        import(
          "@/app/ephemeral-environments-platform/components/EphemeralContent"
        ),
        import("@/app/kubernetes-management/components/KubernetesContent"),
        import(
          "@/app/cloud-development-environments/components/CloudDevContent"
        ),
        import("@/app/replicated/components/ReplicatedContent"),
        import("@/app/gitlab/components/GitLabContent"),
        import("@/app/platform-as-a-service/components/PaasContent"),
        import(
          "@/app/ai-ready-infrastructure-pipeline/components/AIPipelineContent"
        ),
      ]);

      console.log("ClientSideRenderer - Components loaded");
      setComponentsLoaded(true);
      setIsLoading(false);
    }

    initializeComponent();
  }, []);

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
      LandingPage={EphemeralContent}
      GitLabLandingPage={GitLabContent}
      KubernetesLandingPage={KubernetesContent}
      ReplicatedLandingPage={ReplicatedContent}
      EphemeralLanding={EphemeralContent}
      CloudDevLanding={CloudDevContent}
      CloudLanding={PaasContent}
      AIPipelineLanding={AIPipelineContent}
    />
  );
}
