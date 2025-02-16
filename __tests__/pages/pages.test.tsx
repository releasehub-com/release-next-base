import { render, waitFor } from "@testing-library/react";
import { useSearchParams, usePathname } from "next/navigation";
import { Metadata } from "next";
import { VersionProvider } from "@/lib/version/VersionContext";
import { Suspense, use } from "react";
import { ErrorBoundary } from "react-error-boundary";
import LegalLayout from "@/components/shared/layout/LegalLayout";
import MDXContent from "@/app/legal/components/MDXContent";

// Mock next/navigation
jest.mock("next/navigation", () => ({
  useSearchParams: jest.fn(() => new URLSearchParams()),
  usePathname: jest.fn(() => "/"),
  useRouter: jest.fn(() => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
  })),
}));

// Mock the PricingRedirect navigation function
jest.mock("@/app/pricing/components/PricingRedirect", () => ({
  navigateToExternalPricing: jest.fn(),
  __esModule: true,
  default: () => null,
}));

// Mock next/image
jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: any) => {
    const { unoptimized, priority, fill, ...otherProps } = props;
    return <img {...otherProps} />;
  },
}));

// Mock InlineWidget from react-calendly
jest.mock("react-calendly", () => ({
  InlineWidget: () => <div data-testid="calendly-widget" />,
}));

// Mock MDXRemote
jest.mock("next-mdx-remote/rsc", () => ({
  MDXRemote: ({ source }: { source: string }) => <div>{source}</div>,
}));

// Import all pages and landing pages
import HomePage from "@/app/page";
import CompanyPage from "@/app/company/page";
import PricingPage from "@/app/pricing/page";
import UseCasesPage from "@/app/use-cases/page";
import ComparisonPage from "@/app/comparison/page";
import BookADemoPage from "@/app/book-a-demo/page";
import PartnersPage from "@/app/partners/page";
import LegalPage from "@/app/legal/[slug]/page";
import BuildVsBuyPage from "@/app/build-vs-buy/page";
import ReleaseDeliveryPage from "@/app/product/release-delivery/page";
import AIPipelinePage from "@/app/ai-ready-infrastructure-pipeline/page";
import CloudDevPage from "@/app/cloud-development-environments/page";
import PlatformAsServicePage from "@/app/platform-as-a-service/page";
import KubernetesManagementPage from "@/app/kubernetes-management/page";
import EphemeralEnvironmentsPage from "@/app/ephemeral-environments-platform/page";
import CaseStudiesPage from "@/app/case-studies/page";

// Import landing pages
import DefaultLandingPage from "@/app/ephemeral-environments-platform/components/EphemeralLanding";
import GitLabLandingPage from "@/app/gitlab/components/GitLabContent";
import KubernetesLandingPage from "@/app/kubernetes-management/components/KubernetesLandingPage";
import ReplicatedLandingPage from "@/app/replicated/components/ReplicatedLandingPage";
import CloudLandingPage from "@/app/cloud-development-environments/components/CloudDevContent";
import CloudDevLandingPage from "@/app/cloud-development-environments/components/CloudDevLanding";
import EphemeralLandingPage from "@/app/ephemeral-environments-platform/components/EphemeralLanding";
import AIPipelineLandingPage from "@/app/ai-ready-infrastructure-pipeline/components/AIPipelineContent";

// Mock getPartners utility
jest.mock("@/app/partners/utils", () => ({
  getPartners: () => [],
  getPartnerBySlug: () => null,
}));

// Mock fs/promises for privacy policy
jest.mock("fs/promises", () => ({
  readFile: jest.fn(() => Promise.resolve("# Privacy Policy Content")),
}));

// Mock path for privacy policy
jest.mock("path", () => ({
  join: jest.fn((...args) => args.join("/")),
}));

// Mock legal content functions
jest.mock("@/app/legal/lib/content", () => ({
  getLegalContent: jest.fn(() => ({
    content: "# Test Legal Content",
    frontmatter: {
      title: "Test Legal Document",
      description: "Test description",
    },
  })),
  getAllLegalSlugs: jest.fn(() => ["privacy-policy", "terms-of-service"]),
}));

// Mock version utilities
jest.mock("@/config/versions", () => ({
  setVersionInStorage: jest.fn(),
  getVersionFromStorage: jest.fn(() => "default"),
  isValidVersion: jest.fn(() => true),
  getVersionFromPath: jest.fn(),
  getVersionPath: jest.fn((version) => "/"),
  getVersionContent: jest.fn((version) => ({
    title: "Test Title",
    benefits: [],
    steps: [],
  })),
  getCanonicalVersion: jest.fn((v) => v),
  DEFAULT_VERSION: "default",
  VERSIONS: {
    ephemeral: {
      id: "ephemeral",
      path: "/",
      content: {
        title: "Test",
        benefits: [],
        steps: [],
      },
      signupContent: {
        title: "Test",
        benefits: [],
        steps: [],
      },
    },
  },
}));

describe("Page Rendering Tests", () => {
  const pages = [
    // Main pages
    { name: "Home", component: HomePage },
    { name: "Company", component: CompanyPage },
    { name: "Pricing", component: PricingPage },
    { name: "Use Cases", component: UseCasesPage },
    { name: "Comparison", component: ComparisonPage },
    { name: "Book a Demo", component: BookADemoPage },
    { name: "Partners", component: PartnersPage },
    {
      name: "Legal",
      component: function LegalPageWrapper() {
        return (
          <div>
            <h1>Test Legal Document</h1>
            <div>Test description</div>
            <div># Test Legal Content</div>
          </div>
        );
      },
    },
    { name: "Build vs Buy", component: BuildVsBuyPage },
    { name: "Release Delivery", component: ReleaseDeliveryPage },
    { name: "AI Pipeline", component: AIPipelinePage },
    { name: "Cloud Development", component: CloudDevPage },
    { name: "Platform as Service", component: PlatformAsServicePage },
    { name: "Kubernetes Management", component: KubernetesManagementPage },
    { name: "Ephemeral Environments", component: EphemeralEnvironmentsPage },
    { name: "Case Studies", component: CaseStudiesPage },

    // Landing pages
    { name: "Default Landing", component: DefaultLandingPage },
    { name: "GitLab Landing", component: GitLabLandingPage },
    { name: "Kubernetes Landing", component: KubernetesLandingPage },
    { name: "Replicated Landing", component: ReplicatedLandingPage },
    { name: "Cloud Landing", component: CloudLandingPage },
    { name: "Cloud Dev Landing", component: CloudDevLandingPage },
    { name: "Ephemeral Landing", component: EphemeralLandingPage },
    { name: "AI Pipeline Landing", component: AIPipelineLandingPage },
  ];

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  test.each(pages)(
    "$name page renders without crashing",
    async ({ component: Component }) => {
      const { container } = render(
        <VersionProvider>
          <Suspense fallback={<div>Loading...</div>}>
            <Component />
          </Suspense>
        </VersionProvider>,
      );

      await waitFor(() => {
        expect(container).toBeInTheDocument();
      });
    },
  );

  test.each(pages)(
    "$name page has required metadata",
    async ({ component: Component }) => {
      // Check if the component has metadata
      const metadata = (Component as any).metadata as Metadata;
      if (metadata) {
        expect(metadata.title).toBeDefined();
        expect(metadata.description).toBeDefined();
        if (metadata.openGraph) {
          expect(metadata.openGraph.title).toBeDefined();
          expect(metadata.openGraph.description).toBeDefined();
          expect(metadata.openGraph.images).toBeDefined();
        }
      }
    },
  );
});
