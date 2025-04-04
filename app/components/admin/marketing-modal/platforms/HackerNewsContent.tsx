"use client";

import { PageContext } from "../types";

interface HackerNewsContentProps {
  content: string;
  pageContext: PageContext;
  isPreview?: boolean;
}

export function HackerNewsIcon() {
  return (
    <svg
      className="w-4 h-4 mr-1 text-orange-500"
      fill="currentColor"
      viewBox="0 0 24 24"
    >
      <path d="M0 24V0h24v24H0zM6.951 5.896l4.112 7.708v5.064h1.583v-4.972l4.148-7.799h-1.749l-2.457 4.875c-.372.745-.688 1.434-.688 1.434s-.297-.708-.651-1.434L8.831 5.896h-1.88z" />
    </svg>
  );
}

export function HackerNewsContent({
  content,
  pageContext,
  isPreview = false,
}: HackerNewsContentProps) {
  if (!content) return null;

  return (
    <div className="bg-[#ff6600]/10 rounded-lg p-4">
      <div className="flex items-start gap-3">
        <HackerNewsIcon />
        <div className="flex-1">
          <h3 className="text-white text-sm font-medium mb-2">{content}</h3>
          <div className="text-gray-400 text-xs space-y-1">
            <p>URL: {pageContext.url}</p>
            <p className="text-orange-500/70">
              This title will be used when submitting to Hacker News
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
