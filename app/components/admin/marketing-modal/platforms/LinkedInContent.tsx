"use client";

import Image from "next/image";
import type { PageContext } from "../types";

interface LinkedInContentProps {
  content: string;
  imageAssets: Array<{ asset: string; displayUrl: string }>;
  pageContext: PageContext;
  isPreview?: boolean;
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
  if (!content) return null;

  const paragraphs = content.split("\n\n").filter(Boolean);

  const processedParagraphs = paragraphs.map((paragraph) => {
    let processed = paragraph.replace(
      /(?:^|\s)(https?:\/\/[^\s]+)(?=\s|$)/g,
      ' <span class="text-[#0a66c2] underline">$1</span>',
    );

    processed = processed.replace(
      /(?:^|\s)#(\w+)/g,
      ' <span class="text-[#0a66c2]">#$1</span>',
    );

    processed = processed.replace(
      /(?:^|\s)@(\w+)/g,
      ' <span class="text-[#0a66c2]">@$1</span>',
    );

    return processed;
  });

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
        {imageAssets.length > 0 && (
          <div
            className={`grid ${imageAssets.length === 1 ? "" : "grid-cols-2"} gap-2 mt-4`}
          >
            {imageAssets.map((imageAsset, index) => (
              <div
                key={`preview-${imageAsset.asset}-${index}`}
                className="relative aspect-w-16 aspect-h-9"
              >
                <Image
                  src={imageAsset.displayUrl}
                  alt={`Image ${index + 1}`}
                  width={200}
                  height={150}
                  className="rounded-lg object-cover"
                />
              </div>
            ))}
          </div>
        )}
        {pageContext.url && imageAssets.length === 0 && (
          <div className="mt-4 border border-gray-200 rounded-lg overflow-hidden bg-white">
            <div className="aspect-video relative">
              <Image
                src="/og/og-image.png"
                alt="Article preview"
                fill
                className="object-cover"
              />
            </div>
            <div className="p-3">
              <h3 className="text-[15px] font-medium text-gray-900 line-clamp-2">
                {pageContext.title}
              </h3>
              <p className="text-[13px] text-gray-500 mt-1 line-clamp-2">
                {pageContext.description}
              </p>
              <p className="text-[13px] text-gray-400 mt-1">
                {new URL(pageContext.url).hostname}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 