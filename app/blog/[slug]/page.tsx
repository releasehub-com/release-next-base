import { notFound } from "next/navigation";
import { Metadata } from "next";
import { allBlogPosts } from "contentlayer/generated";
import MDXContent from "../components/MDXContent";
import Header from "@/components/shared/layout/Header";
import Footer from "@/components/shared/layout/Footer";
import Image from "next/image";
import { getAuthorInfo } from "../lib/authors";

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
          <div className="mb-10 rounded-lg overflow-hidden">
            <Image
              src={post.mainImage}
              alt={post.imageAlt}
              width={1200}
              height={630}
              className="w-full"
            />
          </div>

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
          <div className="flex items-center gap-4 mb-8">
            <Image
              src={authorInfo.image}
              alt={authorInfo.name}
              width={40}
              height={40}
              className="rounded-full"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-white font-medium">
                  {authorInfo.name}
                </span>
                {authorInfo.title && (
                  <span className="text-gray-400 text-sm">
                    · {authorInfo.title}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3 text-sm">
                <span className="text-gray-400">
                  {formattedDate} · {post.readingTime} min read
                </span>
                <div className="flex gap-2">
                  {authorInfo.twitter && (
                    <a
                      href={`https://twitter.com/${authorInfo.twitter.replace("@", "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-purple-400"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                      </svg>
                    </a>
                  )}
                  {authorInfo.linkedin && (
                    <a
                      href={`https://linkedin.com/in/${authorInfo.linkedin}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-purple-400"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                      </svg>
                    </a>
                  )}
                </div>
              </div>
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
            <MDXContent code={post.body.code} />
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
