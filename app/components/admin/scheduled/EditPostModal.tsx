"use client";

import { useState } from "react";
import { TwitterEditor } from "../marketing-modal/platforms/TwitterEditor";
import { LinkedInEditor } from "../marketing-modal/platforms/LinkedInEditor";
import { HackerNewsEditor } from "../marketing-modal/platforms/HackerNewsEditor";
import { validateContent } from "../marketing-modal/platforms/validation";
import { PlatformIcon } from "../marketing-modal/platforms/PlatformIcon";
import type { Platform } from "../marketing-modal/types";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
// Import content preview components
import { TwitterContent } from "../marketing-modal/platforms/TwitterContent";
import { LinkedInContent } from "../marketing-modal/platforms/LinkedInContent";
import { HackerNewsContent } from "../marketing-modal/platforms/HackerNewsContent";
import Image from "next/image";

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
    scheduledInTimezone?: string;
    userEmail?: string;
    userName?: string;
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
  onDelete?: (postId: string) => void;
  onRetry?: (postId: string) => void;
}

export function EditPostModal({
  post,
  onClose,
  onSave,
  onDelete,
  onRetry,
}: EditPostModalProps) {
  const [content, setContent] = useState(post.content);
  const [url, setUrl] = useState(post.metadata.pageContext?.url || "");
  const [scheduledFor, setScheduledFor] = useState(new Date(post.scheduledFor));
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageAssets, setImageAssets] = useState<ImageAsset[]>(
    post.metadata.imageAssets || [],
  );
  const [isPreviewMode, setIsPreviewMode] = useState(true);
  const platform = post.metadata.platform.toLowerCase() as Platform;

  // Add state for delete confirmation dialog
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");

  // Check if post can be edited
  const canEdit = post.status === "scheduled" || post.status === "failed";

  const handleSave = async () => {
    // Validate that the post can be edited
    if (!canEdit) {
      setError("Only scheduled or failed posts can be edited.");
      return;
    }

    // Validate content based on platform
    if (!validateContent(platform, content)) {
      if (platform === "hackernews") {
        setError("Title must be under 80 characters and not contain URLs");
      } else {
        setError("Content exceeds platform's character limit");
      }
      return;
    }

    // For HackerNews, validate URL
    if (platform === "hackernews" && !url) {
      setError("URL is required for Hacker News submissions");
      return;
    }

    // Validate that the scheduled date is in the future
    const currentTime = new Date();
    const fiveMinutesFromNow = new Date(currentTime.getTime() + 5 * 60 * 1000);

    if (scheduledFor <= fiveMinutesFromNow) {
      setError(
        `Scheduled time must be at least 5 minutes in the future. Your current timezone is ${Intl.DateTimeFormat().resolvedOptions().timeZone}.`,
      );
      return;
    }

    try {
      setIsSaving(true);
      setError(null);

      // Create a properly formatted metadata object
      const updatedMetadata = {
        // Start with original metadata as base
        ...post.metadata,
        // Override with updated values
        platform: platform,
        pageContext: {
          ...(post.metadata.pageContext || {}),
          url:
            platform === "hackernews"
              ? url
              : post.metadata.pageContext?.url || "",
          title: post.metadata.pageContext?.title || "",
        },
        imageAssets: imageAssets,
        scheduledInTimezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        userEmail: post.metadata.userEmail || "",
        userName: post.metadata.userName || "",
      };

      // Ensure the date is properly formatted as ISO string
      const formattedScheduledFor = scheduledFor.toISOString();

      console.log("Saving post with date:", {
        original: scheduledFor,
        formatted: formattedScheduledFor,
        currentTime: currentTime.toISOString(),
        fiveMinutesFromNow: fiveMinutesFromNow.toISOString(),
        isInFuture: scheduledFor > fiveMinutesFromNow,
        userTimezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      });

      // Update the post with the new metadata
      const updatedPost = {
        ...post,
        content,
        scheduledFor: formattedScheduledFor,
        metadata: updatedMetadata,
      };

      await onSave(updatedPost, content, scheduledFor);
      onClose();
    } catch (err) {
      console.error("Error saving post:", err);
      setError(err instanceof Error ? err.message : "Failed to save changes");
    } finally {
      setIsSaving(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;

    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await fetch(`/api/admin/${platform}/upload-image`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload image");
      }

      const { asset, displayUrl } = await response.json();
      setImageAssets([...imageAssets, { asset, displayUrl }]);
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Failed to upload image. Please try again.");
    }
  };

  const handleImageRemove = (index: number) => {
    setImageAssets(imageAssets.filter((_, i) => i !== index));
  };

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = () => {
    if (deleteConfirmText === "DELETE" && onDelete) {
      onDelete(post.id);
      setShowDeleteConfirm(false);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
    setDeleteConfirmText("");
  };

  const renderEditor = () => {
    // If in preview mode, show the appropriate preview component
    if (isPreviewMode) {
      switch (platform) {
        case "twitter":
          return (
            <div className="h-[350px] overflow-y-auto">
              <TwitterContent
                content={content}
                imageAssets={imageAssets}
                pageContext={{
                  url: post.metadata.pageContext?.url || "",
                  title: post.metadata.pageContext?.title || "",
                  description: post.metadata.pageContext?.description || "",
                }}
                isPreview
              />
            </div>
          );
        case "linkedin":
          return (
            <div className="h-[350px] overflow-y-auto">
              <LinkedInContent
                content={content}
                imageAssets={imageAssets}
                pageContext={{
                  url: post.metadata.pageContext?.url || "",
                  title: post.metadata.pageContext?.title || "",
                  description: post.metadata.pageContext?.description || "",
                }}
                isPreview
              />
            </div>
          );
        case "hackernews":
          return (
            <div className="h-[350px] overflow-y-auto">
              <HackerNewsContent
                content={content}
                pageContext={{
                  url: url || post.metadata.pageContext?.url || "",
                  title: post.metadata.pageContext?.title || "",
                  description: post.metadata.pageContext?.description || "",
                }}
                isPreview
              />
            </div>
          );
        default:
          return (
            <div className="h-[350px] overflow-y-auto p-4 bg-gray-800 border border-gray-700 rounded-lg text-white">
              {content}
            </div>
          );
      }
    }

    // Original editor code
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
            <HackerNewsEditor
              content={content}
              onContentChange={setContent}
              url={url}
              onUrlChange={setUrl}
            />
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
    <div
      className="fixed inset-0 z-50 overflow-y-auto"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div className="flex min-h-screen items-end justify-center p-4 text-center sm:items-center sm:p-0">
        <div
          className="fixed inset-0 bg-black/50 transition-opacity"
          aria-hidden="true"
          onClick={onClose}
        />
        <div className="relative transform overflow-hidden rounded-lg bg-gray-900 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl max-h-[90vh]">
          <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4 overflow-y-auto max-h-[calc(90vh-8rem)]">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <PlatformIcon platform={platform} className="w-5 h-5" />
                  <div>
                    <h2 className="text-lg font-medium text-white">
                      Edit Post
                    </h2>
                    <div
                      className={`text-xs mt-0.5 px-2 py-0.5 rounded-full inline-block ${
                        post.status === "scheduled"
                          ? "bg-blue-500/20 text-blue-200"
                          : post.status === "posted"
                            ? "bg-green-500/20 text-green-200"
                            : "bg-red-500/20 text-red-200"
                      }`}
                    >
                      {post.status}
                    </div>
                  </div>

                  {/* Preview/Edit toggle button */}
                  {canEdit && (
                    <button
                      onClick={() => setIsPreviewMode(!isPreviewMode)}
                      className="ml-4 px-3 py-1 text-xs rounded bg-gray-700 text-white hover:bg-gray-600 transition-colors flex items-center gap-1"
                    >
                      {isPreviewMode ? (
                        <>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-3.5 h-3.5"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                            />
                          </svg>
                          Edit
                        </>
                      ) : (
                        <>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-3.5 h-3.5"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                          </svg>
                          Preview
                        </>
                      )}
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  {post.status === "posted" ? (
                    <div>
                      <label className="text-sm font-medium text-gray-200 block">
                        Posted on:
                      </label>
                      <p className="text-xs text-green-300">
                        {new Date(post.scheduledFor).toLocaleString(undefined, {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })}
                      </p>
                    </div>
                  ) : (
                    <>
                      <div>
                        <label
                          htmlFor="scheduledFor"
                          className="text-sm font-medium text-gray-200 block"
                        >
                          Scheduled For:
                        </label>
                        <p className="text-xs text-indigo-300">
                          Must be at least 5 min in future
                        </p>
                      </div>
                      <div className="relative">
                        <DatePicker
                          selected={scheduledFor}
                          onChange={(date: Date | null) =>
                            date && setScheduledFor(date)
                          }
                          showTimeSelect
                          timeFormat="h:mm aa"
                          timeIntervals={15}
                          dateFormat="MMM d, yyyy h:mm aa"
                          className="bg-gray-800/80 border border-indigo-500/30 rounded-lg px-2 py-1 text-white text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 w-[180px]"
                          popperClassName="react-datepicker-dark"
                          calendarClassName="bg-gray-800 border-gray-700 text-xs"
                          timeClassName={() => "text-xs"}
                          dayClassName={(date) =>
                            date.getDate() === scheduledFor?.getDate() &&
                            date.getMonth() === scheduledFor?.getMonth() &&
                            date.getFullYear() === scheduledFor?.getFullYear()
                              ? "bg-indigo-600 text-white hover:bg-indigo-700"
                              : "text-white hover:bg-gray-700"
                          }
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                          <svg
                            className="w-4 h-4 text-indigo-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1.5}
                              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Display error message for failed posts at the top */}
              {post.status === "failed" && post.errorMessage && (
                <div className="p-3 bg-red-900/50 border border-red-500 rounded-lg mb-4">
                  <div className="flex items-start">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-5 h-5 text-red-300 mr-2 flex-shrink-0 mt-0.5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                      />
                    </svg>
                    <div>
                      <h4 className="text-sm font-medium text-red-300">
                        Posting Failed
                      </h4>
                      <p className="text-sm text-red-200 mt-1">
                        {post.errorMessage}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-4 mt-4">
                <div className="flex-1">{renderEditor()}</div>

                {error && (
                  <div className="p-3 bg-red-900/50 border border-red-500 rounded-lg text-sm text-red-200">
                    {error}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="bg-gray-800 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
            {canEdit ? (
              <>
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 sm:ml-3 sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
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
                {post.status === "failed" && onRetry && (
                  <button
                    onClick={() => {
                      onRetry(post.id);
                      onClose();
                    }}
                    className="inline-flex w-full justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 sm:ml-3 sm:w-auto"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-4 h-4 mr-1.5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
                      />
                    </svg>
                    Retry Post
                  </button>
                )}
              </>
            ) : null}
            <button
              type="button"
              onClick={onClose}
              className="mt-3 inline-flex w-full justify-center rounded-md bg-gray-700 px-3 py-2 text-sm font-semibold text-gray-300 shadow-sm ring-1 ring-inset ring-gray-600 hover:bg-gray-600 sm:mt-0 sm:w-auto"
            >
              {canEdit ? "Cancel" : "Close"}
            </button>

            {/* Add delete button to the left side of the footer */}
            {canEdit && onDelete && (
              <div className="flex-1 flex justify-start">
                <button
                  onClick={handleDeleteClick}
                  className="mt-3 inline-flex items-center justify-center rounded-md bg-red-700/30 px-3 py-2 text-sm font-semibold text-red-300 shadow-sm ring-1 ring-inset ring-red-600/30 hover:bg-red-700/40 sm:mt-0 sm:w-auto"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-4 h-4 mr-1.5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                    />
                  </svg>
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete confirmation dialog */}
      {showDeleteConfirm && (
        <div
          className="fixed inset-0 z-[60] overflow-y-auto"
          aria-labelledby="modal-title"
          role="dialog"
          aria-modal="true"
        >
          <div className="flex min-h-screen items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <div
              className="fixed inset-0 bg-black/70 transition-opacity"
              aria-hidden="true"
              onClick={handleCancelDelete}
            />
            <div className="relative transform overflow-hidden rounded-lg bg-gray-900 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
              <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-900/30 sm:mx-0 sm:h-10 sm:w-10">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="h-6 w-6 text-red-400"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                      />
                    </svg>
                  </div>
                  <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                    <h3
                      className="text-lg font-medium leading-6 text-white"
                      id="modal-title"
                    >
                      Delete Post
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-300">
                        Are you sure you want to delete this post? This action
                        cannot be undone.
                      </p>
                      <p className="text-sm text-gray-300 mt-2">
                        Type{" "}
                        <span className="font-bold text-red-400">DELETE</span>{" "}
                        to confirm:
                      </p>
                      <input
                        type="text"
                        value={deleteConfirmText}
                        onChange={(e) => setDeleteConfirmText(e.target.value)}
                        className="mt-2 w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                        placeholder="Type DELETE to confirm"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-800 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                <button
                  type="button"
                  onClick={handleConfirmDelete}
                  disabled={deleteConfirmText !== "DELETE"}
                  className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Delete
                </button>
                <button
                  type="button"
                  onClick={handleCancelDelete}
                  className="mt-3 inline-flex w-full justify-center rounded-md bg-gray-700 px-3 py-2 text-sm font-semibold text-gray-300 shadow-sm ring-1 ring-inset ring-gray-600 hover:bg-gray-600 sm:mt-0 sm:w-auto"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
