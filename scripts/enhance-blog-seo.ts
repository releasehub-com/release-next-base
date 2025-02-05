import fs from "fs";
import path from "path";
import matter from "gray-matter";
import slugify from "slugify";

const POSTS_DIRECTORY = path.join(process.cwd(), "app/blog/posts");

interface PostFrontmatter {
  title: string;
  summary?: string;
  excerpt?: string;
  publishDate?: string;
  author?: string;
  readingTime?: number;
  categories?: string[];
  tags?: string[];
  mainImage?: string;
  imageAlt?: string;
  showCTA?: boolean;
  ctaCopy?: string;
  ctaLink?: string;
  relatedPosts?: string[];
  ogImage?: string;
  updatedDate?: string;
  canonicalUrl?: string;
}

function generateExcerpt(content: string): string {
  // Remove markdown formatting and get first ~160 characters
  const plainText = content
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1") // Replace markdown links with just text
    .replace(/[#*`_]/g, "") // Remove markdown formatting
    .replace(/\n+/g, " ") // Replace newlines with spaces
    .trim();
  return plainText.slice(0, 157) + "...";
}

function estimateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}

function generateDefaultCTA(title: string): { copy: string; link: string } {
  const slug = slugify(title, { lower: true });
  return {
    copy: `<p>Learn how to improve your development workflow with Release.</p>`,
    link: `https://release.com/signup?utm_source=blog&utm_medium=cta&utm_campaign=blog-cta&utm_content=${slug}`,
  };
}

// Add command line argument for dry run
const isDryRun = process.argv.includes("--dry-run");
if (isDryRun) {
  console.log("Dry run - no files will be modified");
}

function enhancePostSEO() {
  const files = fs.readdirSync(POSTS_DIRECTORY);
  const mdxFiles = files.filter((file) => file.endsWith(".mdx"));

  mdxFiles.forEach((filename) => {
    const filePath = path.join(POSTS_DIRECTORY, filename);
    const fileContent = fs.readFileSync(filePath, "utf8");

    // Parse the frontmatter and content
    const { data, content } = matter(fileContent);
    const frontmatter = data as Partial<PostFrontmatter>;
    const changes: string[] = [];

    // Generate missing fields
    const enhancedFrontmatter: PostFrontmatter = {
      title: frontmatter.title || filename.replace(".mdx", ""),
      ...frontmatter,
    };

    // Track all changes
    if (!frontmatter.excerpt && !frontmatter.summary) {
      changes.push(`- Adding excerpt: "${generateExcerpt(content)}"`);
    }

    if (!frontmatter.categories?.length) {
      changes.push("- Adding empty categories array");
    }

    if (!frontmatter.tags?.length) {
      changes.push("- Adding tags based on categories");
    }

    if (!frontmatter.readingTime) {
      changes.push(
        `- Adding estimated reading time: ${estimateReadingTime(content)} minutes`,
      );
    }

    if (!frontmatter.ogImage) {
      changes.push(
        `- Adding OG image: ${frontmatter.mainImage || "/blog/default-og-image.png"}`,
      );
    }

    if (frontmatter.showCTA !== false && !frontmatter.ctaCopy) {
      changes.push("- Adding default CTA");
    }

    if (frontmatter.mainImage && !frontmatter.imageAlt) {
      changes.push(`- Adding image alt text: "${frontmatter.title}"`);
    }

    // Add the actual frontmatter changes
    enhancedFrontmatter.excerpt =
      frontmatter.excerpt || frontmatter.summary || generateExcerpt(content);
    enhancedFrontmatter.categories = frontmatter.categories || [];
    enhancedFrontmatter.tags = frontmatter.tags || frontmatter.categories || [];
    enhancedFrontmatter.readingTime =
      frontmatter.readingTime || estimateReadingTime(content);
    enhancedFrontmatter.ogImage =
      frontmatter.ogImage ||
      frontmatter.mainImage ||
      "/blog/default-og-image.png";
    enhancedFrontmatter.showCTA = frontmatter.showCTA ?? true;

    // Add CTA content if showCTA is true but no content exists
    if (enhancedFrontmatter.showCTA && !enhancedFrontmatter.ctaCopy) {
      const defaultCTA = generateDefaultCTA(enhancedFrontmatter.title);
      enhancedFrontmatter.ctaCopy = defaultCTA.copy;
      enhancedFrontmatter.ctaLink = defaultCTA.link;
    }

    // Ensure imageAlt exists if mainImage exists
    if (frontmatter.mainImage && !frontmatter.imageAlt) {
      enhancedFrontmatter.imageAlt = frontmatter.title;
    }

    // Convert back to MDX string
    const updatedContent = matter.stringify(content, enhancedFrontmatter);

    if (!isDryRun) {
      // Write back to file
      fs.writeFileSync(filePath, updatedContent);
    }

    if (isDryRun) {
      if (changes.length > 0) {
        console.log(`\n[DRY RUN] Changes for ${filename}:`);
        changes.forEach((change) => console.log(change));
      } else {
        console.log(`\n[DRY RUN] No changes needed for ${filename}`);
      }
    } else {
      console.log(`Enhanced SEO for ${filename}`);
    }
  });

  console.log("\nAll files processed successfully!");
}

enhancePostSEO();
