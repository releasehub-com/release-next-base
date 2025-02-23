"use client";

import Image from "next/image";
import type { PlatformEditorProps } from "../types";

export function TwitterIcon() {
  return (
    <svg className="w-4 h-4 mr-1 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
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

export function TwitterEditor({
  content,
  imageAssets,
  isUploading,
  onContentChange,
  onImageUpload,
  onImageRemove,
}: PlatformEditorProps) {
  const length = calculateTwitterLength(content);
  const isOverLimit = length > 280;

  return (
    <div className="h-full bg-gray-800 rounded-lg p-4 flex flex-col">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-sm font-medium text-gray-300 flex items-center">
          <TwitterIcon />
          Twitter Post
        </h4>
        <p className={`text-xs ${isOverLimit ? "text-red-400" : "text-gray-400"}`}>
          {length}/280
          {isOverLimit && <span className="ml-1">• Too long</span>}
        </p>
      </div>

      <div className="flex-1 min-h-0">
        <textarea
          value={content}
          onChange={(e) => onContentChange(e.target.value)}
          className={`h-full w-full bg-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/70 text-xs leading-relaxed resize-none ${
            isOverLimit ? "border-2 border-red-500" : ""
          }`}
          placeholder="No content available"
        />
      </div>

      {/* Image upload UI */}
      <div className="mt-3">
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-400">
            Images ({imageAssets.length}/4)
          </span>
          <label className="cursor-pointer px-2 py-0.5 text-xs rounded bg-gray-700 text-gray-300 hover:bg-gray-600 transition-colors">
            {isUploading ? "..." : "+ Add"}
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={onImageUpload}
              disabled={isUploading || imageAssets.length >= 4}
            />
          </label>
        </div>

        {imageAssets.length > 0 && (
          <div className="mt-2 bg-gray-800/50 rounded-lg p-1">
            <div className="grid grid-cols-4 gap-1">
              {imageAssets.map((imageAsset, index) => (
                <div
                  key={`edit-${imageAsset.asset}-${index}`}
                  className="relative group"
                >
                  <div className="aspect-square bg-gray-700 rounded overflow-hidden">
                    <Image
                      src={imageAsset.displayUrl}
                      alt={`Image ${index + 1}`}
                      width={60}
                      height={60}
                      className="object-cover w-full h-full"
                    />
                    <button
                      onClick={() => onImageRemove(index)}
                      className="absolute top-0.5 right-0.5 p-0.5 bg-red-600/90 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <svg
                        className="w-2.5 h-2.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 