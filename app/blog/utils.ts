import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { BlogPost } from './types';

export async function getBlogPosts(): Promise<BlogPost[]> {
  const postsDirectory = path.join(process.cwd(), 'app/blog/posts');
  const filenames = fs.readdirSync(postsDirectory);
  
  const posts = filenames.map((filename) => {
    const filePath = path.join(postsDirectory, filename);
    const fileContent = fs.readFileSync(filePath, 'utf8');
    
    // Use gray-matter to parse the post metadata section and content
    const { data: frontmatter, content } = matter(fileContent);

    return {
      slug: filename.replace('.mdx', ''),
      content,
      frontmatter: {
        title: frontmatter.title,
        summary: frontmatter.summary,
        publishDate: frontmatter.publishDate,
        author: frontmatter.author,
        readingTime: frontmatter.readingTime,
        categories: frontmatter.categories || [],
        mainImage: frontmatter.mainImage,
        imageAlt: frontmatter.imageAlt,
        showCTA: frontmatter.showCTA || false,
        ctaCopy: frontmatter.ctaCopy || '',
        ctaLink: frontmatter.ctaLink || '',
        bodyTop: frontmatter.bodyTop || '',
        bodyBottom: frontmatter.bodyBottom || '',
        relatedPosts: frontmatter.relatedPosts || [],
      },
    };
  });

  // Sort posts by date
  return posts.sort((a, b) => 
    new Date(b.frontmatter.publishDate).getTime() - 
    new Date(a.frontmatter.publishDate).getTime()
  );
} 