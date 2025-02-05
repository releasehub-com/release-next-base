import { MDXRemote } from 'next-mdx-remote/rsc';
import Image from 'next/image';
import CallToAction from '@/components/blog/CallToAction';
import React from 'react';

const components = {
  img: (props: any) => (
    <Image 
      src={props.src} 
      alt={props.alt || ''} 
      width={800}
      height={400}
      className="my-8 w-full h-auto rounded-lg"
    />
  ),
  h2: (props: any) => (
    <h2 className="text-3xl font-bold text-white mt-12 mb-6" {...props} />
  ),
  h3: (props: any) => (
    <h3 className="text-2xl font-bold text-white mt-8 mb-4" {...props} />
  ),
  h4: (props: any) => (
    <h4 className="text-xl font-bold text-white mt-6 mb-3" {...props} />
  ),
  p: (props: any) => {
    const hasImage = React.Children.toArray(props.children).some(
      child => typeof child === 'object' && child.type === Image
    );

    if (hasImage) {
      return props.children;
    }

    return <p className="text-gray-300 mb-4 leading-relaxed" {...props} />;
  },
  a: (props: any) => (
    <a className="text-purple-400 hover:text-purple-300" {...props} />
  ),
  pre: (props: any) => (
    <pre className="bg-gray-800 p-4 rounded-lg overflow-x-auto mb-4" {...props} />
  ),
  code: (props: any) => (
    <code className="bg-gray-800 px-1 py-0.5 rounded" {...props} />
  ),
  ul: (props: any) => (
    <ul className="list-disc list-inside text-gray-300 mb-4 ml-4" {...props} />
  ),
  ol: (props: any) => (
    <ol className="list-decimal list-inside text-gray-300 mb-4 ml-4" {...props} />
  ),
  li: (props: any) => (
    <li className="mb-2" {...props} />
  ),
  CallToAction: ({ copy, link }: { copy: string; link: string }) => (
    <CallToAction copy={copy} link={link} />
  ),
};

export default function MDXContent({ source }: { source: string }) {
  return (
    <div className="prose prose-invert prose-pre:bg-gray-800 prose-pre:p-4 max-w-none">
      <MDXRemote source={source} components={components} />
    </div>
  );
} 