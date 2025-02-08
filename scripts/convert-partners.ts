import fs from "fs";
import path from "path";
import { parse } from "csv-parse/sync";
import TurndownService from "turndown";
import * as turndownPluginGfm from "turndown-plugin-gfm";
import { downloadImage } from "./utils/download-image";

interface Partner {
  "Partner Name": string;
  Slug: string;
  "Header | Title": string;
  "Header | Description": string;
  "Header | Main image": string;
  "Header | Button copy": string;
  Thumbnail: string;
  Category: string;
  Link: string;
  "Feature | Title": string;
  "Feature | List": string;
  "Feature | Image": string;
  "Better | Title": string;
  "Better | Description": string;
  "Better Card | Content 1": string;
  "Better Card | Content 2": string;
  "Better Card | Content 3": string;
  "Better Card | Content 4": string;
  "Better Card | Content 5": string;
  "Better Card | Content 6": string;
  "CTA | Title": string;
  "CTA | Description": string;
  "CTA | Button copy": string;
  "Published On": string;
}

const PARTNERS_DIR = path.join(process.cwd(), "app/partners/content");
const IMAGES_DIR = path.join(process.cwd(), "public/partner-images");

// Ensure directories exist
fs.mkdirSync(PARTNERS_DIR, { recursive: true });
fs.mkdirSync(IMAGES_DIR, { recursive: true });

// Initialize Turndown with GFM plugin
const turndownService = new TurndownService({
  codeBlockStyle: "fenced",
  headingStyle: "atx",
});
turndownService.use(turndownPluginGfm.gfm);

async function convertPartners() {
  const csvContent = fs.readFileSync("release-partners.csv", "utf-8");
  const partners = parse(csvContent, { columns: true }) as Partner[];

  console.log(`Found ${partners.length} partners to process`);

  for (const partner of partners) {
    try {
      console.log(`\nProcessing ${partner["Partner Name"]}...`);

      // Download images with logging
      let thumbnailFilename: string | null = null;
      if (partner.Thumbnail) {
        console.log(`Downloading thumbnail from ${partner.Thumbnail}`);
        thumbnailFilename = await downloadImage(partner.Thumbnail, IMAGES_DIR);
        console.log(`Saved thumbnail as ${thumbnailFilename}`);
      }

      // Download images
      const mainImage = partner["Header | Main image"]
        ? await downloadImage(partner["Header | Main image"], IMAGES_DIR)
        : null;
      const featureImage = partner["Feature | Image"]
        ? await downloadImage(partner["Feature | Image"], IMAGES_DIR)
        : null;

      // Create frontmatter
      const frontmatter = {
        title: partner["Header | Title"] || partner["Partner Name"],
        description: partner["Header | Description"],
        category: partner.Category,
        thumbnail: thumbnailFilename
          ? `/partner-images/${thumbnailFilename}`
          : null,
        mainImage: mainImage ? `/partner-images/${mainImage}` : null,
        featureImage: featureImage ? `/partner-images/${featureImage}` : null,
        buttonCopy: partner["Header | Button copy"],
        externalLink: partner.Link,
        featureTitle: partner["Feature | Title"],
        featureList: partner["Feature | List"],
        betterTitle: partner["Better | Title"],
        betterDescription: partner["Better | Description"],
        betterCards: [
          partner["Better Card | Content 1"],
          partner["Better Card | Content 2"],
          partner["Better Card | Content 3"],
          partner["Better Card | Content 4"],
          partner["Better Card | Content 5"],
          partner["Better Card | Content 6"],
        ].filter(Boolean),
        ctaTitle: partner["CTA | Title"],
        ctaDescription: partner["CTA | Description"],
        ctaButtonCopy: partner["CTA | Button copy"],
        publishDate: partner["Published On"],
      };

      // Create MDX content
      const mdxContent = `---
${Object.entries(frontmatter)
  .filter(([_, value]) => value !== null && value !== "")
  .map(([key, value]) => `${key}: ${JSON.stringify(value)}`)
  .join("\n")}
---

<PartnerCTA />
`;

      // Write MDX file
      const mdxPath = path.join(PARTNERS_DIR, `${partner.Slug}.mdx`);
      fs.writeFileSync(mdxPath, mdxContent);

      console.log(`Converted ${partner["Partner Name"]} to MDX`);
    } catch (error) {
      console.error(`Failed to convert ${partner["Partner Name"]}:`, error);
    }
  }
}

convertPartners().catch(console.error);
