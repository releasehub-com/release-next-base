"use client";

import { useEffect, useState } from "react";
import { PageContext } from "../types";
import { formatSocialContent, ImageGrid, UrlPreview, shouldShowUrlPreview, getUrlPreviewContent, UrlPreviewData } from ".";

interface TwitterContentProps {
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

export function calculateTwitterLength(text: string): number {
  if (!text) return 0;
  const urlRegex = /https?:\/\/[^\s]+/g;
  const urls: string[] = text.match(urlRegex) || [];
  let length = text.length;
  urls.forEach((url) => {
    length = length - url.length + 23;
  });
  return length;
}

export function TwitterContent({
  content,
  imageAssets,
  pageContext,
  isPreview = false,
}: TwitterContentProps) {
  const [urlPreviewData, setUrlPreviewData] = useState<{
    url: string;
    title: string;
    description: string;
    isInternal: boolean;
    ogData?: UrlPreviewData;
  } | null>(null);

  useEffect(() => {
    async function fetchUrlPreview() {
      if (shouldShowUrlPreview(content, imageAssets)) {
        const data = await getUrlPreviewContent(content, pageContext);
        setUrlPreviewData(data);
      }
    }
    fetchUrlPreview();
  }, [content, pageContext, imageAssets]);

  if (!content) return null;

  const processed = formatSocialContent(content, {
    urlColor: "#1d9bf0",
    hashtagColor: "#1d9bf0",
    mentionColor: "#1d9bf0"
  });

  return (
    <div className="bg-black rounded-lg p-4">
      <div
        className="text-white whitespace-pre-wrap break-words text-xs leading-[20px]"
        dangerouslySetInnerHTML={{ __html: processed }}
      />
      <ImageGrid imageAssets={imageAssets} />
      {shouldShowUrlPreview(content, imageAssets) && urlPreviewData && (
        <UrlPreview
          url={urlPreviewData.url}
          pageContext={pageContext}
          isInternal={urlPreviewData.isInternal}
          isDark={true}
          ogData={urlPreviewData.ogData}
        />
      )}
    </div>
  );
} 