"use client";

import { useEffect, useState } from "react";
import { PageContext } from "../types";
import { formatSocialContent, ImageGrid, UrlPreview, shouldShowUrlPreview, getUrlPreviewContent, UrlPreviewData } from ".";

interface LinkedInContentProps {
  content: string;
  imageAssets: Array<{ asset: string; displayUrl: string }>;
  pageContext: PageContext;
  isPreview?: boolean;
}

interface UrlPreviewData {
  url: string;
  title: string;
  description: string;
  isInternal: boolean;
  ogImage?: string;
}

export function calculateLinkedInLength(text: string): number {
  if (!text) return 0;
  return text.length;
}

export function getLinkedInLengthFeedback(length: number): {
  message: string;
  color: string;
} {
  if (length === 0) return { message: "characters", color: "text-gray-400" };
  if (length <= 200)
    return {
      message: "Will show in feed without truncation",
      color: "text-green-400",
    };
  if (length <= 1200)
    return { message: "Optimal length", color: "text-green-400" };
  if (length <= 2000) return { message: "Good length", color: "text-blue-400" };
  if (length <= 3000)
    return { message: "Approaching limit", color: "text-yellow-400" };
  return { message: "Exceeds recommended length", color: "text-red-400" };
}

export function LinkedInContent({
  content,
  imageAssets,
  pageContext,
  isPreview = false,
}: LinkedInContentProps) {
  const [urlPreviewData, setUrlPreviewData] = useState<{
    url: string;
    title: string;
    description: string;
    isInternal: boolean;
    ogData?: UrlPreviewData;
  } | null>(null);

  useEffect(() => {
    if (shouldShowUrlPreview(content, imageAssets)) {
      getUrlPreviewContent(content, pageContext).then(setUrlPreviewData);
    }
  }, [content, pageContext, imageAssets]);

  if (!content) return null;

  const paragraphs = content.split("\n\n").filter(Boolean);
  const processedParagraphs = paragraphs.map((paragraph) => 
    formatSocialContent(paragraph, {
      urlColor: "#0a66c2",
      hashtagColor: "#0a66c2",
      mentionColor: "#0a66c2"
    })
  );

  return (
    <div className="bg-white rounded-lg p-4 shadow-sm">
      <div className="space-y-4">
        {processedParagraphs.map((paragraph, i) => (
          <p
            key={i}
            className="text-gray-900 whitespace-pre-wrap break-words text-xs leading-[20px]"
            dangerouslySetInnerHTML={{ __html: paragraph }}
          />
        ))}
        <ImageGrid imageAssets={imageAssets} />
        {shouldShowUrlPreview(content, imageAssets) && urlPreviewData && (
          <UrlPreview
            url={urlPreviewData.url}
            pageContext={pageContext}
            isInternal={urlPreviewData.isInternal}
            isDark={false}
            ogData={urlPreviewData.ogData}
          />
        )}
      </div>
    </div>
  );
} 