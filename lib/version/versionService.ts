import { VersionId, Version, VersionContent, BenefitType } from "./types";

export const STORAGE_KEY = "landing_version";
export const DEFAULT_VERSION: VersionId = "ai-pipeline";

const defaultBenefits: readonly BenefitType[] = [
  {
    icon: "cost-reduction",
    title: "Cut environment costs by 75%",
    description:
      "Navan reduced environment creation time from 8 days to 5 minutes.",
  },
  {
    icon: "testing",
    title: "Cut testing time up to 99%",
    description:
      "Chipper Cash migrated from Heroku and reduced testing time from 24 hours to < 5 minutes.",
  },
  {
    icon: "developer",
    title: "Increase engineer delight 100%",
    description:
      "DispatchHealth increased feature deployment velocity from 2 to 10+ features a week.",
  },
];

const defaultSteps: readonly string[] = [
  "Connect your repositories",
  "Review your environment template and environment variables",
  "Spin up your environments in seconds",
];

export const VERSIONS: Record<VersionId, Version> = {
  ephemeral: {
    id: "ephemeral",
    path: "/ephemeral-environments-platform",
    content: {
      title:
        "Full-stack on-demand environments for every stage of your application lifecycle.",
      benefits: defaultBenefits,
      steps: defaultSteps,
    },
    signupContent: {
      title: "Get Started with Ephemeral Environments",
      benefits: [
        {
          icon: "cost-reduction",
          title: "Cut environment costs by 75%",
          description:
            "Navan reduced environment creation time from 8 days to 5 minutes.",
        },
        {
          icon: "testing",
          title: "Cut testing time up to 99%",
          description:
            "Chipper Cash migrated from Heroku and reduced testing time from 24 hours to < 5 minutes.",
        },
        {
          icon: "developer",
          title: "Increase engineer delight 100%",
          description:
            "DispatchHealth increased feature deployment velocity from 2 to 10+ features a week.",
        },
      ],
      steps: [
        "Connect your repositories",
        "Review your environment template and environment variables",
        "Spin up your environments in seconds",
      ],
    },
  },
  kubernetes: {
    id: "kubernetes",
    path: "/kubernetes-management",
    content: {
      title: "Simplify Your Kubernetes Management",
      benefits: [
        {
          icon: "automation",
          title: "Automated Cluster Management",
          description:
            "Release handles node autoscaling, version upgrades, and resource deployment automatically, reducing operational overhead.",
        },
        {
          icon: "kubernetes",
          title: "Flexible Configuration",
          description:
            "Customize your application's build and deployment processes with simple .release.yaml files and native Kubernetes manifests.",
        },
        {
          icon: "cloud-provider",
          title: "Cloud Integration",
          description:
            "Create and manage Kubernetes clusters within your own cloud account for maximum control and security.",
        },
      ],
      steps: [
        "Connect your cloud provider",
        "Configure your Kubernetes preferences",
        "Deploy with confidence",
      ],
    },
    signupContent: {
      title: "Get Started with Kubernetes Management",
      benefits: [
        {
          icon: "automation",
          title: "Automated Cluster Management",
          description:
            "Release handles node autoscaling, version upgrades, and resource deployment automatically, reducing operational overhead.",
        },
        {
          icon: "kubernetes",
          title: "Flexible Configuration",
          description:
            "Customize your application's build and deployment processes with simple .release.yaml files and native Kubernetes manifests.",
        },
        {
          icon: "cloud-provider",
          title: "Cloud Integration",
          description:
            "Create and manage Kubernetes clusters within your own cloud account for maximum control and security.",
        },
      ],
      steps: [
        "Connect your cloud provider",
        "Configure your Kubernetes preferences",
        "Deploy with confidence",
      ],
    },
  },
  "cloud-dev": {
    id: "cloud-dev",
    path: "/cloud-development-environments",
    content: {
      title: "Cloud Development Environments for Modern Teams",
      benefits: [
        {
          icon: "cloud-provider",
          title: "Instant Cloud Environments",
          description:
            "Spin up full development environments in seconds, complete with all your tools and dependencies.",
        },
        {
          icon: "collaboration",
          title: "Seamless Collaboration",
          description:
            "Share environments with your team instantly, making code reviews and pair programming effortless.",
        },
        {
          icon: "automation",
          title: "Automated Setup",
          description:
            "Eliminate local setup headaches with automated environment provisioning and configuration.",
        },
      ],
      steps: [
        "Connect your repositories",
        "Configure your environment template",
        "Start developing in the cloud",
      ],
    },
    signupContent: {
      title: "Get Started with Cloud Development",
      benefits: [
        {
          icon: "cloud-provider",
          title: "Instant Cloud Environments",
          description:
            "Spin up full development environments in seconds, complete with all your tools and dependencies.",
        },
        {
          icon: "collaboration",
          title: "Seamless Collaboration",
          description:
            "Share environments with your team instantly, making code reviews and pair programming effortless.",
        },
        {
          icon: "automation",
          title: "Automated Setup",
          description:
            "Eliminate local setup headaches with automated environment provisioning and configuration.",
        },
      ],
      steps: [
        "Connect your repositories",
        "Configure your environment template",
        "Start developing in the cloud",
      ],
    },
  },
  replicated: {
    id: "replicated",
    path: "/replicated",
    content: {
      title: "Release Delivery: Superior On-Premise Solutions and Beyond",
      benefits: [
        {
          icon: "automation",
          title: "Advanced Infrastructure Management",
          description:
            "Automate and optimize your on-premise infrastructure with Release Delivery's intelligent management system.",
        },
        {
          icon: "security",
          title: "Enhanced Security and Compliance",
          description:
            "Meet the strictest security requirements with Release Delivery's advanced on-premise security features.",
        },
        {
          icon: "cloud-provider",
          title: "Seamless Integration",
          description:
            "Easily integrate Release Delivery with your existing on-premise tools and workflows.",
        },
      ],
      steps: [
        "Connect your repositories",
        "Configure your environment template",
        "Deploy with confidence",
      ],
    },
    signupContent: {
      title: "Get Started with Release Delivery",
      benefits: [
        {
          icon: "automation",
          title: "Advanced Infrastructure Management",
          description:
            "Automate and optimize your on-premise infrastructure with Release Delivery's intelligent management system.",
        },
        {
          icon: "security",
          title: "Enhanced Security and Compliance",
          description:
            "Meet the strictest security requirements with Release Delivery's advanced on-premise security features.",
        },
        {
          icon: "cloud-provider",
          title: "Seamless Integration",
          description:
            "Easily integrate Release Delivery with your existing on-premise tools and workflows.",
        },
      ],
      steps: [
        "Connect your repositories",
        "Configure your environment template",
        "Deploy with confidence",
      ],
    },
  },
  gitlab: {
    id: "gitlab",
    path: "/gitlab",
    content: {
      title: "Seamless GitLab Integration for Modern DevOps",
      benefits: [
        {
          icon: "gitlab",
          title: "Native GitLab Integration",
          description:
            "Automatically create environments for every merge request with zero configuration.",
        },
        {
          icon: "pipeline",
          title: "Enhanced CI/CD Pipelines",
          description:
            "Integrate with GitLab CI/CD for automated testing and deployment workflows.",
        },
        {
          icon: "collaboration",
          title: "Streamlined Reviews",
          description:
            "Accelerate code reviews with instant preview environments for every change.",
        },
      ],
      steps: [
        "Connect your GitLab repositories",
        "Configure your environment templates",
        "Automate your workflow",
      ],
    },
    signupContent: {
      title: "Get Started with GitLab Integration",
      benefits: [
        {
          icon: "gitlab",
          title: "Native GitLab Integration",
          description:
            "Automatically create environments for every merge request with zero configuration.",
        },
        {
          icon: "pipeline",
          title: "Enhanced CI/CD Pipelines",
          description:
            "Integrate with GitLab CI/CD for automated testing and deployment workflows.",
        },
        {
          icon: "collaboration",
          title: "Streamlined Reviews",
          description:
            "Accelerate code reviews with instant preview environments for every change.",
        },
      ],
      steps: [
        "Connect your GitLab repositories",
        "Configure your environment templates",
        "Automate your workflow",
      ],
    },
  },
  cloud: {
    id: "cloud",
    path: "/platform-as-a-service",
    content: {
      title: "Modern Cloud Platform for Growing Teams",
      benefits: [
        {
          icon: "git",
          title: "Simple Git Deployments",
          description:
            "Deploy applications with a simple git push, just like Heroku but with more power.",
        },
        {
          icon: "scale",
          title: "Scale Without Limits",
          description:
            "Start with our hosted platform, then seamlessly upgrade to enterprise features as you grow.",
        },
        {
          icon: "cloud-provider",
          title: "Full Cloud Provider Access",
          description:
            "Direct access to AWS, GCP, or Azure services while maintaining the simple developer experience.",
        },
      ],
      steps: [
        "Push your code",
        "Configure your cloud settings",
        "Scale with confidence",
      ],
    },
    signupContent: {
      title: "Get Started with Release Cloud Platform",
      benefits: [
        {
          icon: "git",
          title: "Simple Git Deployments",
          description:
            "Deploy applications with a simple git push, just like Heroku but with more power.",
        },
        {
          icon: "scale",
          title: "Scale Without Limits",
          description:
            "Start with our hosted platform, then seamlessly upgrade to enterprise features as you grow.",
        },
        {
          icon: "cloud-provider",
          title: "Full Cloud Provider Access",
          description:
            "Direct access to AWS, GCP, or Azure services while maintaining the simple developer experience.",
        },
      ],
      steps: [
        "Push your code",
        "Configure your cloud settings",
        "Scale with confidence",
      ],
    },
  },
  "ai-pipeline": {
    id: "ai-pipeline",
    path: "/ai-ready-infrastructure-pipeline",
    content: {
      title: "Infrastructure That Keeps Pace with AI Development",
      benefits: [
        {
          icon: "automation",
          title: "Eliminate Deployment Bottlenecks",
          description:
            "Keep your infrastructure and deployment pipelines moving as fast as your AI-accelerated development teams.",
        },
        {
          icon: "performance",
          title: "Zero Wait Time Environments",
          description:
            "Instantly provision environments for testing, staging, and production without slowing down your AI-powered development workflow.",
        },
        {
          icon: "scale",
          title: "Scale with AI Velocity",
          description:
            "Automatically scale your infrastructure to match the increased velocity of AI-assisted development and testing.",
        },
      ],
      steps: [
        "Connect your repositories",
        "Configure your pipeline settings",
        "Let Release handle the infrastructure",
      ],
    },
    signupContent: {
      title: "Get Started with AI-Ready Infrastructure",
      benefits: [
        {
          icon: "automation",
          title: "Eliminate Deployment Bottlenecks",
          description:
            "Keep your infrastructure and deployment pipelines moving as fast as your AI-accelerated development teams.",
        },
        {
          icon: "performance",
          title: "Zero Wait Time Environments",
          description:
            "Instantly provision environments for testing, staging, and production without slowing down your AI-powered development workflow.",
        },
        {
          icon: "scale",
          title: "Scale with AI Velocity",
          description:
            "Automatically scale your infrastructure to match the increased velocity of AI-assisted development and testing.",
        },
      ],
      steps: [
        "Connect your repositories",
        "Configure your pipeline settings",
        "Let Release handle the infrastructure",
      ],
    },
  },
};

