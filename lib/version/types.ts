export type VersionId =
  | "ephemeral"
  | "kubernetes"
  | "cloud-dev"
  | "replicated"
  | "gitlab"
  | "cloud"
  | "ai-pipeline";

export interface BenefitType {
  icon: string;
  title: string;
  description: string;
}

export interface VersionContent {
  title: string;
  benefits: readonly BenefitType[];
  steps: readonly string[];
}

export interface Version {
  id: VersionId;
  path: string;
  content: VersionContent;
  signupContent?: VersionContent;
}

export interface VersionContextType {
  version: VersionId;
  setVersion: (version: VersionId) => Promise<void>;
  resolveVersion: (params: {
    urlVersion?: string | null;
    pathVersion?: string | null;
  }) => VersionId;
  isValidVersion: (version: string) => version is VersionId;
  getVersionContent: (version: VersionId) => VersionContent;
}
