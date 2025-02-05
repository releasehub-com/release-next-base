import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { BlogPost } from '../types';

export async function getBlogPosts(): Promise<BlogPost[]> {
  const postsDirectory = path.join(process.cwd(), 'app/blog/posts');
  const filenames = fs.readdirSync(postsDirectory);
  
  const posts = filenames.map((filename) => {
    const filePath = path.join(postsDirectory, filename);
    const fileContent = fs.readFileSync(filePath, 'utf8');
    
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
        .flatMap(cat => cat.split(/[;,]/).map(c => c.trim()))
        .filter(Boolean)
      : [];

    return {
      slug: filename.replace('.mdx', ''),
      content: trimmedContent,
      frontmatter: {
        title: frontmatter.title,
        summary: frontmatter.summary,
        publishDate: frontmatter.publishDate,
        author: frontmatter.author,
        readingTime: frontmatter.readingTime,
        categories,
        mainImage: frontmatter.mainImage,
        imageAlt: frontmatter.imageAlt,
        showCTA: frontmatter.showCTA || false,
        ctaCopy: frontmatter.ctaCopy || '',
        ctaLink: frontmatter.ctaLink || '',
        relatedPosts: frontmatter.relatedPosts?.map(p => p.trim()) || [],
      },
    };
  });

  return posts.sort((a, b) => 
    new Date(b.frontmatter.publishDate).getTime() - 
    new Date(a.frontmatter.publishDate).getTime()
  );
} 