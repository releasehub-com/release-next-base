import * as fs from "fs";
import * as path from "path";
import { parse } from "csv-parse";
import TurndownService from "turndown";
import { gfm } from "turndown-plugin-gfm";
import * as https from "https";
import { createHash } from "crypto";
import * as yaml from "js-yaml";

const turndownService = new TurndownService({
  headingStyle: "atx",
  codeBlockStyle: "fenced",
});

// Use GitHub Flavored Markdown plugin
turndownService.use(gfm);

// Configure Turndown to handle code blocks better
turndownService.addRule("codeBlocks", {
  filter: function (node, options) {
    return (
      node.nodeName === "PRE" &&
      node.firstChild &&
      node.firstChild.nodeName === "CODE"
    );
  },
  replacement: function (content, node, options) {
    const code = node.firstChild.textContent;
    const lang = node.firstChild.className.replace("language-", "");
    return `\n\`\`\`${lang}\n${code}\n\`\`\`\n\n`;
  },
});

// Add image downloading function
async function downloadImage(url: string): Promise<string> {
  const publicDir = path.join(process.cwd(), "public/blog-images");

  // Create images directory if it doesn't exist
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  // Use createHash imported from crypto
  const hash = createHash("md5").update(url).digest("hex");
  const extension = path.extname(url) || ".jpg"; // Default to jpg if no extension
  const fileName = `${hash}${extension}`;
  const filePath = path.join(publicDir, fileName);

  // Skip if image already exists
  if (fs.existsSync(filePath)) {
    return fileName;
  }

  return new Promise((resolve, reject) => {
    https
      .get(url, (response) => {
        if (response.statusCode !== 200) {
          reject(new Error(`Failed to download image: ${response.statusCode}`));
          return;
        }

        const file = fs.createWriteStream(filePath);
        response.pipe(file);

        file.on("finish", () => {
          file.close();
          resolve(fileName);
        });

        file.on("error", (err) => {
          fs.unlink(filePath, () => reject(err));
        });
      })
      .on("error", reject);
  });
}

// Modify the markdown conversion to handle images
turndownService.addRule("images", {
  filter: ["img"],
  replacement: function (content, node) {
    const alt = node.getAttribute("alt") || "";
    const src = node.getAttribute("src") || "";
    return `![${alt}](${src})`;
  },
});

async function processMarkdownImages(markdown: string): Promise<string> {
  const imageRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;
  let newMarkdown = markdown;
  // Fix the matchAll iteration
  const matches = Array.from(markdown.matchAll(imageRegex));

  for (const match of matches) {
    const [fullMatch, alt, url] = match;
    try {
      const fileName = await downloadImage(url);
      newMarkdown = newMarkdown.replace(url, `/blog-images/${fileName}`);
      console.log(`Downloaded image: ${fileName}`);
    } catch (err) {
      console.error(`Failed to download image ${url}:`, err);
    }
  }

  return newMarkdown;
}

// Interface for CSV record structure
interface BlogPostRecord {
  Name: string;
  Slug: string;
  "Post Summary": string;
  "Published On": string;
  Author: string;
  "Reading time (in minutes)": string;
  Categories: string;
  "Post Body Top": string;
  "Post Body CTA | Switch": string;
  "Post Body CTA | Copy": string;
  "Post Body CTA | Link": string;
  "Post Body Bottom": string;
  "Main Image": string;
  "Alt text for Main image": string;
  "You might also like": string;
}

async function convertHtmlToMarkdown(html: string): Promise<string> {
  if (!html) return "";

  // Convert HTML to Markdown
  const markdown = turndownService.turndown(html);

  // Clean up any remaining HTML-like content
  return (
    markdown
      // Remove any remaining HTML comments
      .replace(/<!--[\s\S]*?-->/g, "")
      // Remove empty lines between list items
      .replace(/\n\n(-|\*|\+|\d+\.)/g, "\n$1")
      // Ensure proper spacing around headers
      .replace(/\n(#{1,6}.*)\n/g, "\n\n$1\n\n")
      // Clean up multiple blank lines
      .replace(/\n{3,}/g, "\n\n")
  );
}

async function importBlogPosts(forceOverwrite = false) {
  const postsDir = path.join(process.cwd(), "app/blog/posts");

  if (!fs.existsSync(postsDir)) {
    fs.mkdirSync(postsDir, { recursive: true });
  }

  const csvFile = fs.readFileSync("release-blog-posts.csv", "utf-8");

  parse(
    csvFile,
    {
      columns: true,
      skip_empty_lines: true,
    },
    async (error: any, records: BlogPostRecord[]) => {
      if (error) {
        console.error("Error parsing CSV:", error);
        return;
      }

      for (const record of records) {
        try {
          const publishDate = new Date(record["Published On"]);
          const now = new Date();
          if (publishDate > now) {
            console.log(
              `Skipping ${record.Slug} - not yet published (${record["Published On"]})`,
            );
            continue;
          }

          const filePath = path.join(postsDir, `${record.Slug}.mdx`);

          if (fs.existsSync(filePath) && !forceOverwrite) {
            console.log(`Skipping ${record.Slug} - file already exists`);
            continue;
          }

          // Download main image if it exists
          let mainImagePath = record["Main Image"];
          if (mainImagePath) {
            try {
              const fileName = await downloadImage(mainImagePath);
              mainImagePath = `/blog-images/${fileName}`;
            } catch (err) {
              console.error(
                `Failed to download main image for ${record.Slug}:`,
                err,
              );
            }
          }

          // Convert HTML content to Markdown
          const topContent = record["Post Body Top"]
            ? await convertHtmlToMarkdown(record["Post Body Top"])
            : "";
          const bottomContent = record["Post Body Bottom"]
            ? await convertHtmlToMarkdown(record["Post Body Bottom"])
            : "";

          // Combine content without injecting CTA component
          const content = [topContent, bottomContent]
            .filter(Boolean)
            .join("\n\n");

          // Process any images in the content
          const processedContent = await processMarkdownImages(content);

          // Prepare frontmatter with CTA configuration
          const frontmatter = {
            title: record.Name,
            summary: record["Post Summary"],
            publishDate: record["Published On"],
            author: record.Author?.toLowerCase().replace(/\s+/g, "-"),
            readingTime: parseInt(record["Reading time (in minutes)"]) || 0,
            categories: record.Categories
              ? record.Categories.split(",").map((c) => c.trim())
              : [],
            mainImage: mainImagePath,
            imageAlt: record["Alt text for Main image"],
            showCTA: record["Post Body CTA | Switch"] === "true",
            ctaCopy: record["Post Body CTA | Copy"] || "",
            ctaLink: record["Post Body CTA | Link"] || "",
            relatedPosts:
              record["You might also like"]
                ?.split(",")
                .map((slug) => slug.trim()) || [],
          };

          // Create MDX content with frontmatter
          const fileContent = `---\n${yaml.dump(frontmatter)}---\n\n${processedContent}`;

          fs.writeFileSync(filePath, fileContent, "utf8");
          console.log(`Imported: ${record.Slug}`);
        } catch (err) {
          console.error(`Error processing ${record.Slug}:`, err);
        }
      }
    },
  );
}

// Get command line arguments
const args = process.argv.slice(2);
const forceOverwrite = args.includes("--force");

importBlogPosts(forceOverwrite).catch(console.error);
