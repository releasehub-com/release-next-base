import { type BenefitType } from "@/app/signup/types";

export interface VersionConfig {
  id: string;
  aliases: string[];
  path: string;
  content: {
    title: string;
    benefits: BenefitType[];
    steps: string[];
  };
}

export const VERSIONS = {
  ephemeral: {
    id: "ephemeral",
    aliases: [],
    path: "/ephemeral-environments-platform",
    content: {
      title:
        "Full-stack on-demand environments for every stage of your application lifecycle.",
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
    signupContent: {
      title: "Deploy High-Performance AI Models with Ease",
      benefits: [
        {
          icon: "performance",
          title: "High-Performance Inference",
          description:
            "Deploy models with sub-100ms latency. Our optimized infrastructure ensures rapid response times for your AI applications.",
        },
        {
          icon: "scale",
          title: "Seamless Scalability",
          description:
            "Automatically scale from zero to thousands of concurrent requests. Our platform grows with your needs, ensuring consistent performance.",
        },
        {
          icon: "security",
          title: "Enterprise-Grade Security",
          description:
            "Benefit from SOC 2 Type II compliance, private networking, and end-to-end encryption. Your models and data remain secure and compliant.",
        },
      ],
      steps: [
        "Start with 5 free GPU hours",
        "Deploy your first AI model",
        "Scale with confidence",
      ],
    },
  },
  replicated: {
    id: "replicated",
    aliases: [],
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
  },
  "cloud-dev": {
    id: "cloud-dev",
    aliases: [],
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
  },
  "release-ai": {
    id: "release-ai",
    aliases: ["ai"],
    path: "/", // Maps to root/ephemeral landing page
    content: {
      title: "Deploy High-Performance AI Models with Ease",
      benefits: [
        {
          icon: "performance",
          title: "High-Performance Inference",
          description:
            "Deploy models with sub-100ms latency. Our optimized infrastructure ensures rapid response times for your AI applications.",
        },
        {
          icon: "scale",
          title: "Seamless Scalability",
          description:
            "Automatically scale from zero to thousands of concurrent requests. Our platform grows with your needs, ensuring consistent performance.",
        },
        {
          icon: "security",
          title: "Enterprise-Grade Security",
          description:
            "Benefit from SOC 2 Type II compliance, private networking, and end-to-end encryption. Your models and data remain secure and compliant.",
        },
      ],
      steps: [
        "Start with 5 free GPU hours",
        "Deploy your first AI model",
        "Scale with confidence",
      ],
    },
  },
  cloud: {
    id: "cloud",
    aliases: ["heroku", "paas"],
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
  },
  kubernetes: {
    id: "kubernetes",
    aliases: ["k8s"],
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
  },
  gitlab: {
    id: "gitlab",
    aliases: [],
    path: "/gitlab-integration",
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
  },
  // Add other versions...
} as const;

// Helper types and functions
export type VersionId = keyof typeof VERSIONS;
export type ValidVersion =
  | VersionId
  | (typeof VERSIONS)[VersionId]["aliases"][number];

export const DEFAULT_VERSION: VersionId = "ephemeral";
export const STORAGE_KEY = "landing_version";

// Create a map of all valid versions including aliases
const createVersionAliasMap = () => {
  const map = new Map<string, VersionId>();
  Object.values(VERSIONS).forEach((version) => {
    map.set(version.id, version.id as VersionId);
    version.aliases.forEach((alias) => map.set(alias, version.id as VersionId));
  });
  return map;
};

export const VERSION_MAP = createVersionAliasMap();

// Helper functions
export const isValidVersion = (version: string): version is ValidVersion =>
  VERSION_MAP.has(version);

export const getCanonicalVersion = (version: ValidVersion): VersionId =>
  VERSION_MAP.get(version) as VersionId;

export const getVersionContent = (version: VersionId) =>
  VERSIONS[version].content;

export const getVersionPath = (version: VersionId) => VERSIONS[version].path;

export const getVersionFromPath = (path: string): VersionId => {
  // Special case for root path
  if (path === "/") return DEFAULT_VERSION;

  const version = Object.values(VERSIONS).find((v) => v.path === path);
  return (version?.id as VersionId) || DEFAULT_VERSION;
};

// Storage functions
export function setVersionInStorage(version: VersionId): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, version);
}

export function getVersionFromStorage(): VersionId {
  if (typeof window === "undefined") return DEFAULT_VERSION;

  console.log("getVersionFromStorage - Starting version check");

  // Check localStorage first
  const stored = localStorage.getItem(STORAGE_KEY);
  console.log("getVersionFromStorage - localStorage value:", stored);

  if (stored && isValidVersion(stored)) {
    const version = VERSION_MAP.get(stored) as VersionId;
    console.log("getVersionFromStorage - Using localStorage version:", version);
    return version;
  }

  // Check cookie as fallback
  const cookie = document.cookie
    .split("; ")
    .find((row) => row.startsWith("landing_version="))
    ?.split("=")[1];

  console.log("getVersionFromStorage - Cookie value:", cookie);

  if (cookie && isValidVersion(cookie)) {
    // Persist to localStorage for future use
    const version = VERSION_MAP.get(cookie) as VersionId;
    console.log("getVersionFromStorage - Using cookie version:", version);
    setVersionInStorage(version);
    return version;
  }

  console.log("getVersionFromStorage - Using default version");
  return DEFAULT_VERSION;
}
