import { setVersionInStorage, type VersionId } from "@/config/versions";

// Helper function to set version in both localStorage and cookie
export async function setVersion(version: VersionId) {
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
