import { render, screen, act, waitFor } from "@testing-library/react";
import type { VersionId } from "@/config/versions";
import { VersionProvider } from "@/lib/version/VersionContext";
import { mockComponents, mockDynamicImport } from "../mocks/components";

// Create mock functions that we'll use in our tests
const mockUseSearchParams = jest.fn();
const mockUsePathname = jest.fn();

// Create mock functions for version service
const mockGetVersionFromStorage = jest.fn<VersionId | null, []>();
const mockSetVersionInStorage = jest.fn<void, [VersionId]>();
const mockGetVersionFromPath = jest.fn<VersionId | null, [string]>();
const mockIsValidVersion = jest.fn<boolean, [string]>();
const mockGetCanonicalVersion = jest.fn<VersionId, [string]>();
const mockResolveVersion = jest.fn<
  VersionId,
  [{ urlVersion: string | null; pathVersion: string | null }]
>();
const mockSetVersion = jest.fn<Promise<void>, [VersionId]>();

// Set up all mocks before importing modules
jest.mock("next/navigation", () => ({
  useSearchParams: () => mockUseSearchParams(),
  usePathname: () => mockUsePathname(),
}));

jest.mock("@/lib/version/versionService", () => ({
  getVersionFromStorage: () => mockGetVersionFromStorage(),
  setVersionInStorage: (version: VersionId) => mockSetVersionInStorage(version),
  getVersionFromPath: (path: string) => mockGetVersionFromPath(path),
  isValidVersion: (version: string) => mockIsValidVersion(version),
  getCanonicalVersion: (version: string) => mockGetCanonicalVersion(version),
  resolveVersion: (params: {
    urlVersion: string | null;
    pathVersion: string | null;
  }) => mockResolveVersion(params),
  setVersion: (version: VersionId) => mockSetVersion(version),
}));

// Import the mocked version service
import * as versionService from "@/lib/version/versionService";
const mockedVersionService = versionService as jest.Mocked<
  typeof versionService
>;

// Mock dynamic imports
jest.mock("next/dynamic", () => ({
  __esModule: true,
  default: (importFn: any) => {
    const importString = importFn.toString();
    let Component;

    if (importString.includes("GitLabContent"))
      Component = mockComponents.GitLabLandingPage;
    else if (importString.includes("KubernetesContent"))
      Component = mockComponents.KubernetesLandingPage;
    else if (importString.includes("ReplicatedContent"))
      Component = mockComponents.ReplicatedLandingPage;
    else if (importString.includes("CloudDevContent"))
      Component = mockComponents.CloudDevLanding;
    else if (importString.includes("PaasContent"))
      Component = mockComponents.CloudLanding;
    else if (importString.includes("AIPipelineContent"))
      Component = mockComponents.AIPipelineLanding;
    else if (importString.includes("EphemeralContent"))
      Component = mockComponents.EphemeralLanding;
    else Component = mockComponents.LandingPage;

    return Component;
  },
}));

// Import the actual component after mocks are set up
import ClientSideRenderer from "@/components/ClientSideRenderer";

