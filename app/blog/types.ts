export interface BlogPost {
  slug: string;
  content: string;
  frontmatter: {
    title: string;
    summary: string;
    publishDate: string;
    author: string;
    readingTime: number;
    categories: string[];
    mainImage: string;
    imageAlt: string;
    showCTA: boolean;
    ctaCopy: string;
    ctaLink: string;
    bodyTop: string;
    bodyBottom: string;
    relatedPosts: string[];
    ogImage?: string;
    excerpt?: string;
    tags?: string[];
    updatedDate?: string;
  };
}
