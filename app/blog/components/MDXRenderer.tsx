"use client";

import { MDXRemote } from "next-mdx-remote/rsc";
import Image from "next/image";
import CallToAction from "@/components/blog/CallToAction";
import React, { ReactElement } from "react";
import type { ComponentProps } from "react";

type MDXComponents = {
  img: (props: ComponentProps<"img">) => JSX.Element;
  h2: (props: ComponentProps<"h2">) => JSX.Element;
  h3: (props: ComponentProps<"h3">) => JSX.Element;
  h4: (props: ComponentProps<"h4">) => JSX.Element;
  p: (props: ComponentProps<"p">) => JSX.Element;
  a: (props: ComponentProps<"a">) => JSX.Element;
  pre: (props: ComponentProps<"pre">) => JSX.Element;
  code: (props: ComponentProps<"code">) => JSX.Element;
  ul: (props: ComponentProps<"ul">) => JSX.Element;
  ol: (props: ComponentProps<"ol">) => JSX.Element;
  li: (props: ComponentProps<"li">) => JSX.Element;
  CallToAction: (props: { copy: string; link: string }) => JSX.Element;
};

const components: MDXComponents = {
  img: (props) => (
    <div className="relative w-full h-96 my-8">
      <Image
        src={props.src || ""}
        alt={props.alt || ""}
        fill
        className="object-cover"
      />
    </div>
  ),
  h2: (props) => (
    <h2 className="text-3xl font-bold text-white mt-12 mb-6" {...props} />
  ),
  h3: (props) => (
    <h3 className="text-2xl font-bold text-white mt-8 mb-4" {...props} />
  ),
  h4: (props) => (
    <h4 className="text-xl font-bold text-white mt-6 mb-3" {...props} />
  ),
  p: (props) => <p className="text-gray-300 mb-4 leading-relaxed" {...props} />,
  a: (props) => (
    <a className="text-purple-400 hover:text-purple-300" {...props} />
  ),
  pre: (props) => (
    <pre
      className="bg-gray-800 p-4 rounded-lg overflow-x-auto mb-4"
      {...props}
    />
  ),
  code: (props) => (
    <code className="bg-gray-800 px-1 py-0.5 rounded" {...props} />
  ),
  ul: (props) => (
    <ul className="list-disc list-outside text-gray-300 mb-4 ml-6" {...props} />
  ),
  ol: (props) => (
    <ol
      className="list-decimal list-outside text-gray-300 mb-4 ml-6"
      {...props}
    />
  ),
  li: (props) => <li className="text-gray-300 mb-3 pl-1" {...props} />,
  CallToAction: ({ copy, link }) => <CallToAction copy={copy} link={link} />,
};

export default function MDXRenderer({ source }: { source: string }) {
  return (
    <div className="prose prose-invert prose-pre:bg-gray-800 prose-pre:p-4 max-w-none">
      <MDXRemote source={source} components={components} />
    </div>
  );
}
