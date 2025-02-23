"use client";

import Image from "next/image";
import type { PlatformEditorProps } from "../types";

export function LinkedInIcon() {
  return (
    <svg className="w-4 h-4 mr-1 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
      <path d="M20.47 2H3.53a1.45 1.45 0 0 0-1.47 1.43v17.14A1.45 1.45 0 0 0 3.53 22h16.94a1.45 1.45 0 0 0 1.47-1.43V3.43A1.45 1.45 0 0 0 20.47 2ZM8.09 18.74h-3v-9h3ZM6.59 8.48a1.56 1.56 0 1 1 0-3.12 1.57 1.57 0 1 1 0 3.12Zm12.32 10.26h-3v-4.83c0-1.21-.43-2-1.52-2A1.65 1.65 0 0 0 12.85 13a2 2 0 0 0-.1.73v5h-3v-9h3V11a3 3 0 0 1 2.71-1.5c2 0 3.45 1.29 3.45 4.06Z" />
    </svg>
  );
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

export function LinkedInEditor({
  content,
  imageAssets,
  isUploading,
  onContentChange,
  onImageUpload,
  onImageRemove,
}: PlatformEditorProps) {
  const length = calculateLinkedInLength(content);
  const feedback = getLinkedInLengthFeedback(length);
  const isOverLimit = length > 3000;

  return (
    <div className="h-full bg-gray-800 rounded-lg p-4 flex flex-col">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-sm font-medium text-gray-300 flex items-center">
          <LinkedInIcon />
          LinkedIn Post
        </h4>
        <span className={`text-xs ${feedback.color}`}>
          {length.toLocaleString()}/3,000
          {length > 200 && (
            <span className="ml-1 text-gray-400">
              • First {Math.min(length, 200)} visible
            </span>
          )}
        </span>
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
            Images ({imageAssets.length}/9)
          </span>
          <label className="cursor-pointer px-2 py-0.5 text-xs rounded bg-gray-700 text-gray-300 hover:bg-gray-600 transition-colors">
            {isUploading ? "..." : "+ Add"}
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={onImageUpload}
              disabled={isUploading || imageAssets.length >= 9}
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