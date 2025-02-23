import { ImageAsset, PageContext } from "../types";
import Image from "next/image";
import React from "react";

export function extractFirstUrl(content: string): string | null {
  const urlRegex = /https?:\/\/[^\s]+/g;
  const urls = content.match(urlRegex) || [];
  return urls[0] || null;
}

export function isInternalLink(url: string | null): boolean {
  if (!url) return false;

  // Get base URL from env or window location
  const baseUrl = typeof window !== 'undefined' 
    ? window.location.origin 
    : process.env.NEXT_PUBLIC_BASE_URL || 'https://release.com';

  try {
    return new URL(url).hostname === new URL(baseUrl).hostname;
  } catch {
    return false;
  }
}

export function shouldShowUrlPreview(content: string, imageAssets: ImageAsset[]): boolean {
  return imageAssets.length === 0 && !!extractFirstUrl(content);
}

export interface UrlPreviewData {
  url: string;
  title: string;
  description: string;
  ogImage: string;
  type?: string;
  siteName?: string;
  twitterCard?: string;
  twitterSite?: string;
  twitterCreator?: string;
}

export interface UrlPreviewProps {
  url: string;
  pageContext: PageContext;
  isInternal: boolean;
  isDark?: boolean;
  ogData?: UrlPreviewData;
}

export function UrlPreview({ url, pageContext, isInternal, isDark = false, ogData }: UrlPreviewProps) {
  const textColor = isDark ? "text-white" : "text-gray-900";
  const mutedColor = isDark ? "text-gray-400" : "text-gray-500";
  const borderColor = isDark ? "border-gray-700" : "border-gray-200";
  const bgColor = isDark ? "bg-black/50" : "bg-white";

  // Use ogData if available, otherwise fall back to pageContext
  const title = isInternal ? (ogData?.title || pageContext.title) : url;
  const description = isInternal ? (ogData?.description || pageContext.description) : '';
  const image = isInternal ? (ogData?.ogImage || "/og/og-image.png") : undefined;
  const hostname = new URL(url).hostname;
  const siteName = ogData?.siteName || hostname;

  return (
    <div className={`mt-3 border ${borderColor} rounded-xl overflow-hidden ${bgColor}`}>
      {isInternal ? (
        <>
          <div className="aspect-video relative">
            <Image
              src={image}
              alt={title}
              fill
              className="object-cover"
            />
          </div>
          <div className="p-3">
            <p className={mutedColor + " text-[13px] flex items-center gap-1"}>
              {siteName}
              {ogData?.type && (
                <>
                  <span className="text-gray-400">•</span>
                  <span className="capitalize">{ogData.type}</span>
                </>
              )}
            </p>
            <h3 className={`text-[15px] font-medium ${textColor} line-clamp-1`}>
              {title}
            </h3>
            <p className={`text-[13px] ${mutedColor} line-clamp-2`}>
              {description}
            </p>
          </div>
        </>
      ) : (
        <>
          <div className="aspect-video relative bg-gray-800">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="p-3 rounded-full bg-gray-700">
                <svg className={`w-6 h-6 ${mutedColor}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
              </div>
            </div>
          </div>
          <div className="p-3">
            <p className={`text-[13px] ${mutedColor}`}>
              {hostname}
            </p>
            <h3 className={`text-[15px] font-medium ${textColor} line-clamp-2`}>
              {url}
            </h3>
            <p className={`text-[13px] ${mutedColor} mt-1`}>
              External link preview
            </p>
          </div>
        </>
      )}
    </div>
  );
}

export async function getUrlPreviewContent(content: string, pageContext: PageContext): Promise<{
  url: string;
  title: string;
  description: string;
  isInternal: boolean;
  ogData?: UrlPreviewData;
}> {
  const url = extractFirstUrl(content) || pageContext.url;
  const isInternal = isInternalLink(url);

  if (isInternal) {
    try {
      const response = await fetch(`/api/admin/og-data?url=${encodeURIComponent(url)}`);
      if (response.ok) {
        const ogData = await response.json();
        return {
          url,
          title: ogData.title,
          description: ogData.description,
          isInternal: true,
          ogData: {
            url: url,
            title: ogData.title,
            description: ogData.description,
            ogImage: ogData.ogImage,
            type: ogData.type,
            siteName: ogData.siteName,
            twitterCard: ogData.twitterCard,
            twitterSite: ogData.twitterSite,
            twitterCreator: ogData.twitterCreator
          }
        };
      }
    } catch (error) {
      console.error('Error fetching OG data:', error);
    }
  }

  // Fallback to pageContext if internal link fails or for external links
  return {
    url,
    title: isInternal ? pageContext.title : url,
    description: isInternal ? pageContext.description : '',
    isInternal,
    ogData: isInternal ? {
      url: pageContext.url,
      title: pageContext.title,
      description: pageContext.description,
      ogImage: '/og/og-image.png',
      type: 'website'
    } : undefined
  };
}

interface FormatContentOptions {
  urlColor: string;
  hashtagColor: string;
  mentionColor: string;
}

export function formatSocialContent(content: string, options: FormatContentOptions): string {
  let processed = content;

  // Handle URLs - make them colored and underlined
  processed = processed.replace(
    /(?:^|\s)(https?:\/\/[^\s]+)(?=\s|$)/g,
    ` <span class="text-[${options.urlColor}] underline">$1</span>`,
  );

  // Handle hashtags
  processed = processed.replace(
    /(?:^|\s)#(\w+)/g,
    ` <span class="text-[${options.hashtagColor}]">#$1</span>`,
  );

  // Handle mentions
  processed = processed.replace(
    /(?:^|\s)@(\w+)/g,
    ` <span class="text-[${options.mentionColor}]">@$1</span>`,
  );

  return processed;
}

interface ImageGridProps {
  imageAssets: ImageAsset[];
  className?: string;
}

export function ImageGrid({ imageAssets, className = "" }: ImageGridProps) {
  if (imageAssets.length === 0) return null;

  return (
    <div
      className={`grid ${imageAssets.length === 1 ? "" : "grid-cols-2"} gap-2 mt-4 ${className}`}
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
  );
} 