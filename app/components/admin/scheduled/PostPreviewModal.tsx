import Image from "next/image";
import { useState, useEffect } from "react";
import { PlatformIcon } from "../marketing-modal/platforms/PlatformIcon";
import { Platform } from "../marketing-modal/types";
import { HackerNewsContent } from "../marketing-modal/platforms/HackerNewsContent";
import { TwitterContent } from "../marketing-modal/platforms/TwitterContent";
import { LinkedInContent } from "../marketing-modal/platforms/LinkedInContent";
import { HackerNewsEditor } from "../marketing-modal/platforms/HackerNewsEditor";
import { TwitterEditor } from "../marketing-modal/platforms/TwitterEditor";
import { LinkedInEditor } from "../marketing-modal/platforms/LinkedInEditor";
import { Post } from "./types";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface User {
  name: string;
  email: string;
  image?: string;
}

interface PostPreviewModalProps {
  post: Post;
  onClose: () => void;
  onDelete: (id: string) => void;
  onEdit: (post: Post) => void;
  onSave?: (post: Post) => void;
}

const getStatusBadgeClass = (status: string) => {
  switch (status) {
    case "scheduled":
      return "bg-blue-500/20 text-blue-200";
    case "posted":
      return "bg-green-500/20 text-green-200";
    case "failed":
      return "bg-red-500/20 text-red-200";
    default:
      return "bg-gray-500/20 text-gray-200";
  }
};

const canEditPost = (status: string) => {
  return status === "scheduled" || status === "failed";
};

const canDeletePost = (status: string) => {
  return status === "scheduled" || status === "failed";
};

