"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { blogConfig } from "../config";
import { BlogPost } from "../types";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getAuthorInfo } from "@/app/blog/lib/authors";

const POSTS_PER_PAGE = 15;

interface BlogIndexProps {
  searchParams: {
    category?: string;
    page?: string;
    search?: string;
  };
  posts: BlogPost[];
  categories: string[];
}

export default function BlogIndex({
  searchParams,
  posts,
  categories,
}: BlogIndexProps) {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState(searchParams.search || "");

  // Update the selectedCategory logic to handle both AI%2FML and ai
  const getSelectedCategory = (category?: string) => {
    if (!category) return "All";
    // Decode the URL parameter and handle both cases
    const decodedCategory = decodeURIComponent(category.toLowerCase());
    if (decodedCategory === "ai/ml" || decodedCategory === "ai") {
      return "ai";
    }
    return category;
  };

  const selectedCategory = getSelectedCategory(searchParams.category);

  // Local state for search input
  const [searchInput, setSearchInput] = useState(searchQuery);

  // Update search input when URL changes
  useEffect(() => {
    setSearchInput(searchQuery);
  }, [searchQuery]);

  const featuredPost = posts.find(
    (post) => post.slug === blogConfig.featuredPost,
  );

  // Filter posts by search query and category
  const filteredPosts = posts.filter((post) => {
    const matchesSearch = searchQuery
      ? post.frontmatter.title
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        post.frontmatter.summary
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      : true;

    // Only filter by category if not "All"
    const matchesCategory =
      selectedCategory === "All"
        ? true
        : post.frontmatter.categories?.some(
            (cat) => cat.toLowerCase() === selectedCategory.toLowerCase(),
          );

    return matchesSearch && matchesCategory;
  });

  // Get regular posts (excluding featured post)
  const allRegularPosts = filteredPosts.filter(
    (post) => post.slug !== blogConfig.featuredPost,
  );

  // Calculate pagination
  const totalPosts = allRegularPosts.length;
  const totalPages = Math.ceil(totalPosts / POSTS_PER_PAGE);
  const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
  const endIndex = startIndex + POSTS_PER_PAGE;
  const regularPosts = allRegularPosts.slice(startIndex, endIndex);

  const handleSearch = (query: string) => {
    setSearchInput(query);
    const params = new URLSearchParams(searchParams);
    if (query) {
      params.set("search", query);
      params.delete("page"); // Reset to first page on new search
    } else {
      params.delete("search");
    }
    router.push(`/blog?${params.toString()}`, { scroll: false });
  };

  // Update handleCategoryChange to properly encode AI category
  const handleCategoryChange = (category: string) => {
    if (category === "All") {
      router.push("/blog", { scroll: false });
    } else {
      // Special handling for AI category
      const encodedCategory =
        category.toLowerCase() === "ai" ? "AI%2FML" : category.toLowerCase();
      router.push(`/blog?category=${encodedCategory}`, { scroll: false });
    }
  };

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", page.toString());
    router.push(`/blog?${params.toString()}`, { scroll: false });
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
          {/* Selected Category Pill - only show if not "All" */}
          {selectedCategory !== "All" && (
            <div className="mb-4">
              <span className="px-4 py-2 text-sm bg-purple-600 text-white rounded-full">
                {selectedCategory}
              </span>
            </div>
          )}

          <h1 className="text-3xl font-bold text-white mb-8">
            Latest Articles
          </h1>

          {/* Featured Post - always show */}
          {featuredPost && (
            <Link
              href={`/blog/${featuredPost.slug}`}
              className="group block mb-16"
            >
              <article className="bg-gray-800 rounded-lg overflow-hidden hover:bg-gray-750 transition-colors">
                <div className="grid md:grid-cols-2 gap-6">
                  {featuredPost.frontmatter.mainImage && (
                    <div className="relative h-72 md:h-full min-h-[300px] overflow-hidden">
                      <Image
                        src={featuredPost.frontmatter.mainImage}
                        alt={featuredPost.frontmatter.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="p-8 flex flex-col justify-center">
                    {featuredPost.frontmatter.categories?.length > 0 && (
                      <div className="flex gap-2 mb-4">
                        {featuredPost.frontmatter.categories.map((category) => (
                          <span
                            key={category}
                            className="text-xs text-purple-400 font-medium"
                          >
                            {category}
                          </span>
                        ))}
                      </div>
                    )}
                    <h2 className="text-2xl md:text-3xl font-bold mb-4 text-white group-hover:text-purple-400 transition-colors">
                      {featuredPost.frontmatter.title}
                    </h2>
                    <p className="text-gray-400 text-base mb-6">
                      {featuredPost.frontmatter.summary}
                    </p>
                    <div className="flex items-center gap-2">
                      <Image
                        src={
                          getAuthorInfo(featuredPost.frontmatter.author).image
                        }
                        alt={
                          getAuthorInfo(featuredPost.frontmatter.author).name
                        }
                        width={24}
                        height={24}
                        className="rounded-full"
                      />
                      <div className="flex items-center text-sm text-gray-400">
                        <span className="capitalize">
                          {getAuthorInfo(featuredPost.frontmatter.author).name}
                        </span>
                        <span className="mx-2">•</span>
                        <span>
                          {new Date(
                            featuredPost.frontmatter.publishDate,
                          ).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                        <span className="mx-2">•</span>
                        <span>{featuredPost.frontmatter.readingTime} min</span>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            </Link>
          )}

          <div className="mb-12 space-y-8">
            {/* Search Bar */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchInput}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Search articles..."
                className="block w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg 
                         text-white placeholder-gray-400 focus:outline-none focus:ring-2 
                         focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            {/* Category Pills - with All Articles */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleCategoryChange("All")}
                className={`px-4 py-2 rounded-full text-sm ${
                  selectedCategory === "All"
                    ? "bg-purple-600 text-white"
                    : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                }`}
              >
                All Articles
              </button>
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => handleCategoryChange(category)}
                  className={`px-4 py-2 rounded-full text-sm ${
                    selectedCategory === category
                      ? "bg-purple-600 text-white"
                      : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Search Results Count */}
            {searchQuery && (
              <div className="text-gray-400">
                Found {totalPosts} {totalPosts === 1 ? "result" : "results"}
                for "{searchQuery}"
                {selectedCategory && ` in ${selectedCategory}`}
              </div>
            )}
          </div>

          {/* Regular Posts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {regularPosts.map((post) => {
              const authorInfo = getAuthorInfo(post.frontmatter.author);

              return (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group"
                >
                  <article className="bg-gray-800 rounded-lg overflow-hidden hover:bg-gray-750 transition-colors">
                    {post.frontmatter.mainImage && (
                      <div className="relative h-48 overflow-hidden">
                        <Image
                          src={post.frontmatter.mainImage}
                          alt={post.frontmatter.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div className="p-6">
                      {post.frontmatter.categories?.length > 0 && (
                        <div className="flex gap-2 mb-4">
                          {post.frontmatter.categories.map((category) => (
                            <span
                              key={category}
                              className="text-xs text-purple-400 font-medium"
                            >
                              {category}
                            </span>
                          ))}
                        </div>
                      )}
                      <h2 className="text-xl font-bold mb-3 text-white group-hover:text-purple-400 transition-colors">
                        {post.frontmatter.title}
                      </h2>
                      <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                        {post.frontmatter.summary}
                      </p>
                      <div className="flex items-center gap-2 mt-4 text-sm text-gray-400">
                        <Image
                          src={authorInfo.image}
                          alt={authorInfo.name}
                          width={24}
                          height={24}
                          className="rounded-full"
                        />
                        <span>{authorInfo.name}</span>
                        <span>•</span>
                        <time dateTime={post.frontmatter.publishDate}>
                          {new Date(
                            post.frontmatter.publishDate,
                          ).toLocaleDateString()}
                        </time>
                      </div>
                    </div>
                  </article>
                </Link>
              );
            })}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-12 flex justify-center gap-2">
              {currentPage > 1 && (
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Previous
                </button>
              )}

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      currentPage === page
                        ? "bg-purple-600 text-white"
                        : "bg-gray-800 text-white hover:bg-gray-700"
                    }`}
                  >
                    {page}
                  </button>
                ),
              )}

              {currentPage < totalPages && (
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Next
                </button>
              )}
            </div>
          )}

          {/* No posts message */}
          {regularPosts.length === 0 && (
            <div className="text-center text-gray-400 py-12">
              <p>
                No articles found
                {searchQuery && ` matching "${searchQuery}"`}
                {selectedCategory && ` in ${selectedCategory}`}
              </p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
