"use client";

import { useMDXComponent } from "next-contentlayer/hooks";
import Image from "next/image";
import CallToAction from "@/components/blog/CallToAction";
import React from "react";
import type { ComponentProps, HTMLAttributes } from "react";
import CodeBlock from "./CodeBlock";

interface MDXContentProps {
  code: string;
}

const components = {
  img: ({ src, alt, ...props }: ComponentProps<"img">) => {
    if (!src) return null;

    // Wrap in a div that's styled as a block element to prevent nesting in p tags
    return (
      <span className="block relative w-full aspect-[16/9] my-8">
        <Image
          src={src}
          alt={alt || ""}
          fill
          className="object-contain rounded-lg"
          unoptimized={src.endsWith(".svg")}
          priority={true}
        />
      </span>
    );
  },
  h1: (props: HTMLAttributes<HTMLHeadingElement>) => (
    <h1 className="text-3xl font-bold text-white mt-12 mb-6" {...props} />
  ),
  h2: (props: HTMLAttributes<HTMLHeadingElement>) => (
    <h2 className="text-2xl font-bold text-white mt-10 mb-4" {...props} />
  ),
  h3: (props: HTMLAttributes<HTMLHeadingElement>) => (
    <h3 className="text-xl font-bold text-white mt-8 mb-3" {...props} />
  ),
  h4: (props: HTMLAttributes<HTMLHeadingElement>) => (
    <h4 className="text-lg font-bold text-white mt-6 mb-3" {...props} />
  ),
  p: (props: HTMLAttributes<HTMLParagraphElement>) => {
    const text = props.children?.toString() || "";

    // Check if this is a Q&A style paragraph
    if (text.startsWith("Q:")) {
      const content = text.slice(2).trim();
      return (
        <div className="flex flex-col mt-8">
          <div className="flex items-start gap-4">
            <span className="text-purple-400 font-bold text-lg">Q:</span>
            <div className="text-gray-300 leading-relaxed flex-1">
              {content}
            </div>
          </div>
        </div>
      );
    }

    if (text.startsWith("A:")) {
      const content = text.slice(2).trim();
      return (
        <div className="flex flex-col mb-8">
          <div className="flex items-start gap-4">
            <span className="text-green-400 font-bold text-lg">A:</span>
            <div className="text-gray-300 leading-relaxed flex-1">
              {content}
            </div>
          </div>
        </div>
      );
    }

    return <p className="text-gray-300 leading-relaxed mb-4" {...props} />;
  },
  a: (props: HTMLAttributes<HTMLAnchorElement>) => (
    <a className="text-purple-400 hover:text-purple-300 underline" {...props} />
  ),
  pre: (props: HTMLAttributes<HTMLPreElement>) => (
    <pre
      className="bg-gray-900 rounded-lg p-4 mb-4 overflow-x-auto"
      {...props}
    />
  ),
  code: (props: HTMLAttributes<HTMLElement>) => (
    <code
      className="bg-gray-800 px-1 py-0.5 rounded text-sm text-gray-300"
      {...props}
    />
  ),
  ul: (props: HTMLAttributes<HTMLUListElement>) => (
    <ul
      className="list-disc list-outside text-gray-300 mb-4 ml-6"
      {...props}
    />
  ),
  ol: (props: HTMLAttributes<HTMLOListElement>) => (
    <ol
      className="list-decimal list-outside text-gray-300 mb-4 ml-6"
      {...props}
    />
  ),
  li: (props: HTMLAttributes<HTMLLIElement>) => (
    <li className="text-gray-300 mb-3 pl-1" {...props} />
  ),
  table: (props: HTMLAttributes<HTMLTableElement>) => (
    <div className="overflow-x-auto mb-4">
      <table
        className="min-w-full border border-gray-700 bg-gray-900"
        {...props}
      />
    </div>
  ),
  th: (props: HTMLAttributes<HTMLTableCellElement>) => (
    <th
      className="px-6 py-3 text-left text-sm font-semibold text-white border-b border-gray-700"
      {...props}
    />
  ),
  td: (props: HTMLAttributes<HTMLTableCellElement>) => (
    <td
      className="px-6 py-4 text-sm text-gray-300 border-b border-gray-700"
      {...props}
    />
  ),
  blockquote: (props: HTMLAttributes<HTMLQuoteElement>) => (
    <blockquote
      className="border-l-4 border-purple-500 pl-4 my-6 text-gray-300 italic"
      {...props}
    />
  ),
  hr: (props: HTMLAttributes<HTMLHRElement>) => (
    <hr className="border-gray-700 my-8" {...props} />
  ),
  CallToAction: ({ copy, link }: { copy: string; link: string }) => (
    <div className="bg-gray-900 rounded-lg p-6 my-8">
      <p className="text-gray-300 mb-4">{copy}</p>
      <a
        href={link}
        className="inline-block bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg transition-colors"
      >
        Try Release for Free
      </a>
    </div>
  ),
};

export default function MDXContent({ code }: MDXContentProps) {
  const Component = useMDXComponent(code);

  try {
    return (
      <div className="prose prose-invert max-w-none">
        <Component components={components} />
      </div>
    );
  } catch (error) {
    console.error("Error rendering MDX content:", error);
    return <div>Error rendering content</div>;
  }
}