export function isValidVersion(version: string): version is VersionId {
  return version in VERSIONS;
}

export function getVersionFromStorage(): VersionId | null {
  if (typeof window === "undefined") return null;
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored && isValidVersion(stored) ? stored : null;
}

export function setVersionInStorage(version: VersionId): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, version);
}

export function getVersionFromPath(pathname: string): VersionId | null {
  const version = Object.values(VERSIONS).find((v) =>
    pathname.startsWith(v.path),
  )?.id;
  return version || null;
}

export function getVersionPath(version: VersionId): string {
  return VERSIONS[version].path;
}

export function getVersionContent(version: VersionId): VersionContent {
  return VERSIONS[version].content;
}

export function getCanonicalVersion(version: string): VersionId {
  // Handle any version aliases or normalization here
  if (version === "ai") return "ai-pipeline";
  return isValidVersion(version) ? version : DEFAULT_VERSION;
}

export async function setVersion(version: VersionId): Promise<void> {
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

export function resolveVersion({
  urlVersion,
  pathVersion,
}: {
  urlVersion?: string | null;
  pathVersion?: string | null;
}): VersionId {
  // Priority: URL param > path > localStorage > default

  // Handle special aliases first
  if (urlVersion === "ai") return "ai-pipeline";
  if (urlVersion === "heroku") return "cloud";
  if (urlVersion === "paas") return "cloud";

  if (urlVersion && isValidVersion(urlVersion)) {
    return getCanonicalVersion(urlVersion);
  }

  if (pathVersion && isValidVersion(pathVersion)) {
    return getCanonicalVersion(pathVersion);
  }

  const storedVersion = getVersionFromStorage();
  return storedVersion || DEFAULT_VERSION;
}
