import { getBlogPosts } from "./utils";

export default async function BlogPage({
  searchParams,
}: {
  searchParams: { category?: string };
}) {
  // Move this logic to the client component
  const posts = await getBlogPosts();
  const allCategories = Array.from(
    new Set(posts.flatMap((post) => post.frontmatter.categories || [])),
  ).sort();

  // Pass searchParams to BlogIndex
  return {
    searchParams,
    posts,
    categories: allCategories,
  };
}
