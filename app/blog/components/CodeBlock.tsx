"use client";

import React, { useEffect, useRef } from "react";
import hljs from "highlight.js";

type CodeBlockProps = {
  className?: string;
  children?: React.ReactNode;
};

export default function CodeBlock({ className, children }: CodeBlockProps) {
  const codeRef = useRef<HTMLElement>(null);
  
  useEffect(() => {
    if (codeRef.current) {
      hljs.highlightElement(codeRef.current);
    }
  }, [children]);

  // Extract language from className if provided (format: language-xxx)
  const language = className?.replace("language-", "") || "";

  return (
    <code ref={codeRef} className={className}>
      {children}
    </code>
  );
}
