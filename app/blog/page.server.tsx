import BlogIndex from './page';
import { getBlogPosts } from './utils';

export default async function BlogPage({
  searchParams,
}: {
  searchParams: { category?: string };
}) {
  const posts = await getBlogPosts();
  
  // Get unique categories from all posts
  const allCategories = Array.from(new Set(
    posts.flatMap(post => post.frontmatter.categories || [])
  )).sort();

  return (
    <BlogIndex 
      initialPosts={posts} 
      initialCategories={allCategories}
    />
  );
} 