const PostPreviewModal = ({
  post,
  onClose,
  onDelete,
  onEdit,
  onSave,
}: PostPreviewModalProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(post.content);
  const [editedUrl, setEditedUrl] = useState(
    post.metadata.pageContext?.url || "",
  );
  const [imageAssets, setImageAssets] = useState(
    post.metadata.imageAssets || [],
  );
  const [isUploading, setIsUploading] = useState(false);
  const [scheduledFor, setScheduledFor] = useState(new Date(post.scheduledFor));
  const [scheduledTimeError, setScheduledTimeError] = useState<string | null>(
    null,
  );

  // Add state for delete confirmation dialog
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");

  // Reset editing state if post status changes to "posted"
  useEffect(() => {
    if (post.status === "posted" && isEditing) {
      setIsEditing(false);
    }
  }, [post.status, isEditing]);

  const handleContentChange = (content: string) => {
    setEditedContent(content);
  };

  const handleUrlChange = (url: string) => {
    setEditedUrl(url);
  };

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (!event.target.files?.length) return;

    const file = event.target.files[0];
    setIsUploading(true);
    try {
      const formData = new FormData();

      // Use platform-specific upload endpoints
      let uploadUrl = "";

      if (post.metadata.platform === "twitter") {
        formData.append("image", file);
        uploadUrl = "/api/admin/twitter/upload-image";
      } else if (post.metadata.platform === "linkedin") {
        formData.append("image", file);
        uploadUrl = "/api/admin/linkedin/upload-image";
      } else {
        // If not Twitter or LinkedIn, we don't support image uploads
        throw new Error(
          `Image uploads not supported for ${post.metadata.platform}`,
        );
      }

      const response = await fetch(uploadUrl, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Failed to upload image to ${post.metadata.platform}`);
      }

      const data = await response.json();

      setImageAssets([
        ...imageAssets,
        {
          asset: data.asset,
          displayUrl: data.displayUrl,
        },
      ]);
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Failed to upload image. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleImageRemove = (index: number) => {
    setImageAssets(imageAssets.filter((_, i) => i !== index));
  };

  const validateScheduledTime = () => {
    // Validate that the scheduled date is at least 5 minutes in the future
    const currentTime = new Date();
    const fiveMinutesFromNow = new Date(currentTime.getTime() + 5 * 60 * 1000);

    if (scheduledFor <= fiveMinutesFromNow) {
      setScheduledTimeError(
        `Scheduled time must be at least 5 minutes in the future. Your current timezone is ${Intl.DateTimeFormat().resolvedOptions().timeZone}.`,
      );
      return false;
    }

    setScheduledTimeError(null);
    return true;
  };

  const handleSaveChanges = () => {
    // Don't allow saving changes for posted posts
    if (post.status === "posted") return;

    // Validate the scheduled time
    if (!validateScheduledTime()) {
      return;
    }

    const updatedPost: Post = {
      ...post,
      content: editedContent,
      scheduledFor: scheduledFor.toISOString(),
      metadata: {
        ...post.metadata,
        pageContext: {
          ...post.metadata.pageContext,
          url: editedUrl,
          title: post.metadata.pageContext?.title || "",
          description: post.metadata.pageContext?.description || "",
        },
        imageAssets,
        scheduledInTimezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      },
    };

    onSave?.(updatedPost);
    setIsEditing(false);
  };

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = () => {
    if (deleteConfirmText === "DELETE") {
      onDelete(post.id);
      setShowDeleteConfirm(false);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
    setDeleteConfirmText("");
  };

  const renderEditor = () => {
    const handleImageUploadWrapper = (
      event: React.ChangeEvent<HTMLInputElement>,
    ) => {
      handleImageUpload(event);
    };

    switch (post.metadata.platform) {
      case "twitter":
        return (
          <div className="h-full">
            <TwitterEditor
              content={editedContent}
              imageAssets={imageAssets}
              isUploading={isUploading}
              onContentChange={handleContentChange}
              onImageUpload={handleImageUploadWrapper}
              onImageRemove={handleImageRemove}
            />
          </div>
        );
      case "linkedin":
        return (
          <div className="h-full">
            <LinkedInEditor
              content={editedContent}
              imageAssets={imageAssets}
              isUploading={isUploading}
              onContentChange={handleContentChange}
              onImageUpload={handleImageUploadWrapper}
              onImageRemove={handleImageRemove}
            />
          </div>
        );
      case "hackernews":
        return (
          <div className="h-full">
            <HackerNewsEditor
              content={editedContent}
              onContentChange={handleContentChange}
              url={editedUrl}
              onUrlChange={handleUrlChange}
            />
          </div>
        );
      default:
        return (
          <div className="h-full flex flex-col">
            <textarea
              value={editedContent}
              onChange={(e) => handleContentChange(e.target.value)}
              className="w-full flex-1 min-h-[400px] bg-gray-800 border border-gray-700 rounded-lg p-4 text-white"
              placeholder="Enter your post content..."
            />
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-lg shadow-xl w-full max-w-2xl h-[80vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <PlatformIcon
              platform={post.metadata.platform}
              className="w-6 h-6"
            />
            <h2 className="text-xl font-semibold text-white">
              {isEditing ? "Edit Post" : "Post Preview"}
            </h2>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white"
              aria-label="Close"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {isEditing && post.status !== "posted" && (
            <div className="bg-[#1e2732] p-6 border-b border-gray-800">
              <h3 className="text-xl font-semibold text-white mb-4">
                Schedule Your Post
              </h3>

              <div className="mb-2">
                <label className="block text-lg font-medium text-white mb-2">
                  Scheduled For
                </label>
                <div className="relative">
                  <DatePicker
                    selected={scheduledFor}
                    onChange={(date: Date | null) =>
                      date && setScheduledFor(date)
                    }
                    showTimeSelect
                    timeFormat="HH:mm"
                    timeIntervals={15}
                    dateFormat="MMMM d, yyyy h:mm a"
                    className="w-full bg-[#1e2732] border border-gray-700 rounded-md px-4 py-3 text-white text-lg focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                    popperClassName="react-datepicker-dark"
                    calendarClassName="bg-gray-800 border-gray-700"
                    dayClassName={(date) =>
                      date.getDate() === scheduledFor.getDate() &&
                      date.getMonth() === scheduledFor.getMonth() &&
                      date.getFullYear() === scheduledFor.getFullYear()
                        ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                        : "text-white hover:bg-gray-700"
                    }
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 9v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z"
                      />
                    </svg>
                  </div>
                </div>
                <p className="mt-2 text-indigo-300 text-sm">
                  Posts must be scheduled at least 5 minutes in the future
                </p>
              </div>
            </div>
          )}

          {scheduledTimeError && (
            <div className="m-4 p-3 bg-red-900/30 border border-red-800 rounded text-red-200 text-sm">
              {scheduledTimeError}
            </div>
          )}

          {!isEditing && (
            <div className="px-4 py-3 border-b border-gray-800">
              <div className="flex items-center space-x-2">
                {post.user.image ? (
                  <div className="relative w-8 h-8">
                    <Image
                      src={post.user.image}
                      alt={post.user.name || "User"}
                      width={32}
                      height={32}
                      className="rounded-full"
                      unoptimized
                      onError={(e) => {
                        // When image fails to load, replace with fallback
                        e.currentTarget.style.display = "none";
                        e.currentTarget.parentElement
                          .querySelector(".fallback-avatar")
                          ?.classList.remove("hidden");
                      }}
                    />
                    <div className="fallback-avatar hidden w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center absolute top-0 left-0 text-white font-medium">
                      {post.user.name ? post.user.name.charAt(0) : "U"}
                    </div>
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-white font-medium">
                    {post.user.name ? post.user.name.charAt(0) : "U"}
                  </div>
                )}
                <div>
                  <div className="font-medium text-white">{post.user.name}</div>
                  <div className="flex items-center text-xs text-gray-400 space-x-2">
                    <span>
                      {post.metadata.platform === "twitter"
                        ? "X"
                        : post.metadata.platform.charAt(0).toUpperCase() +
                          post.metadata.platform.slice(1)}
                    </span>
                    <span>•</span>
                    <span className={getStatusBadgeClass(post.status)}>
                      {post.status}
                    </span>
                    <span>•</span>
                    <span>
                      {post.status === "posted" ? "Posted on" : "Scheduled for"}{" "}
                      {new Date(post.scheduledFor).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="p-4 h-full">
            {isEditing ? (
              <div className="h-full flex flex-col">{renderEditor()}</div>
            ) : (
              <div className="h-full">
                {post.metadata.platform === "twitter" ? (
                  <TwitterContent
                    content={post.content}
                    imageAssets={post.metadata.imageAssets || []}
                    pageContext={{
                      url: post.metadata.pageContext?.url || "",
                      title: post.metadata.pageContext?.title || "",
                      description: post.metadata.pageContext?.description || "",
                    }}
                    isPreview={true}
                  />
                ) : post.metadata.platform === "linkedin" ? (
                  <LinkedInContent
                    content={post.content}
                    imageAssets={post.metadata.imageAssets || []}
                    pageContext={{
                      url: post.metadata.pageContext?.url || "",
                      title: post.metadata.pageContext?.title || "",
                      description: post.metadata.pageContext?.description || "",
                    }}
                    isPreview={true}
                  />
                ) : post.metadata.platform === "hackernews" ? (
                  <HackerNewsContent
                    content={post.content}
                    pageContext={{
                      url: post.metadata.pageContext?.url || "",
                      title: post.metadata.pageContext?.title || "",
                      description: post.metadata.pageContext?.description || "",
                    }}
                    isPreview={true}
                  />
                ) : (
                  <div className="whitespace-pre-wrap text-white">
                    {post.content}
                    {post.metadata.platform === "hackernews" &&
                      post.metadata.pageContext?.url && (
                        <div className="mt-4">
                          <a
                            href={post.metadata.pageContext.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-orange-500 hover:underline"
                          >
                            {post.metadata.pageContext.url}
                          </a>
                        </div>
                      )}
                    {post.metadata.imageAssets &&
                      post.metadata.imageAssets.length > 0 && (
                        <div className="mt-4 grid grid-cols-2 gap-2">
                          {post.metadata.imageAssets.map((image, index) => (
                            <div
                              key={index}
                              className="relative aspect-video bg-gray-800 rounded overflow-hidden"
                            >
                              <Image
                                src={image.displayUrl}
                                alt="Post image"
                                fill
                                className="object-cover"
                              />
                            </div>
                          ))}
                        </div>
                      )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Footer - Only show for posts that can be edited or deleted */}
        {(canEditPost(post.status) || isEditing) && (
          <div className="p-5 border-t border-gray-800 flex justify-between">
            {/* Add delete button to the left side of the footer */}
            {canDeletePost(post.status) && !isEditing && (
              <div>
                <button
                  onClick={handleDeleteClick}
                  className="px-4 py-2 bg-red-700/30 hover:bg-red-700/40 text-red-300 rounded-md text-base font-medium flex items-center"
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

            {/* Right-aligned action buttons */}
            <div className="flex space-x-4">
              {isEditing ? (
                <>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-md text-base font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveChanges}
                    className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-md text-base font-medium"
                  >
                    Save Changes
                  </button>
                </>
              ) : (
                canEditPost(post.status) && (
                  <button
                    onClick={() => onEdit(post)}
                    className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-md text-base font-medium"
                  >
                    Edit
                  </button>
                )
              )}
            </div>
          </div>
        )}
      </div>

      {/* Delete confirmation dialog */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-[60] bg-black/70 flex items-center justify-center">
          <div className="bg-gray-900 rounded-lg shadow-xl w-full max-w-md p-6">
            <div className="flex items-start mb-4">
              <div className="flex-shrink-0 bg-red-900/30 rounded-full p-2 mr-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6 text-red-400"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white">
                  Delete Post
                </h3>
                <p className="text-gray-300 mt-2">
                  Are you sure you want to delete this post? This action cannot
                  be undone.
                </p>
              </div>
            </div>

            <div className="mb-4">
              <p className="text-sm text-gray-300 mb-2">
                Type <span className="font-bold text-red-400">DELETE</span> to
                confirm:
              </p>
              <input
                type="text"
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="Type DELETE to confirm"
              />
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={handleCancelDelete}
                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={deleteConfirmText !== "DELETE"}
                className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostPreviewModal;
