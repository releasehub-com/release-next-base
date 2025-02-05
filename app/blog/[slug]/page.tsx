import fs from 'fs';
import path from 'path';
import BlogPostLayout from '@/components/BlogPostLayout';
import { getBlogPosts } from '../lib/blog';
import MDXContent from '../components/MDXContent';
import CallToAction from '@/components/blog/CallToAction';
import RelatedPosts from '@/components/blog/RelatedPosts';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { notFound } from 'next/navigation';

// Get all blog posts at build time
export async function generateStaticParams() {
  const postsDirectory = path.join(process.cwd(), 'app/blog/posts');
  const filenames = fs.readdirSync(postsDirectory);
  
  return filenames.map((filename) => ({
    slug: filename.replace('.mdx', ''),
  }));
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const posts = await getBlogPosts();
  const post = posts.find(p => p.slug === params.slug);
  
  if (!post) {
    notFound();
  }

  // Find related posts
  const relatedPosts = post.frontmatter.relatedPosts
    ? posts.filter(p => post.frontmatter.relatedPosts.includes(p.slug))
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

          {relatedPosts.length > 0 && (
            <RelatedPosts posts={relatedPosts} />
          )}
        </article>
      </main>
      <Footer />
    </>
  );
} 