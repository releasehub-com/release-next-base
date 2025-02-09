import {
  VERSIONS,
  isValidVersion,
  getCanonicalVersion,
  getVersionContent,
  getVersionPath,
  getVersionFromPath,
  getVersionFromStorage,
  setVersionInStorage,
  STORAGE_KEY,
  DEFAULT_VERSION,
  type VersionId,
} from "@/config/versions";

describe("Version Configuration", () => {
  beforeEach(() => {
    localStorage.clear();
    // Clear all cookies
    document.cookie.split(";").forEach((cookie) => {
      const [name] = cookie.split("=");
      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT`;
    });
  });

  describe("Version Validation", () => {
    it("should validate canonical versions", () => {
      expect(isValidVersion("ephemeral")).toBe(true);
      expect(isValidVersion("kubernetes")).toBe(true);
      expect(isValidVersion("release-ai")).toBe(true);
      expect(isValidVersion("invalid")).toBe(false);
    });

    it("should validate version aliases", () => {
      expect(isValidVersion("k8s")).toBe(true);
      expect(isValidVersion("ai")).toBe(true);
      expect(isValidVersion("heroku")).toBe(true);
      expect(isValidVersion("paas")).toBe(true);
    });
  });

  describe("Version Resolution", () => {
    it("should resolve canonical versions", () => {
      expect(getCanonicalVersion("kubernetes")).toBe("kubernetes");
      expect(getCanonicalVersion("release-ai")).toBe("release-ai");
      expect(getCanonicalVersion("cloud")).toBe("cloud");
    });

    it("should resolve aliases to canonical versions", () => {
      expect(getCanonicalVersion("k8s")).toBe("kubernetes");
      expect(getCanonicalVersion("ai")).toBe("release-ai");
      expect(getCanonicalVersion("heroku")).toBe("cloud");
      expect(getCanonicalVersion("paas")).toBe("cloud");
    });
  });

  describe("Path Mapping", () => {
    it("should map versions to correct paths", () => {
      expect(getVersionPath("kubernetes")).toBe("/kubernetes-management");
      expect(getVersionPath("release-ai")).toBe("/");
      expect(getVersionPath("cloud")).toBe("/platform-as-a-service");
    });

    it("should resolve paths to correct versions", () => {
      expect(getVersionFromPath("/kubernetes-management")).toBe("kubernetes");
      expect(getVersionFromPath("/")).toBe("ephemeral");
      expect(getVersionFromPath("/platform-as-a-service")).toBe("cloud");
    });

    it("should default to ephemeral for unknown paths", () => {
      expect(getVersionFromPath("/unknown")).toBe("ephemeral");
    });
  });

  describe("Content Management", () => {
    it("should provide correct content for each version", () => {
      const content = getVersionContent("release-ai");
      expect(content.title).toBe("Deploy High-Performance AI Models with Ease");
      expect(content.benefits).toHaveLength(3);
      expect(content.steps).toHaveLength(3);
    });

    it("should include required fields in all version content", () => {
      Object.keys(VERSIONS).forEach((version) => {
        const content = getVersionContent(version as VersionId);
        expect(content.title).toBeDefined();
        expect(Array.isArray(content.benefits)).toBe(true);
        expect(Array.isArray(content.steps)).toBe(true);
        content.benefits.forEach((benefit) => {
          expect(benefit.icon).toBeDefined();
          expect(benefit.title).toBeDefined();
          expect(benefit.description).toBeDefined();
        });
      });
    });
  });

  describe("Storage Management", () => {
    it("should store and retrieve version from localStorage", () => {
      setVersionInStorage("kubernetes");
      expect(getVersionFromStorage()).toBe("kubernetes");
      expect(localStorage.getItem(STORAGE_KEY)).toBe("kubernetes");
    });

    it("should fall back to cookie when localStorage is empty", () => {
      document.cookie = `${STORAGE_KEY}=release-ai`;
      expect(getVersionFromStorage()).toBe("release-ai");
    });

    it("should persist cookie value to localStorage", () => {
      document.cookie = `${STORAGE_KEY}=cloud`;
      getVersionFromStorage();
      expect(localStorage.getItem(STORAGE_KEY)).toBe("cloud");
    });

    it("should return default version when no storage exists", () => {
      expect(getVersionFromStorage()).toBe(DEFAULT_VERSION);
    });

    it("should handle invalid stored values", () => {
      localStorage.setItem(STORAGE_KEY, "invalid");
      expect(getVersionFromStorage()).toBe(DEFAULT_VERSION);
    });
  });
});
