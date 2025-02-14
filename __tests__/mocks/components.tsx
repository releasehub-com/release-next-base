import React from "react";
import type { ComponentType } from "react";

// Basic mock components with data-testid for easy testing
const EphemeralLandingComponent = () => (
  <div data-testid="ephemeral-landing">Ephemeral Landing</div>
);
const GitLabLandingComponent = () => (
  <div data-testid="gitlab-landing">GitLab Landing</div>
);
const KubernetesLandingComponent = () => (
  <div data-testid="kubernetes-landing">Kubernetes Landing</div>
);
const ReplicatedLandingComponent = () => (
  <div data-testid="replicated-landing">Replicated Landing</div>
);
const CloudDevLandingComponent = () => (
  <div data-testid="cloud-dev-landing">Cloud Dev Landing</div>
);
const CloudLandingComponent = () => (
  <div data-testid="cloud-landing">Cloud Landing</div>
);
const AIPipelineLandingComponent = () => (
  <div data-testid="ai-pipeline-landing">AI Pipeline Landing</div>
);
const LandingPageComponent = () => (
  <div data-testid="default-landing">Landing Page</div>
);

// Map for dynamic imports
export const mockDynamicImport = (importFn: any) => {
  const importString = importFn.toString();
  let Component;

  if (importString.includes("GitLabContent"))
    Component = GitLabLandingComponent;
  else if (importString.includes("KubernetesContent"))
    Component = KubernetesLandingComponent;
  else if (importString.includes("ReplicatedContent"))
    Component = ReplicatedLandingComponent;
  else if (importString.includes("CloudDevContent"))
    Component = CloudDevLandingComponent;
  else if (importString.includes("PaasContent"))
    Component = CloudLandingComponent;
  else if (importString.includes("AIPipelineContent"))
    Component = AIPipelineLandingComponent;
  else if (importString.includes("EphemeralContent"))
    Component = EphemeralLandingComponent;
  else Component = LandingPageComponent;

  return Promise.resolve({ default: Component });
};

// Export individual components for direct use in tests
export const mockComponents = {
  LandingPage: LandingPageComponent,
  GitLabLandingPage: GitLabLandingComponent,
  KubernetesLandingPage: KubernetesLandingComponent,
  ReplicatedLandingPage: ReplicatedLandingComponent,
  EphemeralLanding: EphemeralLandingComponent,
  CloudDevLanding: CloudDevLandingComponent,
  CloudLanding: CloudLandingComponent,
  AIPipelineLanding: AIPipelineLandingComponent,
};

export default mockComponents;
