import Image from 'next/image';

interface BlogPostLayoutProps {
  children: React.ReactNode;
  frontmatter: {
    title: string;
    summary: string;
    publishDate: string;
    author: string;
    readingTime: number;
    categories: string[];
    mainImage: string;
    imageAlt: string;
  };
}

export default function BlogPostLayout({ children, frontmatter }: BlogPostLayoutProps) {
  return (
    <>
      {frontmatter.mainImage && (
        <div className="relative w-full h-96 mb-8">
          <Image
            src={frontmatter.mainImage}
            alt={frontmatter.imageAlt || frontmatter.title}
            fill
            className="object-cover rounded-lg"
          />
        </div>
      )}
      
      <header className="mb-8">
        <div className="flex gap-2 mb-4">
          {frontmatter.categories?.map((category) => (
            <span key={category} className="text-sm text-purple-400">
              {category}
            </span>
          ))}
        </div>
        <h1 className="text-4xl font-bold text-white mb-4">{frontmatter.title}</h1>
        <p className="text-xl text-gray-400 mb-6">{frontmatter.summary}</p>
        <div className="flex items-center gap-4 text-sm text-gray-400">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gray-700" />
            <span className="capitalize">{frontmatter.author.replace(/-/g, ' ')}</span>
          </div>
          <span>•</span>
          <time dateTime={frontmatter.publishDate}>
            {new Date(frontmatter.publishDate).toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric'
            })}
          </time>
          <span>•</span>
          <span>{frontmatter.readingTime} min read</span>
        </div>
      </header>

      {children}
    </>
  );
} 