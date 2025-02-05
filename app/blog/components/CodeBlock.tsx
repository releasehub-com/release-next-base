"use client";

import React from "react";

type CodeBlockProps = {
  className?: string;
  children?: React.ReactNode;
};

export default function CodeBlock({ className, children }: CodeBlockProps) {
  return <code className={className}>{children}</code>;
}
