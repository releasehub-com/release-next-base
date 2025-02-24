"use client";

import { useState } from "react";
import { TwitterEditor } from "../marketing-modal/platforms/TwitterEditor";
import { LinkedInEditor } from "../marketing-modal/platforms/LinkedInEditor";
import { HackerNewsEditor } from "../marketing-modal/platforms/HackerNewsEditor";
import { validateContent } from "../marketing-modal/platforms/validation";
import { PlatformIcon } from "../marketing-modal/platforms/PlatformIcon";
import type { Platform } from "../marketing-modal/types";

interface ImageAsset {
  asset: string;
  displayUrl: string;
}

interface ScheduledPost {
  id: string;
  content: string;
  scheduledFor: string;
  status: "scheduled" | "posted" | "failed";
  errorMessage?: string;
  metadata: {
    platform: string;
    pageContext: {
      title: string;
      url: string;
      description?: string;
    };
    imageAssets?: ImageAsset[];
  };
  createdAt: string;
  updatedAt: string;
}

interface EditPostModalProps {
  post: ScheduledPost;
  onClose: () => void;
  onSave: (
    post: ScheduledPost,
    content: string,
    scheduledFor: Date,
  ) => Promise<void>;
}

export function EditPostModal({ post, onClose, onSave }: EditPostModalProps) {
  const [content, setContent] = useState(post.content);
  const [scheduledFor, setScheduledFor] = useState(new Date(post.scheduledFor));
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageAssets, setImageAssets] = useState<ImageAsset[]>(
    post.metadata.imageAssets || [],
  );
  const platform = post.metadata.platform.toLowerCase() as Platform;

  const handleSave = async () => {
    // Validate content based on platform
    if (!validateContent(platform, content)) {
      setError("Content exceeds platform's character limit");
      return;
    }

    try {
      setIsSaving(true);
      setError(null);
      await onSave(post, content, scheduledFor);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save changes");
    } finally {
      setIsSaving(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    // This is just a placeholder - in a real implementation, you would handle image uploads
    // and update the imageAssets state
    console.log("Image upload not implemented");
  };

  const handleImageRemove = (index: number) => {
    setImageAssets((prev) => prev.filter((_, i) => i !== index));
  };

  const renderEditor = () => {
    const editorProps = {
      content,
      imageAssets,
      isUploading: false,
      onContentChange: setContent,
      onImageUpload: handleImageUpload,
      onImageRemove: handleImageRemove,
    };

    switch (platform) {
      case "twitter":
        return (
          <div className="h-[350px]">
            <TwitterEditor {...editorProps} />
          </div>
        );
      case "linkedin":
        return (
          <div className="h-[350px]">
            <LinkedInEditor {...editorProps} />
          </div>
        );
      case "hackernews":
        return (
          <div className="h-[350px]">
            <HackerNewsEditor content={content} onContentChange={setContent} />
          </div>
        );
      default:
        return (
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full h-[350px] bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Enter your post content..."
          />
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 py-6">
        <div
          className="fixed inset-0 bg-black/50 transition-opacity"
          onClick={onClose}
        />
        <div className="relative bg-gray-900 rounded-lg shadow-xl w-full max-w-3xl min-h-[600px] flex flex-col">
          <div className="flex items-center justify-between p-4 border-b border-gray-700">
            <div className="flex items-center space-x-3">
              <PlatformIcon platform={platform} className="w-5 h-5" />
              <h2 className="text-lg font-medium text-white">Edit Post</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-300 hover:bg-gray-700 rounded-full"
              title="Close"
            >
              <svg
                className="w-5 h-5"
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
          <div className="flex-1 p-4 overflow-y-auto">
            <div className="space-y-4 h-full">
              <div className="flex-1">{renderEditor()}</div>
              <div>
                <label
                  htmlFor="scheduledFor"
                  className="block text-sm font-medium text-gray-200 mb-2"
                >
                  Scheduled For
                </label>
                <input
                  type="datetime-local"
                  id="scheduledFor"
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={scheduledFor.toISOString().slice(0, 16)}
                  onChange={(e) => setScheduledFor(new Date(e.target.value))}
                  min={new Date().toISOString().slice(0, 16)}
                />
              </div>
              {error && (
                <div className="p-3 bg-red-900/50 border border-red-500 rounded-lg text-sm text-red-200">
                  {error}
                </div>
              )}
            </div>
          </div>
          <div className="p-4 border-t border-gray-700 flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white focus:outline-none"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {isSaving ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
