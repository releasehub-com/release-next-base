import { render, screen, act, fireEvent } from "@testing-library/react";
import { useSearchParams, usePathname } from "next/navigation";
import { VersionProvider, useVersion } from "@/lib/version/VersionContext";
import ClientSideRenderer from "@/components/ClientSideRenderer";
import LandingWrapper from "@/components/shared/layout/LandingWrapper";
import { VERSIONS, DEFAULT_VERSION } from "@/lib/version/versionService";

// Mock next/navigation
const mockPush = jest.fn();
const mockReplace = jest.fn();
let mockSearchParams = new URLSearchParams();
let mockPathname = "/";

jest.mock("next/navigation", () => ({
  useSearchParams: jest.fn(() => mockSearchParams),
  usePathname: jest.fn(() => mockPathname),
  useRouter: jest.fn(() => ({
    push: mockPush,
    replace: mockReplace,
  })),
}));

// Mock dynamic imports
jest.mock(
  "@/app/ephemeral-environments-platform/components/EphemeralContent",
  () => ({
    __esModule: true,
    default: () => (
      <div data-testid="ephemeral-content-wrapper">
        <div data-testid="ephemeral-content">Ephemeral Content</div>
      </div>
    ),
  }),
);

jest.mock("@/app/gitlab/components/GitLabContent", () => ({
  __esModule: true,
  default: () => (
    <div data-testid="gitlab-content-wrapper">
      <div data-testid="gitlab-content">GitLab Content</div>
    </div>
  ),
}));

jest.mock("@/app/kubernetes-management/components/KubernetesContent", () => ({
  __esModule: true,
  default: () => (
    <div data-testid="kubernetes-content-wrapper">
      <div data-testid="kubernetes-content">Kubernetes Content</div>
    </div>
  ),
}));

// Test component to access version context
const TestComponent = () => {
  const { version } = useVersion();
  return <div data-testid="version-display">{version}</div>;
};

describe("Version Integration Tests", () => {
  beforeEach(() => {
    // Reset mocks and storage
    localStorage.clear();
    mockSearchParams = new URLSearchParams();
    mockPathname = "/";
    jest.clearAllMocks();
  });

  describe("Component Loading", () => {
    it("should load default component when no version specified", async () => {
      render(
        <VersionProvider>
          <ClientSideRenderer />
        </VersionProvider>,
      );

      // Wait for component to load
      await screen.findByTestId("ephemeral-content-wrapper");
      expect(screen.getByTestId("ephemeral-content")).toBeInTheDocument();
    });

    it("should load correct component based on URL version", async () => {
      mockSearchParams = new URLSearchParams("?version=gitlab");

      render(
        <VersionProvider>
          <ClientSideRenderer />
        </VersionProvider>,
      );

      await screen.findByTestId("gitlab-content-wrapper");
      expect(screen.getByTestId("gitlab-content")).toBeInTheDocument();
    });

    it("should load correct component based on path", async () => {
      mockPathname = "/kubernetes-management";

      render(
        <VersionProvider>
          <ClientSideRenderer />
        </VersionProvider>,
      );

      await screen.findByTestId("kubernetes-content-wrapper");
      expect(screen.getByTestId("kubernetes-content")).toBeInTheDocument();
    });
  });

  describe("Version Switching", () => {
    it("should update component when version changes", async () => {
      const { rerender } = render(
        <VersionProvider>
          <TestComponent />
        </VersionProvider>,
      );

      expect(screen.getByTestId("version-display")).toHaveTextContent(
        DEFAULT_VERSION,
      );

      // Change URL parameter
      mockSearchParams = new URLSearchParams("?version=gitlab");
      rerender(
        <VersionProvider>
          <TestComponent />
        </VersionProvider>,
      );

      expect(screen.getByTestId("version-display")).toHaveTextContent("gitlab");
    });

    it("should handle version aliases", async () => {
      mockSearchParams = new URLSearchParams("?version=heroku");

      render(
        <VersionProvider>
          <TestComponent />
        </VersionProvider>,
      );

      expect(screen.getByTestId("version-display")).toHaveTextContent("cloud");
    });
  });

  describe("URL Parameter Handling", () => {
    it("should respect parameter priority over path", async () => {
      mockPathname = "/kubernetes-management";
      mockSearchParams = new URLSearchParams("?version=gitlab");

      render(
        <VersionProvider>
          <TestComponent />
        </VersionProvider>,
      );

      expect(screen.getByTestId("version-display")).toHaveTextContent("gitlab");
    });

    it("should handle invalid version parameters", async () => {
      mockSearchParams = new URLSearchParams("?version=invalid");

      render(
        <VersionProvider>
          <TestComponent />
        </VersionProvider>,
      );

      expect(screen.getByTestId("version-display")).toHaveTextContent(
        DEFAULT_VERSION,
      );
    });

    it("should maintain version through parameter changes", async () => {
      const { rerender } = render(
        <VersionProvider>
          <TestComponent />
        </VersionProvider>,
      );

      // Change version through URL
      mockSearchParams = new URLSearchParams("?version=gitlab");
      rerender(
        <VersionProvider>
          <TestComponent />
        </VersionProvider>,
      );

      expect(screen.getByTestId("version-display")).toHaveTextContent("gitlab");

      // Remove version parameter
      mockSearchParams = new URLSearchParams();
      rerender(
        <VersionProvider>
          <TestComponent />
        </VersionProvider>,
      );

      // Should maintain version from localStorage
      expect(screen.getByTestId("version-display")).toHaveTextContent("gitlab");
    });
  });

  describe("Version Persistence", () => {
    it("should persist version in localStorage", async () => {
      mockSearchParams = new URLSearchParams("?version=gitlab");

      render(
        <VersionProvider>
          <TestComponent />
        </VersionProvider>,
      );

      expect(localStorage.getItem("landing_version")).toBe("gitlab");
    });

    it("should restore version from localStorage", async () => {
      localStorage.setItem("landing_version", "kubernetes");

      render(
        <VersionProvider>
          <TestComponent />
        </VersionProvider>,
      );

      expect(screen.getByTestId("version-display")).toHaveTextContent(
        "kubernetes",
      );
    });
  });

  describe("Edge Cases", () => {
    it("should handle rapid version changes", async () => {
      const { rerender } = render(
        <VersionProvider>
          <TestComponent />
        </VersionProvider>,
      );

      // Simulate rapid version changes
      const versions = ["gitlab", "kubernetes", "cloud", "ephemeral"];
      for (const version of versions) {
        mockSearchParams = new URLSearchParams(`?version=${version}`);
        await act(async () => {
          rerender(
            <VersionProvider>
              <TestComponent />
            </VersionProvider>,
          );
        });
      }

      // Should end up with the last version
      expect(screen.getByTestId("version-display")).toHaveTextContent(
        "ephemeral",
      );
    });

    it("should handle concurrent path and parameter changes", async () => {
      const { rerender } = render(
        <VersionProvider>
          <TestComponent />
        </VersionProvider>,
      );

      // Simulate concurrent changes
      mockPathname = "/kubernetes-management";
      mockSearchParams = new URLSearchParams("?version=gitlab");
      await act(async () => {
        rerender(
          <VersionProvider>
            <TestComponent />
          </VersionProvider>,
        );
      });

      // URL parameter should take precedence
      expect(screen.getByTestId("version-display")).toHaveTextContent("gitlab");
    });
  });
});
