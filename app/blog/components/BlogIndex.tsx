"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { BlogPost } from "../types";
import { getAuthorInfo } from "../lib/authors";
import { blogConfig } from "../config";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface BlogIndexProps {
  posts: BlogPost[];
  categories: string[];
  searchParams: { category?: string };
}

const POSTS_PER_PAGE = 9;

export default function BlogIndex({
  posts,
  categories,
  searchParams,
}: BlogIndexProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.category || "",
  );
  const [currentPage, setCurrentPage] = useState(1);

  // Get featured post
  const featuredPost = posts.find(
    (post) => post.slug === blogConfig.featuredPost,
  );

  // Filter posts excluding the featured post
  const filteredPosts = useMemo(() => {
    return posts
      .filter((post) => post.slug !== blogConfig.featuredPost)
      .filter((post) => {
        const matchesSearch =
          post.frontmatter.title
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          post.frontmatter.summary
            .toLowerCase()
            .includes(searchTerm.toLowerCase());

        const matchesCategory =
          !selectedCategory ||
          (post.frontmatter.categories &&
            post.frontmatter.categories.includes(selectedCategory));

        return matchesSearch && matchesCategory;
      });
  }, [posts, searchTerm, selectedCategory]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
  const paginatedPosts = filteredPosts.slice(
    (currentPage - 1) * POSTS_PER_PAGE,
    currentPage * POSTS_PER_PAGE,
  );

  // Reset to first page when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory]);

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-white mb-12">
            Latest Articles
          </h1>

          {/* Featured Post - Always visible */}
          {featuredPost && (
            <div className="mb-12">
              <Link href={`/blog/${featuredPost.slug}`}>
                <div className="group relative rounded-2xl overflow-hidden bg-gray-800 flex flex-col md:flex-row">
                  {/* Left side - Image */}
                  <div className="relative w-full md:w-1/2 aspect-[16/9] md:aspect-auto">
                    {featuredPost.frontmatter.mainImage && (
                      <Image
                        src={featuredPost.frontmatter.mainImage}
                        alt={
                          featuredPost.frontmatter.imageAlt ||
                          featuredPost.frontmatter.title
                        }
                        fill
                        className="object-cover"
                        unoptimized={featuredPost.frontmatter.mainImage.endsWith('.svg')}
                      />
                    )}
                  </div>

                  {/* Right side - Content */}
                  <div className="relative w-full md:w-1/2 p-6 md:p-8 flex flex-col justify-between">
                    {/* Categories */}
                    <div className="flex gap-2 mb-4">
                      {featuredPost.frontmatter.categories?.map((category) => (
                        <span
                          key={category}
                          className="text-purple-400 text-sm font-medium"
                        >
                          {category}
                        </span>
                      ))}
                    </div>

                    {/* Title and Summary */}
                    <div>
                      <h2 className="text-2xl sm:text-3xl font-bold text-white group-hover:text-purple-400 transition-colors mb-4">
                        {featuredPost.frontmatter.title}
                      </h2>
                      <p className="text-gray-300 line-clamp-2 mb-6">
                        {featuredPost.frontmatter.summary}
                      </p>
                    </div>

                    {/* Author and Meta */}
                    <div className="flex items-center gap-3">
                      <div className="relative w-10 h-10">
                        <Image
                          src={
                            getAuthorInfo(featuredPost.frontmatter.author).image
                          }
                          alt={
                            getAuthorInfo(featuredPost.frontmatter.author).name
                          }
                          fill
                          className="rounded-full object-cover"
                          unoptimized={getAuthorInfo(featuredPost.frontmatter.author).image.endsWith('.svg')}
                          priority
                        />
                      </div>
                      <div>
                        <div className="text-sm leading-6 text-gray-300">
                          {getAuthorInfo(featuredPost.frontmatter.author).name}
                        </div>
                        <div className="text-sm leading-6 text-gray-400">
                          {new Date(
                            featuredPost.frontmatter.publishDate,
                          ).toLocaleDateString()}
                          {" · "}
                          {featuredPost.frontmatter.readingTime} min read
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          )}

          {/* Search Bar */}
          <div className="mb-8">
            <input
              type="text"
              placeholder="Search posts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-4 rounded-full border border-gray-700 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-purple-600"
            />
          </div>

          {/* Category Filters as Pills */}
          <div className="mb-8 flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory("")}
              className={`px-6 py-2 rounded-full transition-colors ${
                !selectedCategory
                  ? "bg-purple-600 text-white"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700"
              }`}
            >
              All
            </button>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2 rounded-full transition-colors ${
                  selectedCategory === category
                    ? "bg-purple-600 text-white"
                    : "bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Blog Posts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {paginatedPosts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group"
              >
                <article className="bg-gray-800 rounded-lg overflow-hidden hover:bg-gray-750 transition-colors h-full">
                  {post.frontmatter.mainImage && (
                    <div className="relative h-48">
                      <Image
                        src={post.frontmatter.mainImage}
                        alt={
                          post.frontmatter.imageAlt || post.frontmatter.title
                        }
                        fill
                        className="object-cover"
                        unoptimized={post.frontmatter.mainImage.endsWith('.svg')}
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <h2 className="text-xl font-bold text-white group-hover:text-purple-400 transition-colors mb-2">
                      {post.frontmatter.title}
                    </h2>
                    <p className="text-gray-400 mb-4 line-clamp-2">
                      {post.frontmatter.summary}
                    </p>
                    <div className="flex items-center">
                      <Image
                        src={getAuthorInfo(post.frontmatter.author).image}
                        alt={getAuthorInfo(post.frontmatter.author).name}
                        width={32}
                        height={32}
                        className="rounded-full"
                        unoptimized={getAuthorInfo(post.frontmatter.author).image.endsWith('.svg')}
                      />
                      <div className="ml-3">
                        <p className="text-white text-sm">
                          {getAuthorInfo(post.frontmatter.author).name}
                        </p>
                        <p className="text-gray-500 text-sm">
                          {new Date(
                            post.frontmatter.publishDate,
                          ).toLocaleDateString()}
                          {" · "}
                          {post.frontmatter.readingTime} min read
                        </p>
                      </div>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-12 flex justify-center gap-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded-lg ${
                  currentPage === 1
                    ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                    : "bg-gray-800 text-white hover:bg-gray-700"
                }`}
              >
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-4 py-2 rounded-lg ${
                      currentPage === page
                        ? "bg-purple-600 text-white"
                        : "bg-gray-800 text-white hover:bg-gray-700"
                    }`}
                  >
                    {page}
                  </button>
                ),
              )}
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className={`px-4 py-2 rounded-lg ${
                  currentPage === totalPages
                    ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                    : "bg-gray-800 text-white hover:bg-gray-700"
                }`}
              >
                Next
              </button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
