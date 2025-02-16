import { BlogPost } from "contentlayer/generated";

export type { BlogPost };

export interface BlogPostMetadata {
  title: string;
  summary: string;
  publishDate: string;
  author: string;
  readingTime: number;
  categories: string[];
  mainImage: string;
  imageAlt: string;
  showCTA: boolean;
  ctaCopy?: string;
  ctaLink?: string;
  relatedPosts: string[];
  ogImage: string;
  excerpt: string;
  tags: string[];
  ctaButton?: string;
}

export interface BlogPostProps {
  post: BlogPost;
}
