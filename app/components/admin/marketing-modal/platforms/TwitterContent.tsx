"use client";

import Image from "next/image";
import type { PageContext } from "../types";

interface TwitterContentProps {
  content: string;
  imageAssets: Array<{ asset: string; displayUrl: string }>;
  pageContext: PageContext;
  isPreview?: boolean;
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
  if (!content) return null;

  let processed = content;

  processed = processed.replace(
    /(?:^|\s)(https?:\/\/[^\s]+)(?=\s|$)/g,
    ' <span class="text-[#1d9bf0] underline">$1</span>',
  );

  processed = processed.replace(
    /(?:^|\s)#(\w+)/g,
    ' <span class="text-[#1d9bf0]">#$1</span>',
  );

  processed = processed.replace(
    /(?:^|\s)@(\w+)/g,
    ' <span class="text-[#1d9bf0]">@$1</span>',
  );

  return (
    <div className="bg-black rounded-lg p-4">
      <div
        className="text-white whitespace-pre-wrap break-words text-xs leading-[20px]"
        dangerouslySetInnerHTML={{ __html: processed }}
      />
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
        <div className="mt-3 border border-gray-700 rounded-xl overflow-hidden bg-black/50">
          <div className="aspect-video relative">
            <Image
              src="/og/og-image.png"
              alt="Article preview"
              fill
              className="object-cover"
            />
          </div>
          <div className="p-3">
            <p className="text-[13px] text-gray-400">
              {new URL(pageContext.url).hostname}
            </p>
            <h3 className="text-[15px] font-medium text-white line-clamp-1">
              {pageContext.title}
            </h3>
            <p className="text-[13px] text-gray-400 line-clamp-2">
              {pageContext.description}
            </p>
          </div>
        </div>
      )}
    </div>
  );
} 