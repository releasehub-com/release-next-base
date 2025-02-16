import { readFileSync } from "fs";
import { join } from "path";
import { glob } from "glob";

interface MetadataTest {
  file: string;
  errors: string[];
}

function testMetadataFile(filePath: string): MetadataTest {
  const errors: string[] = [];
  const content = readFileSync(filePath, "utf-8");

  // Test 1: Check import statement
  if (!content.includes("import type { Metadata }")) {
    errors.push('❌ Should use "import type { Metadata }"');
  }

  // Test 2: Check for absolute URLs (except root metadata)
  if (filePath !== "app/metadata.ts") {
    if (content.includes("https://release.com")) {
      errors.push("❌ Contains absolute URLs (https://release.com)");
    }
  }

  // Test 3: Check OpenGraph fields
  if (!content.includes('siteName: "Release"')) {
    errors.push("❌ Missing siteName in OpenGraph");
  }

  // Test 4: Check Twitter fields
  if (!content.includes('creator: "@release_hub"')) {
    errors.push("❌ Missing creator in Twitter metadata");
  }

  // Test 5: Check alt text for default OG image
  if (content.includes('"/og/og-image.png"')) {
    const altTextMatch = content.match(/alt: "([^"]+)"/);
    if (
      !altTextMatch ||
      altTextMatch[1] !== "Release - The Ephemeral Environments Platform"
    ) {
      errors.push("❌ Default OG image should have standard alt text");
    }
  }

  // Test 6: Check for required metadata fields
  const requiredFields = [
    "title",
    "description",
    "openGraph",
    "twitter",
    "alternates",
  ];
  requiredFields.forEach((field) => {
    if (!content.includes(field + ":")) {
      errors.push(`❌ Missing required field: ${field}`);
    }
  });

  return { file: filePath, errors };
}

async function main() {
  const metadataFiles = await glob("app/**/metadata.ts", {
    ignore: "app/**/blog/**",
  });
  let hasErrors = false;

  console.log("\nTesting metadata files...\n");

  for (const file of metadataFiles) {
    const result = testMetadataFile(file);

    if (result.errors.length > 0) {
      hasErrors = true;
      console.log(`\n${file}:`);
      result.errors.forEach((error) => console.log(error));
    } else {
      console.log(`✅ ${file}`);
    }
  }

  console.log("\nTest complete.");
  if (hasErrors) {
    process.exit(1);
  }
}

main().catch(console.error);
