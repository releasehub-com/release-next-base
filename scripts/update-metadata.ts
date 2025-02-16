import * as fs from "fs";
import * as path from "path";
import { glob } from "glob";

// Track modified files
const modifiedFiles: string[] = [];

// Function to process a single file
function processFile(filePath: string, dryRun: boolean = false): boolean {
  let content = fs.readFileSync(filePath, "utf8");
  const originalContent = content;

  // Remove url from openGraph (but not from images)
  const urlRegex = /(openGraph:\s*{[^}]*?)(,?\s*url:\s*['"][^'"]*['"])/;
  if (urlRegex.test(content)) {
    content = content.replace(urlRegex, "$1");
  }

  // Remove alternates if present
  const alternatesRegex = /,?\s*alternates:\s*{[^}]*}/;
  if (alternatesRegex.test(content)) {
    content = content.replace(alternatesRegex, "");
  }

  // Clean up any double commas
  content = content.replace(/,\s*,/g, ",");
  // Clean up trailing comma before closing brace
  content = content.replace(/,(\s*})/g, "$1");
  // Clean up empty lines
  content = content.replace(/^\s*[\r\n]/gm, "");

  if (content !== originalContent) {
    if (!dryRun) {
      fs.writeFileSync(filePath, content);
      modifiedFiles.push(filePath);
      console.log(`✅ Updated ${filePath}`);
    } else {
      console.log(`🔍 Would update ${filePath}`);
    }
    return true;
  }
  return false;
}

// Main function to process all metadata files
async function updateMetadataFiles(dryRun: boolean = false) {
  try {
    console.log(
      dryRun
        ? "🔍 Performing dry run - no files will be modified\n"
        : "🔄 Updating metadata files...\n",
    );

    // Find all metadata.ts files in the app directory
    const files = await glob("app/**/metadata.ts");

    // Process each file
    files.forEach((file) => processFile(file, dryRun));

    // Print summary
    console.log("\n📋 Summary:");
    console.log("------------------");
    if (modifiedFiles.length > 0) {
      console.log("\nModified files:");
      modifiedFiles.forEach((file) => {
        console.log(`  - ${file}`);
      });
      console.log(`\nTotal files: ${modifiedFiles.length}`);
    } else {
      console.log("No files need modification.");
    }

    if (dryRun) {
      console.log(
        "\n📝 This was a dry run. Run with dryRun=false to apply changes.",
      );
    } else {
      console.log("\n✨ Metadata update complete!");
    }
  } catch (error) {
    console.error("Error processing metadata files:", error);
  }
}

// Run the script without dry-run
updateMetadataFiles(false);
