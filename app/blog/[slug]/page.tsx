import { notFound } from "next/navigation";
import { Metadata } from "next";
import { allBlogPosts } from "contentlayer/generated";
import MDXContent from "../components/MDXContent";
import Header from "@/components/shared/layout/Header";
import Footer from "@/components/shared/layout/Footer";
import Image from "next/image";
import { getAuthorInfo } from "../lib/authors";
import { Suspense } from "react";

interface Props {
  params: {
    slug: string;
  };
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export async function generateStaticParams() {
  return allBlogPosts.map((post) => ({ slug: post.computedSlug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = allBlogPosts.find((post) => post.computedSlug === params.slug);

  if (!post) {
    return {};
  }

  return {
    title: post.title,
    description: post.summary,
    openGraph: {
      title: post.title,
      description: post.summary,
      type: "article",
      images: [
        {
          url: post.mainImage,
          width: 1200,
          height: 630,
          alt: post.imageAlt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.summary,
      images: [post.mainImage],
    },
  };
}

export default function BlogPostPage({ params }: Props) {
  const post = allBlogPosts.find((post) => post.computedSlug === params.slug);
  if (!post) notFound();

  const authorId = post.author.toLowerCase().replace(/\s+/g, "-");
  const authorInfo = getAuthorInfo(authorId);
  const formattedDate = formatDate(post.publishDate);

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-950">
        <article className="mx-auto max-w-4xl px-6 py-10">
          {/* Main Image */}
          <Suspense fallback={<div className="w-full aspect-[16/9] bg-gray-800 rounded-lg" />}>
            {post.mainImage && (
              <div className="mb-10 rounded-lg overflow-hidden">
                <Image
                  src={post.mainImage}
                  alt={post.imageAlt}
                  width={1200}
                  height={630}
                  className="w-full"
                  priority={true}
                />
              </div>
            )}
          </Suspense>

          {/* Categories */}
          <div className="flex gap-2 mb-6">
            {post.categories.map((category) => (
              <span
                key={category}
                className="px-3 py-1 text-sm bg-gray-800 text-gray-300 rounded-full"
              >
                {category}
              </span>
            ))}
          </div>

          {/* Title */}
          <h1 className="text-4xl font-bold text-white mb-6">{post.title}</h1>

          {/* Author info */}
          <div className="flex items-center mb-8">
            <Suspense fallback={<div className="w-10 h-10 bg-gray-800 rounded-full" />}>
              <Image
                src={authorInfo.image}
                alt={authorInfo.name}
                width={40}
                height={40}
                className="rounded-full"
                priority={true}
              />
            </Suspense>
            <div className="ml-3">
              <p className="text-white">{authorInfo.name}</p>
              <p className="text-gray-400">
                {formattedDate} · {post.readingTime} min read
              </p>
            </div>
          </div>

          {/* CTA Banner */}
          {post.showCTA && (
            <div className="bg-gray-900 rounded-lg p-6 mb-10">
              <p className="text-gray-300 mb-4">
                {post.ctaCopy ||
                  "Enhance your secrets management with Release's ephemeral environments for secure, synchronized deployments. Streamline workflows and ensure reliable secret handling."}
              </p>
              <a
                href={post.ctaLink || "/signup"}
                className="inline-block bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg transition-colors"
              >
                {post.ctaButton || "Try Release for Free"}
              </a>
            </div>
          )}

          {/* Content */}
          <div className="prose prose-invert max-w-none">
            <Suspense fallback={<div>Loading content...</div>}>
              <MDXContent code={post.body.code} />
            </Suspense>
          </div>

          {/* Bottom CTA */}
          {post.showCTA && (
            <div className="bg-gray-900 rounded-lg p-6 mt-10">
              <p className="text-gray-300 mb-4">
                {post.ctaCopy ||
                  "Ready to get started? Try Release today and experience secure, efficient environment management."}
              </p>
              <a
                href={post.ctaLink || "/signup"}
                className="inline-block bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg transition-colors"
              >
                {post.ctaButton || "Try Release for Free"}
              </a>
            </div>
          )}
        </article>
      </main>
      <Footer />
    </>
  );
}
