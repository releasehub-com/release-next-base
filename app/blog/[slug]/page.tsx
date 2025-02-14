import { Suspense } from "react";
import { notFound } from "next/navigation";
import BlogPostLayout from "@/app/components/BlogPostLayout";
import { getBlogPosts, getPostBySlug } from "../lib/blog";
import MDXContent from "../components/MDXContent";
import CallToAction from "@/components/blog/CallToAction";
import RelatedPosts from "@/components/blog/RelatedPosts";
import Header from "@/components/shared/layout/Header";
import Footer from "@/components/shared/layout/Footer";
import { Metadata } from "next";

// Get all blog posts at build time
export async function generateStaticParams() {
  try {
    const posts = await getBlogPosts();
    return posts.map((post) => ({
      slug: post.slug,
    }));
  } catch (error) {
    console.error("Error generating static params for blog:", error);
    return [];
  }
}

// This generates the metadata for each blog post
export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  try {
    const post = getPostBySlug(params.slug);
    const ogImage =
      post.frontmatter.ogImage ||
      post.frontmatter.mainImage ||
      "/blog/default-og-image.png";

    return {
      title: `${post.frontmatter.title} | Release Blog`,
      description: post.frontmatter.excerpt || post.frontmatter.summary,
      openGraph: {
        title: post.frontmatter.title,
        description: post.frontmatter.excerpt || post.frontmatter.summary,
        type: "article",
        url: `https://release.com/blog/${params.slug}`,
        images: [
          {
            url: ogImage,
            width: 1200,
            height: 630,
            alt: post.frontmatter.title,
          },
        ],
        siteName: "Release",
        publishedTime: post.frontmatter.publishDate,
        authors: [post.frontmatter.author],
        modifiedTime: post.frontmatter.updatedDate,
        section: post.frontmatter.categories?.[0],
      },
      twitter: {
        card: "summary_large_image",
        title: post.frontmatter.title,
        description: post.frontmatter.excerpt || post.frontmatter.summary,
        images: [ogImage],
        creator: "@releasehub",
      },
      authors: [{ name: post.frontmatter.author }],
      category: post.frontmatter.categories?.[0] || "",
      keywords: post.frontmatter.tags,
    };
  } catch (error) {
    return {
      title: "Page Not Found | Release Blog",
      description: "The requested blog post could not be found.",
    };
  }
}

async function BlogPostContent({ params }: { params: { slug: string } }) {
  try {
    const posts = await getBlogPosts();
    const post = posts.find((p) => p.slug === params.slug);

    if (!post) {
      notFound();
    }

    // Find related posts
    const relatedPosts = post.frontmatter.relatedPosts
      ? posts.filter((p) => post.frontmatter.relatedPosts.includes(p.slug))
      : [];

    return (
      <article className="max-w-4xl mx-auto px-4 py-12">
        <BlogPostLayout frontmatter={post.frontmatter}>
          {post.frontmatter.showCTA && (
            <div className="mb-12">
              <CallToAction
                copy={post.frontmatter.ctaCopy}
                link={post.frontmatter.ctaLink}
              />
            </div>
          )}
          <MDXContent source={post.content} />
          {post.frontmatter.showCTA && (
            <div className="mt-12">
              <CallToAction
                copy={post.frontmatter.ctaCopy}
                link={post.frontmatter.ctaLink}
              />
            </div>
          )}
        </BlogPostLayout>

        {relatedPosts.length > 0 && <RelatedPosts posts={relatedPosts} />}
      </article>
    );
  } catch (error) {
    console.error(`Error rendering blog post ${params.slug}:`, error);
    notFound();
  }
}

export default async function BlogPostPage({
  params,
}: {
  params: { slug: string };
}) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-900">
          <Header />
          <main className="max-w-4xl mx-auto px-4 py-12">
            <div className="animate-pulse">
              <div className="h-96 bg-gray-800 rounded-lg mb-8"></div>
              <div className="h-8 bg-gray-800 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-800 rounded w-1/2 mb-8"></div>
              <div className="space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-4 bg-gray-800 rounded w-full"></div>
                ))}
              </div>
            </div>
          </main>
          <Footer />
        </div>
      }
    >
      <>
        <Header />
        <main className="min-h-screen bg-gray-900">
          <Suspense fallback={<div>Loading...</div>}>
            <BlogPostContent params={params} />
          </Suspense>
        </main>
        <Footer />
      </>
    </Suspense>
  );
}
