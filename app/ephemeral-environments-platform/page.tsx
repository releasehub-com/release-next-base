"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import EphemeralContent from "./components/EphemeralContent";
import { setVersionInStorage, type VersionId } from "@/config/versions";

// Helper function to set version in both localStorage and cookie
async function setVersion(version: VersionId) {
  // Set in localStorage
  setVersionInStorage(version);

  // Set in cookie via API
  try {
    await fetch("/api/version", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ version }),
    });
  } catch (err) {
    console.error("Failed to set version cookie:", err);
  }
}

export default function EphemeralPage() {
  const searchParams = useSearchParams();
  const urlVersion = searchParams.get("version");

  useEffect(() => {
    // If no version in URL, set to ephemeral
    if (!urlVersion) {
      setVersion("ephemeral");
    }
  }, [urlVersion]);

  return <EphemeralContent />;
}
