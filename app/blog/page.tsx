import type { Metadata } from "next";
import { getBlogPosts } from "./lib/blog";
import BlogIndex from "./components/BlogIndex";
import { Suspense } from "react";
import Header from "@/components/shared/layout/Header";
import Footer from "@/components/shared/layout/Footer";
import { metadata } from "./metadata";

export { metadata };

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
    <>
      <Header />
      <main className="min-h-screen bg-gray-900">
        <Suspense
          fallback={
            <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
              <div className="animate-pulse">
                <div className="h-12 bg-gray-800 rounded w-1/3 mb-12"></div>
                <div className="h-96 bg-gray-800 rounded mb-8"></div>
                <div className="h-12 bg-gray-800 rounded mb-8"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-gray-800 rounded-lg h-80"></div>
                  ))}
                </div>
              </div>
            </div>
          }
        >
          <BlogIndex
            searchParams={searchParams}
            posts={posts}
            categories={allCategories}
          />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
