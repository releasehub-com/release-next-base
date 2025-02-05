import fs from "fs";
import path from "path";
import matter from "gray-matter";
import OpenAI from "openai";

const POSTS_DIRECTORY = path.join(process.cwd(), "app/blog/posts");
const DEFAULT_CTA_BUTTON = "Try Release for Free";
const AVAILABLE_CATEGORIES = [
  "ai",
  "customer-stories",
  "events",
  "kubernetes",
  "nvidia",
  "news",
  "platform engineering",
  "product",
];

// Check for OpenAI API key
if (!process.env.OPENAI_API_KEY) {
  console.error("Error: OPENAI_API_KEY environment variable is required");
  process.exit(1);
}

// Initialize OpenAI client after checking API key exists
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Add command line argument for dry run
const isDryRun = process.argv.includes("--dry-run");
if (isDryRun) {
  console.log("Dry run - no files will be modified");
}

async function generateMetadata(
  content: string,
  title: string,
): Promise<{
  ctaCopy: string;
  ctaButton: string;
  categories: string[];
}> {
  const prompt = `
    Based on this blog post titled "${title}", generate:
    1. A compelling call-to-action message (MAXIMUM 20 WORDS) encouraging readers to try Release.com's environment management platform
    2. A short button text (3-5 words) encouraging signup that relates to the blog topic
    3. Categorize the post into one or more of these categories: ${AVAILABLE_CATEGORIES.join(", ")}
    
    The CTA should relate to the blog post's content while highlighting Release's value proposition.
    
    Blog content:
    ${content.slice(0, 1500)}...
    
    Format response as JSON with:
    - 'ctaCopy' field (wrapped in <p> tags, max 20 words)
    - 'ctaButton' field (3-5 words)
    - 'categories' field (array of relevant categories from the provided list)
  `;

  const completion = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.7,
  });

  try {
    const response = JSON.parse(completion.choices[0].message.content || "{}");
    // Validate categories are from allowed list
    response.categories = response.categories.filter((cat) =>
      AVAILABLE_CATEGORIES.includes(cat.toLowerCase()),
    );
    return response;
  } catch (e) {
    console.error("Failed to parse OpenAI response");
    return {
      ctaCopy:
        "<p>Experience seamless environment management with Release.</p>",
      ctaButton: DEFAULT_CTA_BUTTON,
      categories: [],
    };
  }
}

async function enhancePostMetadata(filename: string): Promise<void> {
  const filePath = path.join(POSTS_DIRECTORY, filename);
  const fileContent = fs.readFileSync(filePath, "utf8");

  // Parse the frontmatter and content
  const { data, content } = matter(fileContent);
  const frontmatter = data as Record<string, any>;
  const changes: string[] = [];

  try {
    // Generate new metadata
    const { ctaCopy, ctaButton, categories } = await generateMetadata(
      content,
      frontmatter.title,
    );

    // Track changes
    if (frontmatter.ctaCopy !== ctaCopy) {
      changes.push(`- Updating ctaCopy from: "${frontmatter.ctaCopy || ""}"`);
      changes.push(`  to: "${ctaCopy}"`);
      frontmatter.ctaCopy = ctaCopy;
    }

    if (frontmatter.ctaButton !== ctaButton) {
      changes.push(
        `- Updating ctaButton from: "${frontmatter.ctaButton || ""}"`,
      );
      changes.push(`  to: "${ctaButton}"`);
      frontmatter.ctaButton = ctaButton;
    }

    // Only update categories if none exist or they're empty
    if (!frontmatter.categories || frontmatter.categories.length === 0) {
      changes.push(`- Adding categories: ${categories.join(", ")}`);
      frontmatter.categories = categories;
      // Update tags to match categories if they're empty
      if (!frontmatter.tags || frontmatter.tags.length === 0) {
        frontmatter.tags = categories;
      }
    }

    // Convert back to MDX string
    const updatedContent = matter.stringify(content, frontmatter);

    if (!isDryRun && changes.length > 0) {
      fs.writeFileSync(filePath, updatedContent);
    }

    if (changes.length > 0) {
      console.log(`\n${isDryRun ? "[DRY RUN] " : ""}Changes for ${filename}:`);
      changes.forEach((change) => console.log(change));
    } else {
      console.log(
        `\n${isDryRun ? "[DRY RUN] " : ""}No changes needed for ${filename}`,
      );
    }
  } catch (error) {
    console.error(`Error processing ${filename}:`, error);
  }
}

async function enhanceAllMetadata() {
  const files = fs.readdirSync(POSTS_DIRECTORY);
  const mdxFiles = files.filter((file) => file.endsWith(".mdx"));

  for (const filename of mdxFiles) {
    await enhancePostMetadata(filename);
  }

  console.log("\nAll files processed successfully!");
}

enhanceAllMetadata();
