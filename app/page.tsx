"use client";

import EphemeralContent from "./ephemeral-environments-platform/components/EphemeralContent";
import KubernetesContent from "./kubernetes-management/components/KubernetesContent";
import CloudDevContent from "./cloud-development-environments/components/CloudDevContent";
import ReplicatedContent from "./replicated/components/ReplicatedContent";
import GitLabContent from "./gitlab/components/GitLabContent";
import { default as PaasContent } from "./platform-as-a-service/components/PaasContent";
import AIPipelineContent from "./ai-ready-infrastructure-pipeline/components/AIPipelineContent";
import { useVersion } from "@/lib/version/VersionContext";

export default function HomePage() {
  const { version } = useVersion();

  switch (version) {
    case "kubernetes":
      return <KubernetesContent />;
    case "cloud-dev":
      return <CloudDevContent />;
    case "replicated":
      return <ReplicatedContent />;
    case "gitlab":
      return <GitLabContent />;
    case "cloud":
      return <PaasContent />;
    case "ai-pipeline":
      return <AIPipelineContent />;
    case "ephemeral":
    default:
      return <EphemeralContent />;
  }
}
