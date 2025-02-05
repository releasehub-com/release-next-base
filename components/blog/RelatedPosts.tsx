import Link from "next/link";
import Image from "next/image";
import { BlogPost } from "@/app/blog/types";

export default function RelatedPosts({ posts }: { posts: BlogPost[] }) {
  return (
    <div className="mt-16 pt-8 border-t border-gray-800">
      <h2 className="text-2xl font-bold text-white mb-8">
        You might also like
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {posts.map((post) => (
          <Link key={post.slug} href={`/blog/${post.slug}`} className="group">
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
                <h3 className="text-lg font-bold text-white group-hover:text-purple-400 transition-colors">
                  {post.frontmatter.title}
                </h3>
                <p className="text-gray-400 text-sm mt-2 line-clamp-2">
                  {post.frontmatter.summary}
                </p>
              </div>
            </article>
          </Link>
        ))}
      </div>
    </div>
  );
}
