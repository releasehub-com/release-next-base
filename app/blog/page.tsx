import { getBlogPosts } from "./lib/blog";
import BlogIndex from "./components/BlogIndex";

export default async function BlogPage({
  searchParams,
}: {
  searchParams: { category?: string; page?: string; search?: string };
}) {
  const posts = await getBlogPosts();

  // Get unique categories from all posts
  const allCategories = Array.from(
    new Set(posts.flatMap((post) => post.frontmatter.categories || [])),
  ).sort();

  return (
    <BlogIndex
      searchParams={searchParams}
      posts={posts}
      categories={allCategories}
    />
  );
}
