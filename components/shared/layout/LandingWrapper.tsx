"use client";

import { useEffect, useState, ComponentType } from "react";
import Header from "@/components/shared/layout/Header";
import Footer from "@/components/shared/layout/Footer";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useSearchParams, usePathname } from "next/navigation";
import {
  getVersionFromStorage,
  isValidVersion,
  setVersionInStorage,
  getVersionFromPath,
  type VersionId,
  STORAGE_KEY,
  DEFAULT_VERSION,
} from "@/config/versions";

// Helper function to set version in both localStorage and cookie
async function setVersionWithStorage(version: VersionId) {
  // Set in localStorage
  setVersionInStorage(version);

  // Set in cookie via API
  try {
    await fetch("/api/version", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ version }),
    });
  } catch (err) {
    console.error("Failed to set version cookie:", err);
  }
}

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
  const [version, setVersion] = useState(initialVersion);
  const [Component, setComponent] = useState(() => {
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
      case "ephemeral":
        return EphemeralLanding;
      case "cloud-dev":
        return CloudDevLanding;
      case "cloud":
        return CloudLanding;
      case "ai-pipeline":
        return AIPipelineLanding;
      default:
        return LandingPage;
    }
  });

  const searchParams = useSearchParams();
  const pathname = usePathname();
  const urlVersion = searchParams.get("version");
  const pathVersion = getVersionFromPath(pathname);

  useEffect(() => {
    console.log("LandingWrapper - Version change effect:", initialVersion);
    // Resolve version with priority:
    // 1. URL parameter
    // 2. Path-based version
    // 3. Initial version
    const resolvedVersion = (
      urlVersion && isValidVersion(urlVersion)
        ? urlVersion
        : pathVersion || initialVersion
    ) as VersionId;

    setVersion(resolvedVersion);
    setVersionWithStorage(resolvedVersion);

    // Update component based on version
    console.log(
      "LandingWrapper - Updating component for version:",
      resolvedVersion,
    );
    switch (resolvedVersion) {
      case "gitlab":
        setComponent(() => GitLabLandingPage);
        break;
      case "kubernetes":
        setComponent(() => KubernetesLandingPage);
        break;
      case "replicated":
        setComponent(() => ReplicatedLandingPage);
        break;
      case "ephemeral":
        setComponent(() => EphemeralLanding);
        break;
      case "cloud-dev":
        setComponent(() => CloudDevLanding);
        break;
      case "cloud":
        setComponent(() => CloudLanding);
        break;
      case "ai-pipeline":
        setComponent(() => AIPipelineLanding);
        break;
      default:
        setComponent(() => LandingPage);
    }
  }, [
    initialVersion,
    urlVersion,
    pathVersion,
    GitLabLandingPage,
    KubernetesLandingPage,
    ReplicatedLandingPage,
    EphemeralLanding,
    CloudDevLanding,
    CloudLanding,
    AIPipelineLanding,
    LandingPage,
  ]);

  const isMobile = useMediaQuery("(max-width: 768px)");

  // Maintain scroll position when layout changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.scrollTo(0, window.scrollY);
    }
  }, [isMobile]);

  // Get layout class based on version and viewport
  const getLayoutClass = () => {
    const baseClass = isMobile ? "mobile-layout" : "desktop-layout";
    const versionClass = `${version}-${isMobile ? "mobile" : "desktop"}-layout`;
    return `${baseClass} ${versionClass} ${version}-layout`;
  };

  return (
    <div
      className={`flex flex-col min-h-screen bg-gray-900 text-gray-100 ${getLayoutClass()}`}
    >
      <Header />
      <Component />
      <Footer />
    </div>
  );
}
