"use client";

import type { ConfirmationDialogProps } from "./types";
import { TwitterContent } from "./platforms/TwitterContent";
import { LinkedInContent } from "./platforms/LinkedInContent";
import { HackerNewsContent } from "./platforms/HackerNewsContent";

export function ConfirmationDialog({
  isOpen,
  onClose,
  onConfirm,
  content,
  platform,
  scheduledTime,
  pageContext,
  imageAssets,
}: ConfirmationDialogProps) {
  if (!isOpen) return null;

  const isScheduled = scheduledTime.getTime() > Date.now() + 60000; // More than 1 minute in the future
  const formattedTime = scheduledTime.toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  const handleConfirm = () => {
    // Add 5 seconds to the scheduled time for immediate posts to avoid validation issues
    const adjustedTime = isScheduled
      ? scheduledTime
      : new Date(Date.now() + 5000);
    onConfirm(adjustedTime);
  };

  return (
    <div className="fixed inset-0 z-[60] overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div
          className="fixed inset-0 bg-black/50 transition-opacity"
          onClick={onClose}
        />
        <div className="relative bg-gray-800 rounded-lg shadow-xl w-full max-w-md p-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-white">
                {isScheduled ? "Schedule Post" : "Post Now"}
              </h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-300"
              >
                <span className="sr-only">Close</span>
                <svg
                  className="h-6 w-6"
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

            {platform === "twitter" ? (
              <TwitterContent
                content={content}
                imageAssets={imageAssets.twitter || []}
                pageContext={pageContext}
                isPreview
              />
            ) : platform === "linkedin" ? (
              <LinkedInContent
                content={content}
                imageAssets={imageAssets.linkedin || []}
                pageContext={pageContext}
                isPreview
              />
            ) : platform === "hackernews" ? (
              <HackerNewsContent
                content={content}
                pageContext={pageContext}
                isPreview
              />
            ) : null}

            <div className="text-sm text-gray-300">
              {isScheduled
                ? `Scheduled for ${formattedTime}`
                : "This will be posted immediately"}
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm rounded-md bg-gray-700 text-white hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                className="px-4 py-2 text-sm rounded-md bg-indigo-600 text-white hover:bg-indigo-700"
              >
                {isScheduled ? "Schedule" : "Post Now"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
