import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { BlogPost } from "../types";

export async function getBlogPosts(): Promise<BlogPost[]> {
  const postsDirectory = path.join(process.cwd(), "app/blog/posts");
  const filenames = fs.readdirSync(postsDirectory);

  const posts = filenames.map((filename) => {
    const filePath = path.join(postsDirectory, filename);
    const fileContent = fs.readFileSync(filePath, "utf8");

    const { data: frontmatter, content } = matter(fileContent);

    const trimmedContent = content.trim();
    if (!trimmedContent) {
      console.warn(`Warning: No content found in ${filename}`);
    }

    // Split categories by semicolons and commas, then flatten and trim
    const categories = frontmatter.categories
      ? (Array.isArray(frontmatter.categories)
          ? frontmatter.categories
          : [frontmatter.categories]
        )
          .flatMap((cat) => cat.split(/[;,]/).map((c) => c.trim()))
          .filter(Boolean)
      : [];

    return {
      slug: filename.replace(".mdx", ""),
      content: trimmedContent,
      frontmatter: {
        title: String(frontmatter.title || ""),
        summary: String(frontmatter.summary || ""),
        publishDate: String(frontmatter.publishDate || ""),
        author: String(frontmatter.author || ""),
        readingTime: Number(frontmatter.readingTime || 0),
        categories,
        mainImage: String(frontmatter.mainImage || ""),
        imageAlt: String(frontmatter.imageAlt || ""),
        showCTA: Boolean(frontmatter.showCTA),
        ctaCopy: String(frontmatter.ctaCopy || ""),
        ctaLink: String(frontmatter.ctaLink || ""),
        bodyTop: String(frontmatter.bodyTop || ""),
        bodyBottom: String(frontmatter.bodyBottom || ""),
        relatedPosts: Array.isArray(frontmatter.relatedPosts)
          ? frontmatter.relatedPosts.map((p) => String(p).trim())
          : [],
      },
    };
  });

  return posts.sort(
    (a, b) =>
      new Date(b.frontmatter.publishDate).getTime() -
      new Date(a.frontmatter.publishDate).getTime(),
  );
}
