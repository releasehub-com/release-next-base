#!/usr/bin/env node

import fs from "fs/promises";
import path from "path";
import { glob } from "glob";

interface Options {
  dryRun: boolean;
  file?: string;
  all: boolean;
}

async function convertInlineCode(content: string): Promise<string> {
  // Match <code inline>text</code> pattern
  const regex = /<code\s+inline\s*>(.*?)<\/code>/g;
  return content.replace(regex, (_, text) => {
    // Replace with backticks, being careful with text that might contain backticks
    const hasBacktick = text.includes("`");
    if (hasBacktick) {
      // If text contains backticks, use double backticks
      return `\`\`${text}\`\``;
    }
    return `\`${text}\``;
  });
}

async function processFile(filePath: string, dryRun: boolean): Promise<void> {
  try {
    const content = await fs.readFile(filePath, "utf-8");
    const updatedContent = await convertInlineCode(content);

    if (content !== updatedContent) {
      if (dryRun) {
        console.log(`Would update: ${filePath}`);
        console.log("Changes:");
        console.log("---");
        console.log(updatedContent);
        console.log("---");
      } else {
        await fs.writeFile(filePath, updatedContent, "utf-8");
        console.log(`Updated: ${filePath}`);
      }
    } else {
      console.log(`No changes needed in: ${filePath}`);
    }
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error);
  }
}

async function main() {
  const options: Options = {
    dryRun: process.argv.includes("--dry-run"),
    file: process.argv.find((arg) => arg.endsWith(".mdx")),
    all: process.argv.includes("--all"),
  };

  if (!options.file && !options.all) {
    console.error("Please specify either a file path or use --all");
    process.exit(1);
  }

  if (options.dryRun) {
    console.log("Dry run mode - no files will be modified");
  }

  if (options.all) {
    const files = await glob("app/blog/posts/**/*.mdx");
    for (const file of files) {
      await processFile(file, options.dryRun);
    }
  } else if (options.file) {
    await processFile(options.file, options.dryRun);
  }
}

main().catch(console.error);
