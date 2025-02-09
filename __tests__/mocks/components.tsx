import React from "react";
import type { ComponentType } from "react";

// Basic mock components with data-testid for easy testing
export const mockComponents = {
  EphemeralLanding: () => (
    <div data-testid="ephemeral-landing">Ephemeral Landing</div>
  ),
  GitLabLandingPage: () => (
    <div data-testid="gitlab-landing">GitLab Landing</div>
  ),
  KubernetesLandingPage: () => (
    <div data-testid="kubernetes-landing">Kubernetes Landing</div>
  ),
  ReplicatedLandingPage: () => (
    <div data-testid="replicated-landing">Replicated Landing</div>
  ),
  CloudDevLanding: () => (
    <div data-testid="cloud-dev-landing">Cloud Dev Landing</div>
  ),
  CloudLanding: () => <div data-testid="cloud-landing">Cloud Landing</div>,
  LandingPage: () => <div data-testid="default-landing">Landing Page</div>,
};

// Helper to create a mock component with a specific testId
export const createMockComponent = (testId: string): ComponentType => {
  const Component = () => <div data-testid={testId}>{testId}</div>;
  Component.displayName = `Mock${testId}Component`;
  return Component;
};

// Map for dynamic imports
export const mockDynamicImport = (importFn: any) => {
  const importString = importFn.toString();
  if (importString.includes("GitLabLandingPage"))
    return mockComponents.GitLabLandingPage;
  if (importString.includes("KubernetesLandingPage"))
    return mockComponents.KubernetesLandingPage;
  if (importString.includes("ReplicatedLandingPage"))
    return mockComponents.ReplicatedLandingPage;
  if (importString.includes("CloudDevLanding"))
    return mockComponents.CloudDevLanding;
  if (importString.includes("CloudLanding")) return mockComponents.CloudLanding;
  if (importString.includes("LandingPage")) return mockComponents.LandingPage;
  return mockComponents.EphemeralLanding;
};

// Export individual components for direct use in tests
export const {
  EphemeralLanding,
  GitLabLandingPage,
  KubernetesLandingPage,
  ReplicatedLandingPage,
  CloudDevLanding,
  CloudLanding,
  LandingPage,
} = mockComponents;
