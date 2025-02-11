import Image from "next/image";
import { getAuthorInfo } from "@/app/blog/lib/authors";

interface BlogPostLayoutProps {
  children: React.ReactNode;
  frontmatter: {
    title: string;
    summary: string;
    publishDate: string;
    author: string;
    readingTime: number;
    categories?: string[];
    mainImage?: string;
    imageAlt?: string;
  };
}

export default function BlogPostLayout({
  children,
  frontmatter,
}: BlogPostLayoutProps) {
  const authorInfo = getAuthorInfo(frontmatter.author);

  return (
    <>
      <header className="mb-8">
        {frontmatter.mainImage && (
          <div className="relative w-full h-96 mb-8">
            <Image
              src={frontmatter.mainImage}
              alt={frontmatter.imageAlt || frontmatter.title}
              fill
              className="object-cover rounded-lg"
              unoptimized={frontmatter.mainImage.endsWith(".svg")}
              priority
            />
          </div>
        )}
        <div className="space-y-4">
          {frontmatter.categories && frontmatter.categories.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {frontmatter.categories.map((category) => (
                <span
                  key={category}
                  className="px-3 py-1 text-sm bg-gray-800 text-gray-300 rounded-full"
                >
                  {category}
                </span>
              ))}
            </div>
          )}
          <h1 className="text-4xl font-bold tracking-tight text-white mb-4">
            {frontmatter.title}
          </h1>
          <p className="text-xl text-gray-400 mb-6">{frontmatter.summary}</p>
          <div className="flex items-center space-x-4 text-gray-400">
            <div className="flex items-center">
              <Image
                src={authorInfo.image}
                alt={authorInfo.name}
                width={48}
                height={48}
                className="rounded-full"
                unoptimized={authorInfo.image.endsWith(".svg")}
              />
              <span className="ml-2">{authorInfo.name}</span>
            </div>
            <span>•</span>
            <time dateTime={frontmatter.publishDate}>
              {new Date(frontmatter.publishDate).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>
            <span>•</span>
            <span>{frontmatter.readingTime} min read</span>
          </div>
        </div>
      </header>

      <article className="prose prose-invert max-w-none prose-ul:pl-5 prose-ol:pl-5 prose-li:pl-0 prose-li:my-0 prose-li:marker:text-gray-400">
        {children}
      </article>
    </>
  );
}
