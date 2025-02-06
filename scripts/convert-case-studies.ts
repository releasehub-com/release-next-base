import fs from "fs";
import path from "path";
import { parse } from "csv-parse/sync";
import TurndownService from "turndown";
import * as turndownPluginGfm from "turndown-plugin-gfm";
import { downloadImage } from "./utils/download-image";

interface CaseStudy {
  Name: string;
  Slug: string;
  Title: string;
  Description: string;
  "Body text": string;
  Logo: string;
  Thumbnail: string;
  "Published On": string;
  "Customer Profile | Company Size"?: string;
  "Customer Profile | Industry"?: string;
  "Customer Profile | Location"?: string;
  "Customer Profile | Development Velocity"?: string;
  "Customer Profile | Developer Experience"?: string;
  "Customer Profile | Lean Operations"?: string;
}

const CASE_STUDIES_DIR = path.join(process.cwd(), "app/case-studies/content");
const IMAGES_DIR = path.join(process.cwd(), "public/case-study-images");

// Ensure directories exist
fs.mkdirSync(CASE_STUDIES_DIR, { recursive: true });
fs.mkdirSync(IMAGES_DIR, { recursive: true });

// Initialize Turndown with GFM plugin
const turndownService = new TurndownService({
  codeBlockStyle: "fenced",
  headingStyle: "atx",
});

// Add GFM plugin
turndownService.use(turndownPluginGfm.gfm);

function cleanHtml(html: string): string {
  // Remove style tags and their content
  html = html.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "");

  // Remove class attributes
  html = html.replace(/\sclass="[^"]*"/g, "");

  // Remove any remaining CSS-like content
  html = html.replace(/\{[^}]*\}/g, "");

  // Clean up any double spaces or empty lines
  html = html.replace(/\s+/g, " ").trim();

  return html;
}

async function convertCaseStudies() {
  // Read CSV file
  const csvContent = fs.readFileSync("release-case-studies.csv", "utf-8");
  const caseStudies = parse(csvContent, {
    columns: true,
    skip_empty_lines: true,
  }) as CaseStudy[];

  for (const study of caseStudies) {
    try {
      // Download images
      const logoFilename = study.Logo
        ? await downloadImage(study.Logo, IMAGES_DIR)
        : null;
      const thumbnailFilename = study.Thumbnail
        ? await downloadImage(study.Thumbnail, IMAGES_DIR)
        : null;

      // Clean HTML and convert to Markdown
      const cleanedHtml = cleanHtml(study["Body text"]);
      const bodyMarkdown = turndownService.turndown(cleanedHtml);

      // Create frontmatter
      const frontmatter = {
        title: study.Title,
        description: study.Description,
        publishDate: new Date(study["Published On"]).toISOString(),
        logo: logoFilename ? `/case-study-images/${logoFilename}` : null,
        thumbnail: thumbnailFilename
          ? `/case-study-images/${thumbnailFilename}`
          : null,
        companySize: study["Customer Profile | Company Size"] || null,
        industry: study["Customer Profile | Industry"] || null,
        location: study["Customer Profile | Location"] || null,
        developmentVelocity:
          study["Customer Profile | Development Velocity"] || null,
        developerExperience:
          study["Customer Profile | Developer Experience"] || null,
        leanOperations: study["Customer Profile | Lean Operations"] || null,
      };

      // Create MDX content
      const mdxContent = `---
${Object.entries(frontmatter)
  .filter(([_, value]) => value !== null)
  .map(([key, value]) => `${key}: ${JSON.stringify(value)}`)
  .join("\n")}
---

${bodyMarkdown}

<CaseStudyCTA />
`;

      // Write MDX file
      const mdxPath = path.join(CASE_STUDIES_DIR, `${study.Slug}.mdx`);
      fs.writeFileSync(mdxPath, mdxContent);

      console.log(`Converted ${study.Name} to MDX`);
    } catch (error) {
      console.error(`Failed to convert ${study.Name}:`, error);
    }
  }
}

convertCaseStudies().catch(console.error);
