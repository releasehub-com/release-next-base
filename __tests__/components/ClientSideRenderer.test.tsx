import { render, screen, act, waitFor } from "@testing-library/react";
import type { ValidVersion } from "@/config/versions";
import React from "react";
import { mockComponents, mockDynamicImport } from "../mocks/components";

// Create mock functions that we'll use in our tests
const mockUseSearchParams = jest.fn();
const mockUsePathname = jest.fn();
const mockSetVersionInStorage = jest.fn();
const mockGetVersionFromStorage = jest.fn();
const mockGetVersionFromPath = jest.fn();
const mockIsValidVersion = jest.fn(() => true);
const mockGetCanonicalVersion = jest.fn((v) => v);

// Set up all mocks before importing modules
jest.doMock("next/navigation", () => ({
  useSearchParams: mockUseSearchParams,
  usePathname: mockUsePathname,
}));

jest.doMock("@/config/versions", () => ({
  getVersionFromStorage: mockGetVersionFromStorage,
  setVersionInStorage: mockSetVersionInStorage,
  getVersionFromPath: mockGetVersionFromPath,
  isValidVersion: mockIsValidVersion,
  getCanonicalVersion: mockGetCanonicalVersion,
}));

// Mock both static and dynamic imports to use the same mock components
jest.doMock(
  "@/components/landing-pages/default/LandingPage",
  () => mockComponents.EphemeralLanding,
);
jest.doMock(
  "@/components/landing-pages/gitlab/GitLabLandingPage",
  () => mockComponents.GitLabLandingPage,
);
jest.doMock(
  "@/components/landing-pages/kubernetes/KubernetesLandingPage",
  () => mockComponents.KubernetesLandingPage,
);
jest.doMock(
  "@/components/landing-pages/replicated/ReplicatedLandingPage",
  () => mockComponents.ReplicatedLandingPage,
);
jest.doMock(
  "@/components/landing-pages/cloud-dev/CloudDevLanding",
  () => mockComponents.CloudDevLanding,
);
jest.doMock(
  "@/components/landing-pages/cloud/CloudLanding",
  () => mockComponents.CloudLanding,
);

jest.doMock("next/dynamic", () => mockDynamicImport);

// Import modules after all mocks are set up
const ClientSideRenderer = require("@/components/ClientSideRenderer").default;

describe("ClientSideRenderer", () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();

    // Initialize mock functions with default return values
    mockUseSearchParams.mockReturnValue(new URLSearchParams());
    mockUsePathname.mockReturnValue("/");
    mockGetVersionFromStorage.mockReturnValue("ephemeral" as ValidVersion);
    mockGetVersionFromPath.mockReturnValue(null);
  });

  it("should handle URL parameters", async () => {
    const mockSearchParams = new URLSearchParams("version=cloud-dev");
    mockUseSearchParams.mockReturnValue(mockSearchParams);
    mockUsePathname.mockReturnValue("/");
    mockGetVersionFromStorage.mockReturnValue("cloud-dev" as ValidVersion);

    let rendered;
    await act(async () => {
      rendered = render(<ClientSideRenderer />);
      // Wait for all promises to resolve
      await new Promise((resolve) => setTimeout(resolve, 100));
    });

    await waitFor(
      () => {
        expect(screen.getByTestId("cloud-dev-landing")).toBeInTheDocument();
      },
      { timeout: 3000 },
    );

    expect(mockSetVersionInStorage).toHaveBeenCalledWith("cloud-dev");
  });

  it("should handle direct path access", async () => {
    mockUseSearchParams.mockReturnValue(new URLSearchParams());
    mockUsePathname.mockReturnValue("/kubernetes-management");
    mockGetVersionFromPath.mockReturnValue("kubernetes" as ValidVersion);
    mockGetVersionFromStorage.mockReturnValue("kubernetes" as ValidVersion);

    let rendered;
    await act(async () => {
      rendered = render(<ClientSideRenderer />);
      // Wait for all promises to resolve
      await new Promise((resolve) => setTimeout(resolve, 100));
    });

    await waitFor(
      () => {
        expect(screen.getByTestId("kubernetes-landing")).toBeInTheDocument();
      },
      { timeout: 3000 },
    );

    expect(mockSetVersionInStorage).toHaveBeenCalledWith("kubernetes");
  });

  it("should prioritize URL params over path", async () => {
    const mockSearchParams = new URLSearchParams("version=gitlab");
    mockUseSearchParams.mockReturnValue(mockSearchParams);
    mockUsePathname.mockReturnValue("/kubernetes-management");
    mockGetVersionFromPath.mockReturnValue("kubernetes" as ValidVersion);
    mockGetVersionFromStorage.mockReturnValue("gitlab" as ValidVersion);

    let rendered;
    await act(async () => {
      rendered = render(<ClientSideRenderer />);
      // Wait for all promises to resolve
      await new Promise((resolve) => setTimeout(resolve, 100));
    });

    await waitFor(
      () => {
        expect(screen.getByTestId("gitlab-landing")).toBeInTheDocument();
      },
      { timeout: 3000 },
    );

    expect(mockSetVersionInStorage).toHaveBeenCalledWith("gitlab");
  });
});
