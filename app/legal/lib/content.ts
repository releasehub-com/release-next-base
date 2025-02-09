import fs from "fs";
import path from "path";
import matter from "gray-matter";

interface LegalContent {
  content: string;
  frontmatter: {
    title: string;
    publishDate: string;
    slug: string;
  };
}

export function getLegalContent(slug: string): LegalContent {
  const contentDirectory = path.join(process.cwd(), "app/legal/content");
  const fullPath = path.join(contentDirectory, `${slug}.mdx`);

  if (!fs.existsSync(fullPath)) {
    throw new Error(`Legal content not found: ${slug}`);
  }

  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data: frontmatter, content } = matter(fileContents);

  return {
    content,
    frontmatter: {
      title: frontmatter.title || "",
      publishDate: frontmatter.publishDate || "",
      slug: frontmatter.slug || slug,
    },
  };
}

// Helper function to get all legal pages for static generation
export function getAllLegalSlugs(): string[] {
  const contentDirectory = path.join(process.cwd(), "app/legal/content");
  const filenames = fs.readdirSync(contentDirectory);

  return filenames
    .filter((filename) => filename.endsWith(".mdx"))
    .map((filename) => filename.replace(".mdx", ""));
}
