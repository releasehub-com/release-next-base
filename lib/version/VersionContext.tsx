"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  Suspense,
} from "react";
import { useSearchParams, usePathname } from "next/navigation";
import { VersionContextType, VersionId } from "./types";
import {
  getVersionFromPath,
  getVersionContent,
  isValidVersion,
  setVersion as setVersionService,
  resolveVersion as resolveVersionService,
  getVersionFromStorage,
} from "./versionService";

const VersionContext = createContext<VersionContextType | null>(null);

export function VersionProvider({ children }: { children: React.ReactNode }) {
  // Initialize with stored version or default
  const [version, setVersionState] = useState<VersionId>(() => {
    const storedVersion = getVersionFromStorage();
    return storedVersion || "ephemeral";
  });

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VersionProviderInner version={version} setVersionState={setVersionState}>
        {children}
      </VersionProviderInner>
    </Suspense>
  );
}

function VersionProviderInner({
  children,
  version,
  setVersionState,
}: {
  children: React.ReactNode;
  version: VersionId;
  setVersionState: (version: VersionId) => void;
}) {
  const searchParams = useSearchParams();
  const pathname = usePathname();

  useEffect(() => {
    // Get version from URL parameters
    const urlVersion = searchParams.get("version");
    // Get version from path
    const pathVersion = getVersionFromPath(pathname);

    console.log("VersionContext - Version Resolution:", {
      urlVersion,
      pathVersion,
      pathname,
    });

    // Resolve version with priority:
    // 1. URL parameter 'version=ai' -> 'ai-pipeline'
    // 2. Other valid URL parameters
    // 3. Path-based version
    // 4. Default version (ephemeral)
    const resolvedVersion = resolveVersionService({ urlVersion, pathVersion });

    console.log("VersionContext - Resolved version:", resolvedVersion);
    setVersionState(resolvedVersion);
    setVersionService(resolvedVersion);
  }, [searchParams, pathname, setVersionState]);

  const contextValue: VersionContextType = {
    version,
    setVersion: async (newVersion: VersionId) => {
      setVersionState(newVersion);
      await setVersionService(newVersion);
    },
    resolveVersion: resolveVersionService,
    isValidVersion,
    getVersionContent,
  };

  return (
    <VersionContext.Provider value={contextValue}>
      {children}
    </VersionContext.Provider>
  );
}

export function useVersion() {
  const context = useContext(VersionContext);
  if (!context) {
    throw new Error("useVersion must be used within a VersionProvider");
  }
  return context;
}
