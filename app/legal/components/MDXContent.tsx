import { MDXRemote } from "next-mdx-remote/rsc";
import type { ComponentProps } from "react";
import Image from "next/image";

const components = {
  h1: (props: ComponentProps<"h1">) => (
    <h1 className="text-5xl font-bold mb-12 text-white" {...props} />
  ),
  h2: (props: ComponentProps<"h2">) => (
    <h2
      className="text-3xl font-bold mt-16 mb-8 text-white border-b border-gray-800 pb-4"
      {...props}
    />
  ),
  h3: (props: ComponentProps<"h3">) => (
    <h3 className="text-2xl font-semibold mt-12 mb-6 text-white" {...props} />
  ),
  p: (props: ComponentProps<"p">) => (
    <p className="text-gray-300 mb-6 leading-relaxed text-lg" {...props} />
  ),
  ul: (props: ComponentProps<"ul">) => (
    <ul className="list-disc pl-8 mb-6 text-gray-300 space-y-2" {...props} />
  ),
  ol: (props: ComponentProps<"ol">) => (
    <ol className="list-decimal pl-8 mb-6 text-gray-300 space-y-2" {...props} />
  ),
  li: (props: ComponentProps<"li">) => (
    <li className="mb-2 text-lg" {...props} />
  ),
  strong: (props: ComponentProps<"strong">) => (
    <strong className="font-semibold text-white" {...props} />
  ),
  em: (props: ComponentProps<"em">) => (
    <em className="italic text-gray-300" {...props} />
  ),
  a: (props: ComponentProps<"a">) => (
    <a
      className="text-[#00bb93] hover:text-[#00bb93]/80 underline transition-colors"
      target={props.href?.startsWith("http") ? "_blank" : undefined}
      rel={props.href?.startsWith("http") ? "noopener noreferrer" : undefined}
      {...props}
    />
  ),
  blockquote: (props: ComponentProps<"blockquote">) => (
    <blockquote
      className="border-l-4 border-[#00bb93] pl-6 my-6 text-gray-300 italic"
      {...props}
    />
  ),
  // Add support for custom components like certification badges
  CertificationBadge: () => (
    <div className="bg-gray-800/50 rounded-lg p-8 my-12">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-8">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-white mb-4">
              Release is SOC 2 Type 2 Certified
            </h2>
            <p className="text-gray-300 text-lg">
              Our commitment to security is validated through rigorous
              third-party audits and compliance certifications.
            </p>
          </div>
          <div className="flex-shrink-0">
            <Image
              src="/images/vanta-badge.png"
              alt="Vanta Compliance SOC 2 logo"
              width={100}
              height={50}
              className="dark:filter dark:brightness-0 dark:invert"
            />
          </div>
        </div>
      </div>
    </div>
  ),
};

export default function MDXContent({ source }: { source: string }) {
  return (
    <div className="prose prose-invert max-w-none">
      <div className="max-w-4xl mx-auto">
        <MDXRemote source={source} components={components} />
      </div>
    </div>
  );
}
