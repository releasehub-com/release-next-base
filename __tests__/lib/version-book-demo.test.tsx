import { render, screen, fireEvent } from "@testing-library/react";
import { useSearchParams, usePathname } from "next/navigation";
import { VersionProvider } from "@/lib/version/VersionContext";
import BookADemoPage from "@/app/book-a-demo/page";
import { VERSIONS } from "@/lib/version/versionService";

// Extend Window interface to include analytics
declare global {
  interface Window {
    analytics: {
      track: jest.Mock;
    };
  }
}

// Mock next/navigation
const mockPush = jest.fn();
const mockReplace = jest.fn();
let mockSearchParams = new URLSearchParams();
let mockPathname = "/book-a-demo";

jest.mock("next/navigation", () => ({
  useSearchParams: jest.fn(() => mockSearchParams),
  usePathname: jest.fn(() => mockPathname),
  useRouter: jest.fn(() => ({
    push: mockPush,
    replace: mockReplace,
  })),
}));

// Mock Calendly
jest.mock("react-calendly", () => ({
  InlineWidget: ({ url, prefill }: { url: string; prefill: any }) => (
    <div
      data-testid="calendly-widget"
      data-url={url}
      data-prefill={JSON.stringify(prefill)}
    >
      Calendly Widget
    </div>
  ),
}));

// Add fetch mock at the top of the file
global.fetch = jest.fn(() => Promise.resolve({ ok: true })) as jest.Mock;

describe("Book a Demo Version Tests", () => {
  beforeEach(() => {
    localStorage.clear();
    mockSearchParams = new URLSearchParams();
    mockPathname = "/book-a-demo";
    jest.clearAllMocks();
  });

  describe("Version-Specific Content", () => {
    it("should display default messaging when no version specified", () => {
      render(
        <VersionProvider>
          <BookADemoPage />
        </VersionProvider>,
      );

      const defaultVersion = VERSIONS.ephemeral;
      expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
        new RegExp(defaultVersion.content.title, "i"),
      );
    });

    Object.entries(VERSIONS).forEach(([versionId, version]) => {
      it(`should display ${versionId}-specific messaging`, () => {
        mockSearchParams = new URLSearchParams(`?version=${versionId}`);

        render(
          <VersionProvider>
            <BookADemoPage />
          </VersionProvider>,
        );

        // Check for version-specific title and content
        expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
          new RegExp(version.content.title, "i"),
        );

        // Check for version benefits in the form context
        version.content.benefits.forEach((benefit) => {
          expect(
            screen.getByText(new RegExp(benefit.title, "i")),
          ).toBeInTheDocument();
        });
      });
    });

    it("should handle version aliases correctly", () => {
      mockSearchParams = new URLSearchParams("?version=heroku");

      render(
        <VersionProvider>
          <BookADemoPage />
        </VersionProvider>,
      );

      // Should show cloud/PaaS specific content
      const cloudVersion = VERSIONS.cloud;
      expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
        new RegExp(cloudVersion.content.title, "i"),
      );
    });
  });

  describe("Calendly Integration", () => {
    it("should pass version info to Calendly", () => {
      mockSearchParams = new URLSearchParams("?version=gitlab");

      render(
        <VersionProvider>
          <BookADemoPage />
        </VersionProvider>,
      );

      const calendlyWidget = screen.getByTestId("calendly-widget");
      const prefill = JSON.parse(
        calendlyWidget.getAttribute("data-prefill") || "{}",
      );

      expect(prefill.customAnswers).toEqual({
        a1: "gitlab",
        a2: "gitlab",
        a3: "book_a_demo_page",
      });
    });

    it("should pass version-specific UTM parameters", () => {
      mockSearchParams = new URLSearchParams("?version=kubernetes");

      render(
        <VersionProvider>
          <BookADemoPage />
        </VersionProvider>,
      );

      const calendlyWidget = screen.getByTestId("calendly-widget");
      const url = new URL(calendlyWidget.getAttribute("data-url") || "");

      expect(url.searchParams.get("utm_source")).toBe("kubernetes_landing");
    });
  });

  describe("Form Persistence", () => {
    it("should maintain version when navigating to demo page", () => {
      // Set version in localStorage
      localStorage.setItem("landing_version", "gitlab");

      render(
        <VersionProvider>
          <BookADemoPage />
        </VersionProvider>,
      );

      // Should show GitLab specific content
      const gitlabVersion = VERSIONS.gitlab;
      expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
        new RegExp(gitlabVersion.content.title, "i"),
      );
    });

    it("should prioritize URL version over stored version", () => {
      // Set version in localStorage
      localStorage.setItem("landing_version", "gitlab");

      // But use different version in URL
      mockSearchParams = new URLSearchParams("?version=kubernetes");

      render(
        <VersionProvider>
          <BookADemoPage />
        </VersionProvider>,
      );

      // Should show Kubernetes specific content
      const k8sVersion = VERSIONS.kubernetes;
      expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
        new RegExp(k8sVersion.content.title, "i"),
      );
    });
  });

  describe("Form Submission", () => {
    it("should include version in Calendly widget", () => {
      mockSearchParams = new URLSearchParams("?version=gitlab");

      render(
        <VersionProvider>
          <BookADemoPage />
        </VersionProvider>,
      );

      const calendlyWidget = screen.getByTestId("calendly-widget");
      const prefill = JSON.parse(
        calendlyWidget.getAttribute("data-prefill") || "{}",
      );

      expect(prefill.customAnswers).toEqual({
        a1: "gitlab",
        a2: "gitlab",
        a3: "book_a_demo_page",
      });
    });

    it("should handle version aliases in Calendly widget", () => {
      mockSearchParams = new URLSearchParams("?version=heroku");

      render(
        <VersionProvider>
          <BookADemoPage />
        </VersionProvider>,
      );

      const calendlyWidget = screen.getByTestId("calendly-widget");
      const prefill = JSON.parse(
        calendlyWidget.getAttribute("data-prefill") || "{}",
      );

      expect(prefill.customAnswers).toEqual({
        a1: "cloud",
        a2: "heroku",
        a3: "book_a_demo_page",
      });
    });
  });

  describe("Analytics Integration", () => {
    it("should include version in Calendly URL parameters", () => {
      const mockAnalytics = jest.fn();
      window.analytics = { track: mockAnalytics };
      mockSearchParams = new URLSearchParams("?version=gitlab");

      render(
        <VersionProvider>
          <BookADemoPage />
        </VersionProvider>,
      );

      const calendlyWidget = screen.getByTestId("calendly-widget");
      const url = new URL(calendlyWidget.getAttribute("data-url") || "");

      expect(url.searchParams.get("utm_source")).toBe("gitlab_landing");
      expect(url.searchParams.get("utm_medium")).toBe("website");
      expect(url.searchParams.get("utm_campaign")).toBe("book_demo");
    });
  });
});
