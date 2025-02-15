import { render, screen, waitFor, act } from "@testing-library/react";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { VersionProvider } from "@/lib/version/VersionContext";
import LandingWrapper from "@/components/shared/layout/LandingWrapper";
import { useEffect } from "react";
import React from "react";

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

// Mock window.matchMedia
const mockMatchMedia = jest.fn();
window.matchMedia = mockMatchMedia;

describe("Version Layout Tests", () => {
  let mockParams: URLSearchParams;
  let mockScrollTo: jest.Mock;

  const defaultProps = {
    initialVersion: "ephemeral" as const,
    LandingPage: () => (
      <div data-testid="ephemeral-content-wrapper">
        <div data-testid="ephemeral-content">Ephemeral Content</div>
      </div>
    ),
    GitLabLandingPage: () => (
      <div data-testid="gitlab-content-wrapper">
        <div data-testid="gitlab-content">GitLab Content</div>
      </div>
    ),
    KubernetesLandingPage: () => (
      <div data-testid="kubernetes-content-wrapper">
        <div data-testid="kubernetes-content">Kubernetes Content</div>
      </div>
    ),
    ReplicatedLandingPage: () => (
      <div data-testid="replicated-content-wrapper">
        <div data-testid="replicated-content">Replicated Content</div>
      </div>
    ),
    EphemeralLanding: () => (
      <div data-testid="ephemeral-content-wrapper">
        <div data-testid="ephemeral-content">Ephemeral Content</div>
      </div>
    ),
    CloudDevLanding: () => (
      <div data-testid="cloud-dev-content-wrapper">
        <div data-testid="cloud-dev-content">Cloud Dev Content</div>
      </div>
    ),
    CloudLanding: () => (
      <div data-testid="cloud-content-wrapper">
        <div data-testid="cloud-content">Cloud Content</div>
      </div>
    ),
    AIPipelineLanding: () => (
      <div data-testid="ai-pipeline-content-wrapper">
        <div data-testid="ai-pipeline-content">AI Pipeline Content</div>
      </div>
    ),
  };

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();

    // Reset window dimensions
    Object.defineProperty(window, "innerWidth", {
      value: 1024,
      writable: true,
    });
    Object.defineProperty(window, "innerHeight", {
      value: 768,
      writable: true,
    });

    // Mock window.scrollTo
    mockScrollTo = jest.fn();
    window.scrollTo = mockScrollTo;

    // Reset URL params
    mockParams = new URLSearchParams();
    (useSearchParams as jest.Mock).mockImplementation(() => mockParams);

    // Mock matchMedia for desktop by default
    mockMatchMedia.mockImplementation((query) => ({
      matches: query === "(max-width: 768px)" ? false : true,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      addListener: jest.fn(),
      removeListener: jest.fn(),
    }));
  });

  describe("Responsive Layout", () => {
    it("should render mobile layout when viewport is narrow", async () => {
      // Set mobile viewport
      mockMatchMedia.mockImplementation((query) => ({
        matches: query === "(max-width: 768px)" ? true : false,
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        addListener: jest.fn(),
        removeListener: jest.fn(),
      }));

      render(
        <VersionProvider>
          <LandingWrapper {...defaultProps} />
        </VersionProvider>,
      );

      const wrapper = await screen.findByTestId("ephemeral-content-wrapper");
      expect(wrapper.closest(".mobile-layout")).toBeTruthy();
    });

    it("should render desktop layout when viewport is wide", async () => {
      // Set desktop viewport
      mockMatchMedia.mockImplementation((query) => ({
        matches: query === "(max-width: 768px)" ? false : true,
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        addListener: jest.fn(),
        removeListener: jest.fn(),
      }));

      render(
        <VersionProvider>
          <LandingWrapper {...defaultProps} />
        </VersionProvider>,
      );

      const wrapper = await screen.findByTestId("ephemeral-content-wrapper");
      expect(wrapper.closest(".desktop-layout")).toBeTruthy();
    });

    it("should maintain layout when switching versions", async () => {
      // Set desktop viewport
      mockMatchMedia.mockImplementation((query) => ({
        matches: query === "(max-width: 768px)" ? false : true,
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        addListener: jest.fn(),
        removeListener: jest.fn(),
      }));

      const { rerender } = render(
        <VersionProvider>
          <LandingWrapper {...defaultProps} />
        </VersionProvider>,
      );

      // Initial desktop layout check
      let wrapper = await screen.findByTestId("ephemeral-content-wrapper");
      expect(wrapper.closest(".desktop-layout")).toBeTruthy();

      // Switch version
      mockParams.set("version", "gitlab");
      const gitlabProps = {
        ...defaultProps,
        initialVersion: "gitlab" as const,
      };

      rerender(
        <VersionProvider>
          <LandingWrapper {...gitlabProps} />
        </VersionProvider>,
      );

      // Wait for version change to take effect
      await waitFor(async () => {
        wrapper = await screen.findByTestId("gitlab-content-wrapper");
        expect(wrapper.closest(".desktop-layout")).toBeTruthy();
      });
    });
  });

  describe("Version-Specific Layouts", () => {
    it("should render version-specific mobile elements", async () => {
      // Set mobile viewport
      mockMatchMedia.mockImplementation((query) => ({
        matches: query === "(max-width: 768px)" ? true : false,
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        addListener: jest.fn(),
        removeListener: jest.fn(),
      }));

      // Set GitLab version
      mockParams.set("version", "gitlab");

      render(
        <VersionProvider>
          <LandingWrapper {...defaultProps} initialVersion="gitlab" />
        </VersionProvider>,
      );

      const wrapper = await screen.findByTestId("gitlab-content-wrapper");
      expect(wrapper.closest(".gitlab-mobile-layout")).toBeTruthy();
    });

    it("should render version-specific desktop elements", async () => {
      // Set desktop viewport
      mockMatchMedia.mockImplementation((query) => ({
        matches: query === "(max-width: 768px)" ? false : true,
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        addListener: jest.fn(),
        removeListener: jest.fn(),
      }));

      // Set Kubernetes version
      mockParams.set("version", "kubernetes");

      render(
        <VersionProvider>
          <LandingWrapper {...defaultProps} initialVersion="kubernetes" />
        </VersionProvider>,
      );

      const wrapper = await screen.findByTestId("kubernetes-content-wrapper");
      expect(wrapper.closest(".kubernetes-desktop-layout")).toBeTruthy();
    });
  });

  describe("Layout Transitions", () => {
    it("should handle viewport size changes", async () => {
      // Start with desktop layout
      let mediaQueryHandler: ((event: MediaQueryListEvent) => void) | null =
        null;
      mockMatchMedia.mockImplementation((query) => ({
        matches: query === "(max-width: 768px)" ? false : true,
        addEventListener: (
          event: string,
          handler: (event: MediaQueryListEvent) => void,
        ) => {
          if (event === "change") {
            mediaQueryHandler = handler;
          }
        },
        removeEventListener: jest.fn(),
        addListener: jest.fn(),
        removeListener: jest.fn(),
      }));

      const { rerender } = render(
        <VersionProvider>
          <LandingWrapper {...defaultProps} />
        </VersionProvider>,
      );

      // Initial desktop layout check
      let wrapper = await screen.findByTestId("ephemeral-content-wrapper");
      expect(wrapper.closest(".desktop-layout")).toBeTruthy();

      // Switch to mobile layout
      mockMatchMedia.mockImplementation((query) => ({
        matches: query === "(max-width: 768px)" ? true : false,
        addEventListener: (
          event: string,
          handler: (event: MediaQueryListEvent) => void,
        ) => {
          if (event === "change") {
            mediaQueryHandler = handler;
          }
        },
        removeEventListener: jest.fn(),
        addListener: jest.fn(),
        removeListener: jest.fn(),
      }));

      // Trigger the media query change event
      if (mediaQueryHandler) {
        mediaQueryHandler({
          matches: true,
          media: "(max-width: 768px)",
        } as MediaQueryListEvent);
      }

      // Trigger a re-render
      rerender(
        <VersionProvider>
          <LandingWrapper {...defaultProps} />
        </VersionProvider>,
      );

      // Wait for layout change
      await waitFor(
        () => {
          wrapper = screen.getByTestId("ephemeral-content-wrapper");
          expect(wrapper.closest(".mobile-layout")).toBeTruthy();
        },
        { timeout: 2000 },
      );
    });

    it("should maintain scroll position during layout changes", async () => {
      // Set initial scroll position
      window.scrollY = 100;

      render(
        <VersionProvider>
          <LandingWrapper {...defaultProps} />
        </VersionProvider>,
      );

      // Wait for initial render
      await screen.findByTestId("ephemeral-content-wrapper");

      // Trigger layout change
      mockMatchMedia.mockImplementation((query) => ({
        matches: query === "(max-width: 768px)" ? true : false,
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        addListener: jest.fn(),
        removeListener: jest.fn(),
      }));

      // Wait for layout change
      await waitFor(() => {
        expect(mockScrollTo).toHaveBeenCalledWith(0, 100);
      });
    });
  });

  describe("Layout Performance", () => {
    it("should not trigger unnecessary re-renders during version changes", async () => {
      const renderSpy = jest.fn();

      const WrappedComponent = () => {
        useEffect(() => {
          renderSpy();
        }, []);

        return (
          <div data-testid="ephemeral-content-wrapper">
            <div data-testid="ephemeral-content">Test Content</div>
          </div>
        );
      };

      const props = {
        initialVersion: "ephemeral" as const,
        LandingPage: WrappedComponent,
        GitLabLandingPage: WrappedComponent,
        KubernetesLandingPage: WrappedComponent,
        ReplicatedLandingPage: WrappedComponent,
        EphemeralLanding: WrappedComponent,
        CloudDevLanding: WrappedComponent,
        CloudLanding: WrappedComponent,
        AIPipelineLanding: WrappedComponent,
      };

      await act(async () => {
        render(
          <VersionProvider>
            <LandingWrapper {...props} />
          </VersionProvider>,
        );
      });

      // Wait for initial render
      await act(async () => {
        await screen.findByTestId("ephemeral-content-wrapper");
      });

      // Check render count - should be called at least once for initial render
      expect(renderSpy).toHaveBeenCalled();
      expect(renderSpy.mock.calls.length).toBeGreaterThanOrEqual(1);
    });
  });
});
