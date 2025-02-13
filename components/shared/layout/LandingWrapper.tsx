"use client";

import { useEffect, useState, ComponentType } from "react";
import Header from "@/components/shared/layout/Header";
import Footer from "@/components/shared/layout/Footer";
import {
  getVersionFromStorage,
  isValidVersion,
  setVersionInStorage,
  getVersionFromPath,
  type VersionId,
  STORAGE_KEY,
  DEFAULT_VERSION,
} from "@/config/versions";

interface LandingWrapperProps {
  initialVersion: VersionId;
  LandingPage: ComponentType;
  GitLabLandingPage: ComponentType;
  KubernetesLandingPage: ComponentType;
  ReplicatedLandingPage: ComponentType;
  EphemeralLanding: ComponentType;
  CloudDevLanding: ComponentType;
  CloudLanding: ComponentType;
  AIPipelineLanding: ComponentType;
}

export default function LandingWrapper({
  initialVersion,
  LandingPage,
  GitLabLandingPage,
  KubernetesLandingPage,
  ReplicatedLandingPage,
  EphemeralLanding,
  CloudDevLanding,
  CloudLanding,
  AIPipelineLanding,
}: LandingWrapperProps) {
  console.log("LandingWrapper - Mounting with version:", initialVersion);

  const [CurrentComponent, setCurrentComponent] =
    useState<ComponentType | null>(() => {
      console.log(
        "LandingWrapper - Initial component selection for:",
        initialVersion,
      );
      switch (initialVersion) {
        case "gitlab":
          return GitLabLandingPage;
        case "kubernetes":
          return KubernetesLandingPage;
        case "replicated":
          return ReplicatedLandingPage;
        case "cloud-dev":
          return CloudDevLanding;
        case "cloud":
          return CloudLanding;
        case "ephemeral":
        case "ai-pipeline":
        default:
          return LandingPage;
      }
    });

  useEffect(() => {
    console.log("LandingWrapper - Version change effect:", initialVersion);
    let newComponent: ComponentType | null = null;

    switch (initialVersion) {
      case "gitlab":
        newComponent = GitLabLandingPage;
        break;
      case "kubernetes":
        newComponent = KubernetesLandingPage;
        break;
      case "replicated":
        newComponent = ReplicatedLandingPage;
        break;
      case "cloud-dev":
        newComponent = CloudDevLanding;
        break;
      case "cloud":
        newComponent = CloudLanding;
        break;
      case "ephemeral":
      case "ai-pipeline":
      default:
        newComponent = LandingPage;
        break;
    }

    if (newComponent && newComponent !== CurrentComponent) {
      console.log(
        "LandingWrapper - Updating component for version:",
        initialVersion,
      );
      setCurrentComponent(newComponent);
    }
  }, [
    initialVersion,
    GitLabLandingPage,
    KubernetesLandingPage,
    ReplicatedLandingPage,
    EphemeralLanding,
    CloudDevLanding,
    CloudLanding,
    LandingPage,
    CurrentComponent,
  ]);

  if (!CurrentComponent) {
    return <div className="min-h-screen bg-gray-900">Loading...</div>;
  }

  return <CurrentComponent />;
}