describe("ClientSideRenderer", () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();

    // Set up default mock implementations
    mockGetVersionFromStorage.mockReturnValue("cloud");
    mockGetVersionFromPath.mockReturnValue("kubernetes");
    mockIsValidVersion.mockReturnValue(true);
    mockGetCanonicalVersion.mockImplementation(
      (version) => version as VersionId,
    );
    mockResolveVersion.mockImplementation(
      ({ urlVersion, pathVersion }) =>
        (urlVersion || pathVersion || "ephemeral") as VersionId,
    );
    mockSetVersion.mockResolvedValue();

    mockUseSearchParams.mockReturnValue(new URLSearchParams());
    mockUsePathname.mockReturnValue("/");
  });

  it("should handle URL parameters", async () => {
    const mockSearchParams = new URLSearchParams("version=cloud-dev");
    mockUseSearchParams.mockReturnValue(mockSearchParams);
    mockUsePathname.mockReturnValue("/");
    mockGetVersionFromPath.mockReturnValue(null);
    mockGetVersionFromStorage.mockReturnValue("cloud-dev");
    mockIsValidVersion.mockReturnValue(true);

    render(
      <VersionProvider>
        <ClientSideRenderer />
      </VersionProvider>,
    );

    await waitFor(
      () => {
        expect(screen.getByTestId("cloud-dev-landing")).toBeInTheDocument();
      },
      { timeout: 3000 },
    );

    expect(mockSetVersion).toHaveBeenCalledWith("cloud-dev");
  });

  it("should handle direct path access", async () => {
    mockUseSearchParams.mockReturnValue(new URLSearchParams());
    mockUsePathname.mockReturnValue("/kubernetes-management");
    mockGetVersionFromPath.mockReturnValue("kubernetes");
    mockGetVersionFromStorage.mockReturnValue("kubernetes");
    mockIsValidVersion.mockReturnValue(true);

    render(
      <VersionProvider>
        <ClientSideRenderer />
      </VersionProvider>,
    );

    await waitFor(
      () => {
        expect(screen.getByTestId("kubernetes-landing")).toBeInTheDocument();
      },
      { timeout: 3000 },
    );

    expect(mockSetVersion).toHaveBeenCalledWith("kubernetes");
  });

  it("should prioritize URL params over path", async () => {
    const mockSearchParams = new URLSearchParams("version=gitlab");
    mockUseSearchParams.mockReturnValue(mockSearchParams);
    mockUsePathname.mockReturnValue("/kubernetes-management");
    mockGetVersionFromPath.mockReturnValue("kubernetes");
    mockGetVersionFromStorage.mockReturnValue("gitlab");
    mockIsValidVersion.mockReturnValue(true);

    render(
      <VersionProvider>
        <ClientSideRenderer />
      </VersionProvider>,
    );

    await waitFor(
      () => {
        expect(screen.getByTestId("gitlab-landing")).toBeInTheDocument();
      },
      { timeout: 3000 },
    );

    expect(mockSetVersion).toHaveBeenCalledWith("gitlab");
  });

  it("should handle version resolution from URL parameters", async () => {
    mockUseSearchParams.mockReturnValue(
      new URLSearchParams("?version=kubernetes"),
    );
    mockGetVersionFromPath.mockReturnValue(null);
    mockGetVersionFromStorage.mockReturnValue(null);
    mockIsValidVersion.mockReturnValue(true);

    render(<VersionProvider>Test Content</VersionProvider>);

    await waitFor(() => {
      expect(mockSetVersion).toHaveBeenCalledWith("kubernetes");
    });
  });

  it("should handle version resolution from path", async () => {
    mockUseSearchParams.mockReturnValue(new URLSearchParams());
    mockGetVersionFromPath.mockReturnValue("kubernetes");
    mockGetVersionFromStorage.mockReturnValue(null);
    mockIsValidVersion.mockReturnValue(true);

    render(<VersionProvider>Test Content</VersionProvider>);

    await waitFor(() => {
      expect(mockSetVersion).toHaveBeenCalledWith("kubernetes");
    });
  });

  it("should handle version resolution from storage", async () => {
    const mockParams = new URLSearchParams();
    mockUseSearchParams.mockReturnValue(mockParams);
    mockUsePathname.mockReturnValue("/");
    mockGetVersionFromPath.mockReturnValue(null);
    mockGetVersionFromStorage.mockReturnValue("kubernetes");
    mockIsValidVersion.mockReturnValue(true);
    mockResolveVersion.mockImplementation(() => "kubernetes");

    render(<VersionProvider>Test Content</VersionProvider>);

    await waitFor(() => {
      expect(mockResolveVersion).toHaveBeenCalledWith({
        urlVersion: null,
        pathVersion: null,
      });
      expect(mockSetVersion).toHaveBeenCalledWith("kubernetes");
    });
  });
});
