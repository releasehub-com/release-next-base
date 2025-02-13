import fs from "fs";
import path from "path";

function getAllFiles(dirPath: string, arrayOfFiles: string[] = []): string[] {
  const files = fs.readdirSync(dirPath);

  files.forEach((file) => {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      if (!fullPath.includes("node_modules") && !fullPath.includes(".next")) {
        arrayOfFiles = getAllFiles(fullPath, arrayOfFiles);
      }
    } else if (file === "page.tsx" || file === "metadata.ts") {
      arrayOfFiles.push(fullPath);
    }
  });

  return arrayOfFiles;
}

describe("Client/Server Component Boundaries", () => {
  const appDir = path.join(process.cwd(), "app");
  const pageFiles = getAllFiles(appDir);

  test('pages with "use client" should not export metadata', () => {
    const violations: string[] = [];

    pageFiles.forEach((filePath) => {
      const content = fs.readFileSync(filePath, "utf8");
      const hasUseClient = content.includes('"use client"');
      const hasMetadataExport =
        content.includes("export const metadata") ||
        content.includes("export let metadata") ||
        content.includes("export var metadata");

      // Only check page.tsx files
      if (filePath.endsWith("page.tsx") && hasUseClient && hasMetadataExport) {
        violations.push(filePath);
      }
    });

    if (violations.length > 0) {
      console.error(
        '\nFound pages that mix "use client" with metadata exports:',
      );
      violations.forEach((file) => {
        console.error(`- ${path.relative(process.cwd(), file)}`);
      });
    }

    expect(violations).toEqual([]);
  });

  test('each page.tsx with "use client" should have a corresponding metadata.ts', () => {
    const violations: string[] = [];
    const metadataFiles = new Set(
      pageFiles
        .filter((file) => file.endsWith("metadata.ts"))
        .map((file) => path.dirname(file)),
    );

    pageFiles
      .filter((file) => file.endsWith("page.tsx"))
      .forEach((pagePath) => {
        const content = fs.readFileSync(pagePath, "utf8");
        const hasUseClient = content.includes('"use client"');
        const pageDir = path.dirname(pagePath);

        if (hasUseClient && !metadataFiles.has(pageDir)) {
          violations.push(pagePath);
        }
      });

    if (violations.length > 0) {
      console.error(
        "\nFound client pages missing corresponding metadata.ts files:",
      );
      violations.forEach((file) => {
        console.error(`- ${path.relative(process.cwd(), file)}`);
      });
    }

    expect(violations).toEqual([]);
  });

  test("metadata.ts files should export metadata", () => {
    const violations: string[] = [];

    pageFiles
      .filter((file) => file.endsWith("metadata.ts"))
      .forEach((filePath) => {
        const content = fs.readFileSync(filePath, "utf8");
        const hasMetadataExport =
          content.includes("export const metadata") ||
          content.includes("export let metadata") ||
          content.includes("export var metadata");

        if (!hasMetadataExport) {
          violations.push(filePath);
        }
      });

    if (violations.length > 0) {
      console.error("\nFound metadata.ts files not exporting metadata:");
      violations.forEach((file) => {
        console.error(`- ${path.relative(process.cwd(), file)}`);
      });
    }

    expect(violations).toEqual([]);
  });
});
