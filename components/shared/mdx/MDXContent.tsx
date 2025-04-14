"use client";

import { MDXRemote } from "next-mdx-remote/rsc";
import React, { ReactElement } from "react";
import type { ComponentProps, ComponentType } from "react";

type MDXComponentProps =
  | ComponentProps<"div">
  | ComponentProps<"span">
  | ComponentProps<"p">
  | ComponentProps<"h1">
  | ComponentProps<"h2">
  | ComponentProps<"h3">
  | ComponentProps<"ul">
  | ComponentProps<"ol">
  | ComponentProps<"li">
  | ComponentProps<"strong">
  | ComponentProps<"em">
  | ComponentProps<"a">
  | ComponentProps<"blockquote">
  | ComponentProps<"pre">
  | ComponentProps<"code">;

// Import the CodeBlock component
const CodeBlock = React.lazy(() => import("@/app/blog/components/CodeBlock"));

interface MDXContentProps {
  source: string;
  components?: Record<string, ComponentType<MDXComponentProps>>;
}

// Default components with our styling
const defaultComponents = {
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
    <ol
      className="list-none pl-8 mb-4 text-gray-300 space-y-8 relative [counter-reset:section]"
      {...props}
    />
  ),
  li: (props: ComponentProps<"li">) => (
    <li
      className="relative pl-2 [counter-increment:section] before:content-[counter(section)'.'] before:absolute before:-left-8 before:text-gray-300"
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
  pre: (props: ComponentProps<"pre">) => (
    <pre
      className="bg-gray-900 rounded-lg p-4 mb-4 overflow-x-auto"
      {...props}
    />
  ),
  code: (props: ComponentProps<"code">) => {
    // Check if this is an inline code block or a code block inside a pre tag
    const isInlineCode = !React.Children.toArray(props.children).some(
      (child) => typeof child === "string" && child.includes("\n")
    );

    if (isInlineCode) {
      return (
        <code className="bg-gray-800 px-1 py-0.5 rounded text-sm" {...props} />
      );
    }

    // This is a code block, use the CodeBlock component for syntax highlighting
    return (
      <React.Suspense fallback={<code {...props} />}>
        <CodeBlock {...props} />
      </React.Suspense>
    );
  },
};

export default function MDXContent({
  source,
  components = {},
}: MDXContentProps) {
  // Merge default components with any custom components passed in
  const mergedComponents = { ...defaultComponents, ...components };

  return (
    <div className="prose prose-invert max-w-none">
      <MDXRemote source={source} components={mergedComponents} />
    </div>
  );
}
