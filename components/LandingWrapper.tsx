"use client";

import { useEffect, useState, ComponentType } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { 
  type VersionId,
  STORAGE_KEY,
  DEFAULT_VERSION
} from '@/lib/landingVersions';

type LandingWrapperProps = {
  initialVersion: VersionId;
  LandingPage: ComponentType;
  GitLabLandingPage: ComponentType;
  KubernetesLandingPage: ComponentType;
  ReplicatedLandingPage: ComponentType;
  EphemeralLanding: ComponentType;
  CloudDevLanding: ComponentType;
  CloudLanding: ComponentType;
};

export default function LandingWrapper({
  initialVersion,
  LandingPage,
  GitLabLandingPage,
  KubernetesLandingPage,
  ReplicatedLandingPage,
  EphemeralLanding,
  CloudDevLanding,
  CloudLanding,
}: LandingWrapperProps) {
  console.log('LandingWrapper - Mounting with version:', initialVersion);
  
  const [CurrentComponent, setCurrentComponent] = useState<ComponentType | null>(() => {
    console.log('LandingWrapper - Initial component selection for:', initialVersion);
    switch (initialVersion) {
      case 'gitlab':
        return GitLabLandingPage;
      case 'k8s':
        return KubernetesLandingPage;
      case 'replicated':
        return ReplicatedLandingPage;
      case 'cloud-dev':
        return CloudDevLanding;
      case 'cloud':
        return CloudLanding;
      case 'ephemeral':
      default:
        return EphemeralLanding;
    }
  });

  useEffect(() => {
    console.log('LandingWrapper - Version change effect:', initialVersion);
    let newComponent: ComponentType | null = null;

    switch (initialVersion) {
      case 'gitlab':
        newComponent = GitLabLandingPage;
        break;
      case 'k8s':
        newComponent = KubernetesLandingPage;
        break;
      case 'replicated':
        newComponent = ReplicatedLandingPage;
        break;
      case 'cloud-dev':
        newComponent = CloudDevLanding;
        break;
      case 'cloud':
        newComponent = CloudLanding;
        break;
      case 'ephemeral':
      default:
        newComponent = EphemeralLanding;
        break;
    }

    if (newComponent && newComponent !== CurrentComponent) {
      console.log('LandingWrapper - Updating component for version:', initialVersion);
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
    CurrentComponent,
  ]);

  if (!CurrentComponent) {
    return <div className="min-h-screen bg-gray-900">Loading...</div>;
  }

  return <CurrentComponent />;
}
