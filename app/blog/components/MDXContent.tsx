import { MDXRemote } from "next-mdx-remote/rsc";
import Image from "next/image";
import CallToAction from "@/components/blog/CallToAction";
import React, { ReactElement } from "react";
import type { ComponentProps } from "react";
import {
  MDXImageProps,
  MDXHeadingProps,
  MDXParagraphProps,
  MDXLinkProps,
  MDXPreProps,
  MDXCodeProps,
  MDXUnorderedListProps,
  MDXOrderedListProps,
  MDXListItemProps,
} from "../types/mdx";
import CodeBlock from "./CodeBlock";

type CodeProps = ComponentProps<"code"> & {
  inline?: boolean;
};

type MDXComponents = {
  img: (props: ComponentProps<"img">) => JSX.Element;
  h2: (props: ComponentProps<"h2">) => JSX.Element;
  h3: (props: ComponentProps<"h3">) => JSX.Element;
  h4: (props: ComponentProps<"h4">) => JSX.Element;
  p: (props: ComponentProps<"p">) => JSX.Element;
  a: (props: ComponentProps<"a">) => JSX.Element;
  pre: (props: ComponentProps<"pre">) => JSX.Element;
  code: (props: {
    inline?: boolean;
    className?: string;
    children?: React.ReactNode;
  }) => JSX.Element;
  ul: (props: ComponentProps<"ul">) => JSX.Element;
  ol: (props: ComponentProps<"ol">) => JSX.Element;
  li: (props: ComponentProps<"li">) => JSX.Element;
  CallToAction: (props: { copy: string; link: string }) => JSX.Element;
};

// Create a pure inline code component that doesn't pass through any MDX-specific props
const InlineCode = React.forwardRef<HTMLElement, ComponentProps<"code">>(
  ({ children, ...props }, ref) => (
    <code
      ref={ref}
      className="bg-gray-800 px-1 py-0.5 rounded text-sm"
      {...props}
    >
      {children}
    </code>
  ),
);
InlineCode.displayName = "InlineCode";

const components: MDXComponents = {
  img: (props: ComponentProps<"img">) => (
    <Image
      src={props.src || ""}
      alt={props.alt || ""}
      width={800}
      height={400}
      className="my-8 w-full h-auto rounded-lg"
    />
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
  p: (props) => {
    const hasImage = React.Children.toArray(props.children).some((child) => {
      if (React.isValidElement(child)) {
        return child.type === components.img;
      }
      return false;
    });

    if (hasImage) {
      return <>{props.children}</>;
    }

    return <p className="text-gray-300 mb-4 leading-relaxed" {...props} />;
  },
  a: (props) => (
    <a className="text-purple-400 hover:text-purple-300" {...props} />
  ),
  pre: (props) => (
    <pre
      className="bg-gray-800 p-4 rounded-lg overflow-x-auto mb-4"
      {...props}
    />
  ),
  code: (props: {
    inline?: boolean;
    className?: string;
    children?: React.ReactNode;
  }) => {
    const { inline, className, children, ...rest } = props;

    // For inline code
    if (inline) {
      return <InlineCode>{children}</InlineCode>;
    }

    // For block code
    return <CodeBlock className={className}>{children}</CodeBlock>;
  },
  ul: (props) => (
    <ul className="list-disc list-inside text-gray-300 mb-4 ml-4" {...props} />
  ),
  ol: (props) => (
    <ol
      className="list-decimal list-inside text-gray-300 mb-4 ml-4"
      {...props}
    />
  ),
  li: (props) => <li className="mb-2" {...props} />,
  CallToAction: ({ copy, link }) => <CallToAction copy={copy} link={link} />,
};

export default function MDXContent({ source }: { source: string }) {
  return (
    <div className="prose prose-invert prose-pre:bg-gray-800 prose-pre:p-4 max-w-none">
      <MDXRemote source={source} components={components} />
    </div>
  );
}
