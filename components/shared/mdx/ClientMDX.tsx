"use client";

import { serialize } from "next-mdx-remote/serialize";
import { MDXRemote, type MDXRemoteSerializeResult } from "next-mdx-remote";
import { useEffect, useState } from "react";
import type { ComponentProps } from "react";

const components = {
  h1: (props: ComponentProps<"h1">) => (
    <h1 className="text-4xl font-bold mb-8 text-white" {...props} />
  ),
  h2: (props: ComponentProps<"h2">) => (
    <h2 className="text-3xl font-bold mt-12 mb-6 text-white" {...props} />
  ),
  h3: (props: ComponentProps<"h3">) => (
    <h3 className="text-2xl font-semibold mt-8 mb-4 text-white" {...props} />
  ),
  p: (props: ComponentProps<"p">) => (
    <p className="text-gray-300 mb-4 leading-relaxed" {...props} />
  ),
  ul: (props: ComponentProps<"ul">) => (
    <ul className="list-disc pl-6 mb-4 text-gray-300" {...props} />
  ),
  ol: (props: ComponentProps<"ol">) => (
    <ol className="list-decimal pl-8 mb-4 text-gray-300" {...props} />
  ),
  li: (props: ComponentProps<"li">) => (
    <li
      className="mb-8 [&>p]:inline-block [&>ul]:block [&>ul]:mt-4"
      {...props}
    />
  ),
  strong: (props: ComponentProps<"strong">) => (
    <strong className="font-semibold text-white" {...props} />
  ),
  em: (props: ComponentProps<"em">) => (
    <em className="italic text-gray-300" {...props} />
  ),
  a: (props: ComponentProps<"a">) => (
    <a className="text-[#00bb93] hover:underline" {...props} />
  ),
  blockquote: (props: ComponentProps<"blockquote">) => (
    <blockquote
      className="border-l-4 border-[#00bb93] pl-4 my-4 text-gray-300 italic"
      {...props}
    />
  ),
};

interface ClientMDXProps {
  source: string;
}

export default function ClientMDX({ source }: ClientMDXProps) {
  const [mdxSource, setMdxSource] = useState<MDXRemoteSerializeResult | null>(
    null,
  );

  useEffect(() => {
    serialize(source, {
      parseFrontmatter: true,
    }).then(setMdxSource);
  }, [source]);

  if (!mdxSource) return null;

  return (
    <div className="prose prose-invert max-w-none">
      <MDXRemote {...mdxSource} components={components} />
    </div>
  );
}
