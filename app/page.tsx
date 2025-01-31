"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const EphemeralLanding = dynamic(
  () => import("@/components/EphemeralLanding").then((mod) => mod.default),
  { ssr: false },
);

const GitLabLanding = dynamic(() => import("@/components/GitLabLandingPage"), {
  ssr: false,
});

const KubernetesLanding = dynamic(
  () => import("@/components/KubernetesLandingPage"),
  { ssr: false },
);

const ReplicatedLanding = dynamic(
  () =>
    import("@/components/ReplicatedLandingPage").then(
      (mod) => mod.ReleaseVsReplicated,
    ),
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

export default function HomePage() {
  const [currentPath, setCurrentPath] = useState<string>("");

  useEffect(() => {
    const storedPath = localStorage.getItem("landing_path");
    setCurrentPath(storedPath || "");
  }, []);

  if (!currentPath) {
    return <EphemeralLanding />;
  }

  switch (currentPath) {
    case "/gitlab-competitor":
      return <GitLabLanding />;
    case "/kubernetes-management":
      return <KubernetesLanding />;
    case "/replicated-competitor":
      return <ReplicatedLanding />;
    case "/cloud-development-environments":
      return <CloudDevLanding />;
    case "/heroku-competitor":
    case "/platform-as-a-service":
      return <CloudLanding />;
    case "/ephemeral-environments-platform":
      return <EphemeralLanding />;
    default:
      return <EphemeralLanding />;
  }
}
