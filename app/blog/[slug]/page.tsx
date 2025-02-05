import fs from "fs";
import path from "path";
import BlogPostLayout from "@/components/BlogPostLayout";
import { getBlogPosts, getPostBySlug } from "../lib/blog";
import MDXContent from "../components/MDXContent";
import CallToAction from "@/components/blog/CallToAction";
import RelatedPosts from "@/components/blog/RelatedPosts";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { notFound } from "next/navigation";
import { Metadata } from "next";

// Get all blog posts at build time
export async function generateStaticParams() {
  const postsDirectory = path.join(process.cwd(), "app/blog/posts");
  const filenames = fs.readdirSync(postsDirectory);

  return filenames.map((filename) => ({
    slug: filename.replace(".mdx", ""),
  }));
}

// This generates the metadata for each blog post
export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
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
}

export default async function BlogPostPage({
  params,
}: {
  params: { slug: string };
}) {
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
    <>
      <Header />
      <main className="min-h-screen bg-gray-900">
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
      </main>
      <Footer />
    </>
  );
}
