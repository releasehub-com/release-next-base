"use client";

import { useEffect, useState, ComponentType } from "react";
import Header from "@/components/shared/layout/Header";
import Footer from "@/components/shared/layout/Footer";
import { useMediaQuery } from "@/hooks/useMediaQuery";
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
  const isMobile = useMediaQuery("(max-width: 768px)");

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
        case "ai-pipeline":
          return AIPipelineLanding;
        case "ephemeral":
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
      case "ai-pipeline":
        newComponent = AIPipelineLanding;
        break;
      case "ephemeral":
      default:
        newComponent = LandingPage;
        break;
    }

    if (newComponent) {
      console.log(
        "LandingWrapper - Updating component for version:",
        initialVersion,
      );
      setCurrentComponent(() => newComponent);
    }
  }, [
    initialVersion,
    GitLabLandingPage,
    KubernetesLandingPage,
    ReplicatedLandingPage,
    CloudDevLanding,
    CloudLanding,
    AIPipelineLanding,
    LandingPage,
  ]);

  useEffect(() => {
    // Preserve scroll position on layout changes
    const scrollY = window.scrollY;
    window.scrollTo(0, scrollY);
  }, [isMobile]);

  if (!CurrentComponent) {
    return null;
  }

  const layoutClass = isMobile ? "mobile-layout" : "desktop-layout";
  const versionLayoutClass = `${initialVersion}-${isMobile ? "mobile" : "desktop"}-layout`;

  return (
    <div className={`${layoutClass} ${versionLayoutClass}`}>
      <Header />
      <main>
        <div data-testid={`${initialVersion}-content-wrapper`}>
          <CurrentComponent />
        </div>
      </main>
      <Footer />
    </div>
  );
}
