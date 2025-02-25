"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { useSession } from "next-auth/react";
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  List,
  ChevronDown,
} from "lucide-react";
import Image from "next/image";
import { PlatformIcon } from "../../components/admin/marketing-modal/platforms/PlatformIcon";
import type { Platform } from "../../components/admin/marketing-modal/types";
import { EditPostModal } from "../../components/admin/scheduled/EditPostModal";
import { Post, ScheduledPost } from "../../components/admin/scheduled/types";

interface ImageAsset {
  asset: string;
  displayUrl: string;
}

function canDeletePost(status: ScheduledPost["status"]) {
  return status === "scheduled" || status === "failed";
}

function canEditPost(status: ScheduledPost["status"]) {
  return status === "scheduled" || status === "failed";
}

interface PostPreviewModalProps {
  post: ScheduledPost;
  onClose: () => void;
  onDelete: (postId: string) => void;
  onEdit: (post: ScheduledPost) => void;
  onSave: (updatedPost: Post) => void;
}

function getStatusBadgeClass(status: ScheduledPost["status"]) {
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
}

interface ScheduledPostsPageProps {
  initialPosts: ScheduledPost[];
}

interface UserFilterProps {
  users: ScheduledPost["user"][];
  selectedUsers: string[];
  onUserChange: (userIds: string[]) => void;
}

function UserFilter({ users, selectedUsers, onUserChange }: UserFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        filterRef.current &&
        !filterRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleUser = (userId: string) => {
    const newSelectedUsers = selectedUsers.includes(userId)
      ? selectedUsers.filter((id) => id !== userId)
      : [...selectedUsers, userId];
    onUserChange(newSelectedUsers);
  };

  const selectAll = () => {
    onUserChange(users.map((user) => user.id));
  };

  const selectNone = () => {
    onUserChange([]);
  };

  return (
    <div className="relative" ref={filterRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-2 py-1 bg-gray-700 rounded-md text-sm text-gray-200 hover:bg-gray-600"
      >
        <span>Users</span>
        <ChevronDown className="w-4 h-4" />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-64 bg-gray-800 rounded-lg shadow-lg border border-gray-700 z-10">
          <div className="p-2 border-b border-gray-700 flex justify-between">
            <button
              onClick={selectAll}
              className="text-xs text-gray-400 hover:text-white"
            >
              Select All
            </button>
            <button
              onClick={selectNone}
              className="text-xs text-gray-400 hover:text-white"
            >
              Clear
            </button>
          </div>
          <div className="max-h-48 overflow-y-auto">
            {users.map((user) => (
              <label
                key={user.id}
                className="flex items-center space-x-2 p-2 hover:bg-gray-700 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selectedUsers.includes(user.id)}
                  onChange={() => toggleUser(user.id)}
                  className="rounded border-gray-600 text-indigo-600 focus:ring-indigo-500 bg-gray-700"
                />
                <div className="flex items-center space-x-2">
                  {user.image ? (
                    <div className="relative w-6 h-6">
                      <Image
                        src={user.image}
                        alt={user.name}
                        width={24}
                        height={24}
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
                      <div className="fallback-avatar hidden w-6 h-6 rounded-full bg-gray-600 flex items-center justify-center absolute top-0 left-0">
                        <span className="text-xs text-white">
                          {user.name.charAt(0)}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-gray-600 flex items-center justify-center">
                      <span className="text-xs text-white">
                        {user.name.charAt(0)}
                      </span>
                    </div>
                  )}
                  <span className="text-sm text-gray-200">{user.name}</span>
                </div>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

interface StatusFilterProps {
  selectedStatus: ScheduledPost["status"] | "all";
  onStatusChange: (status: ScheduledPost["status"] | "all") => void;
}

function StatusFilter({ selectedStatus, onStatusChange }: StatusFilterProps) {
  return (
    <select
      value={selectedStatus}
      onChange={(e) =>
        onStatusChange(e.target.value as ScheduledPost["status"] | "all")
      }
      className="bg-gray-700 text-white rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
    >
      <option value="all">All Posts</option>
      <option value="scheduled">Scheduled</option>
      <option value="posted">Posted</option>
      <option value="failed">Failed</option>
    </select>
  );
}

interface ListViewProps {
  posts: ScheduledPost[];
  onSelectPost: (post: ScheduledPost) => void;
  onDelete: (postId: string) => void;
  onRetry: (postId: string) => void;
}

function ListView({ posts, onSelectPost, onDelete, onRetry }: ListViewProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage, setPostsPerPage] = useState(10);

  const sortedPosts = useMemo(() => {
    return [...posts].sort((a, b) => {
      return (
        new Date(b.scheduledFor).getTime() - new Date(a.scheduledFor).getTime()
      );
    });
  }, [posts]);

  // Calculate pagination
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = sortedPosts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(sortedPosts.length / postsPerPage);

  // Add state for delete confirmation
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [postToDelete, setPostToDelete] = useState<string | null>(null);

  // Handle delete click
  const handleDeleteClick = (postId: string) => {
    setPostToDelete(postId);
    setShowDeleteConfirm(true);
    setDeleteConfirmText("");
  };

  // Handle confirm delete
  const handleConfirmDelete = () => {
    if (deleteConfirmText === "DELETE" && postToDelete) {
      onDelete(postToDelete);
      setShowDeleteConfirm(false);
      setPostToDelete(null);
      setDeleteConfirmText("");
    }
  };

  // Handle cancel delete
  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
    setPostToDelete(null);
    setDeleteConfirmText("");
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Handle posts per page change
  const handlePostsPerPageChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setPostsPerPage(Number(e.target.value));
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden">
      <div className="divide-y divide-gray-700">
        {currentPosts.map((post) => (
          <div
            key={post.id}
            className="p-4 hover:bg-gray-700/50 flex items-start justify-between gap-4"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                {post.user.image ? (
                  <div className="relative w-6 h-6">
                    <Image
                      src={post.user.image}
                      alt={post.user.name}
                      width={24}
                      height={24}
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
                    <div className="fallback-avatar hidden w-6 h-6 rounded-full bg-gray-600 flex items-center justify-center absolute top-0 left-0">
                      <span className="text-xs text-white">
                        {post.user.name.charAt(0)}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="w-6 h-6 rounded-full bg-gray-600 flex items-center justify-center">
                    <span className="text-xs text-white">
                      {post.user.name.charAt(0)}
                    </span>
                  </div>
                )}
                <span className="text-sm text-gray-300">{post.user.name}</span>
                <span className="text-gray-500">•</span>
                <PlatformIcon
                  platform={post.metadata.platform as Platform}
                  className="w-4 h-4"
                />
                <span
                  className={`px-2 py-0.5 rounded-full text-xs ${getStatusBadgeClass(
                    post.status,
                  )}`}
                >
                  {post.status}
                  {post.status === "failed" && post.errorMessage && (
                    <span className="relative group">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className="w-3.5 h-3.5 ml-1 inline-block"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <div className="absolute left-0 top-full mt-1 w-64 p-2 bg-gray-900 text-xs text-red-200 rounded shadow-lg border border-red-500/30 opacity-0 group-hover:opacity-100 transition-opacity z-[100] pointer-events-none">
                        <div className="absolute top-[-6px] left-4 w-3 h-3 bg-gray-900 border-l border-t border-red-500/30 transform rotate-45"></div>
                        <p className="font-medium text-red-300 mb-1">Error:</p>
                        <p>{post.errorMessage}</p>
                      </div>
                    </span>
                  )}
                </span>
              </div>
              <div className="text-sm text-gray-300 mb-2">{post.content}</div>
              <div className="text-xs text-gray-400">
                Scheduled for{" "}
                {new Date(post.scheduledFor).toLocaleString(undefined, {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => onSelectPost(post)}
                className="p-1.5 rounded-full hover:bg-gray-700 text-gray-400 hover:text-white transition-colors"
                title="View Post"
              >
                {post.status === "posted" ? (
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
                      d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                ) : (
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
                      d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                    />
                  </svg>
                )}
              </button>
              {canDeletePost(post.status) && (
                <button
                  onClick={() => handleDeleteClick(post.id)}
                  className="p-1.5 rounded-full hover:bg-red-900/30 text-red-400 hover:text-red-300 transition-colors"
                  title="Delete Post"
                >
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
                      d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                    />
                  </svg>
                </button>
              )}
              {post.status === "failed" && (
                <button
                  onClick={() => onRetry(post.id)}
                  className="p-1.5 rounded-full hover:bg-green-900/30 text-green-400 hover:text-green-300 transition-colors"
                  title="Retry Failed Post"
                >
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
                      d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
                    />
                  </svg>
                </button>
              )}
            </div>
          </div>
        ))}
        {sortedPosts.length === 0 && (
          <div className="p-8 text-center text-gray-400">No posts found</div>
        )}
      </div>

      {/* Pagination controls */}
      {sortedPosts.length > 0 && (
        <div className="bg-gray-800 border-t border-gray-700 p-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-400">
              Showing {indexOfFirstPost + 1}-
              {Math.min(indexOfLastPost, sortedPosts.length)} of{" "}
              {sortedPosts.length} posts
            </span>
            <select
              value={postsPerPage}
              onChange={handlePostsPerPageChange}
              className="bg-gray-700 text-white rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value={5}>5 per page</option>
              <option value={10}>10 per page</option>
              <option value={25}>25 per page</option>
              <option value={50}>50 per page</option>
            </select>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => handlePageChange(1)}
              disabled={currentPage === 1}
              className="p-1 rounded-md bg-gray-700 text-gray-300 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="First page"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-5 h-5"
              >
                <path
                  fillRule="evenodd"
                  d="M15.79 14.77a.75.75 0 01-1.06.02l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 111.04 1.08L11.832 10l3.938 3.71a.75.75 0 01.02 1.06zm-6 0a.75.75 0 01-1.06.02l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 111.04 1.08L5.832 10l3.938 3.71a.75.75 0 01.02 1.06z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-1 rounded-md bg-gray-700 text-gray-300 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Previous page"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-5 h-5"
              >
                <path
                  fillRule="evenodd"
                  d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z"
                  clipRule="evenodd"
                />
              </svg>
            </button>

            {/* Page numbers */}
            <div className="flex items-center">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                // Show pages around current page
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }

                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`w-8 h-8 flex items-center justify-center rounded-md text-sm ${
                      currentPage === pageNum
                        ? "bg-indigo-600 text-white"
                        : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-1 rounded-md bg-gray-700 text-gray-300 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Next page"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-5 h-5"
              >
                <path
                  fillRule="evenodd"
                  d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            <button
              onClick={() => handlePageChange(totalPages)}
              disabled={currentPage === totalPages}
              className="p-1 rounded-md bg-gray-700 text-gray-300 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Last page"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-5 h-5"
              >
                <path
                  fillRule="evenodd"
                  d="M4.21 14.77a.75.75 0 01.02-1.06L8.168 10 4.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02zm6 0a.75.75 0 01.02-1.06L14.168 10 10.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* No posts message */}
      {sortedPosts.length === 0 && (
        <div className="p-8 text-center">
          <p className="text-gray-400">No posts found matching your filters.</p>
        </div>
      )}

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
}

export default function ScheduledPostsPageClient({
  initialPosts,
}: ScheduledPostsPageProps) {
  const { data: session } = useSession();
  const [posts, setPosts] = useState<ScheduledPost[]>(initialPosts);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedPost, setSelectedPost] = useState<ScheduledPost | null>(null);
  const [view, setView] = useState<"calendar" | "list">("calendar");
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<
    ScheduledPost["status"] | "all"
  >("all");

  // Get unique users from posts
  const users = useMemo(() => {
    const uniqueUsers = new Map();
    posts.forEach((post) => {
      if (!uniqueUsers.has(post.user.id)) {
        uniqueUsers.set(post.user.id, post.user);
      }
    });
    return Array.from(uniqueUsers.values());
  }, [posts]);

  // Set current user as default selected user when posts load
  useEffect(() => {
    if (
      session?.user?.email &&
      posts.length > 0 &&
      selectedUsers.length === 0
    ) {
      const currentUser = posts.find(
        (post) => post.user.email === session.user?.email,
      );
      if (currentUser) {
        setSelectedUsers([currentUser.user.id]);
      }
    }
  }, [posts, session?.user?.email, selectedUsers.length]);

  // Filter posts by selected users and status
  const filteredPosts = useMemo(() => {
    let filtered = posts;

    // Filter by users
    if (selectedUsers.length > 0) {
      filtered = filtered.filter((post) =>
        selectedUsers.includes(post.user.id),
      );
    }

    // Filter by status
    if (selectedStatus !== "all") {
      filtered = filtered.filter((post) => post.status === selectedStatus);
    }

    return filtered;
  }, [posts, selectedUsers, selectedStatus]);

  const handleDelete = async (postId: string) => {
    const post = posts.find((p) => p.id === postId);
    if (!post) return;

    if (!canDeletePost(post.status)) {
      alert("Only scheduled or failed posts can be deleted.");
      return;
    }

    try {
      const response = await fetch(`/api/admin/scheduled-posts/${postId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete post");
      }

      // Close the modal if a post is currently selected
      setSelectedPost(null);

      // Remove the deleted post from the state
      setPosts(posts.filter((p) => p.id !== postId));
    } catch (error) {
      console.error("Error deleting post:", error);
      alert("Failed to delete post. Please try again.");
    }
  };

  const handleSaveEdit = async (
    post: ScheduledPost,
    content: string,
    scheduledFor: Date,
  ) => {
    if (!canEditPost(post.status)) {
      alert("Only scheduled or failed posts can be edited.");
      return;
    }

    try {
      const response = await fetch(`/api/admin/scheduled-posts/${post.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content,
          scheduledFor: scheduledFor.toISOString(),
          metadata: post.metadata,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update post");
      }

      // Update the post in the local state
      setPosts(
        posts.map((p) =>
          p.id === post.id
            ? {
                ...p,
                content,
                scheduledFor: scheduledFor.toISOString(),
                metadata: post.metadata,
              }
            : p,
        ),
      );

      // Close the edit modal
      setSelectedPost(null);
    } catch (error) {
      console.error("Error updating post:", error);
      throw new Error("Failed to save changes. Please try again.");
    }
  };

  const handleRetry = async (postId: string) => {
    try {
      const response = await fetch(`/api/admin/scheduled-posts/${postId}`, {
        method: "PUT",
      });

      if (!response.ok) {
        throw new Error("Failed to retry post");
      }

      const { post } = await response.json();

      // Update the post in the local state
      setPosts(
        posts.map((p) =>
          p.id === postId
            ? {
                ...p,
                status: "scheduled",
                errorMessage: null,
                updatedAt: post.updatedAt,
              }
            : p,
        ),
      );

      alert("Post has been rescheduled successfully!");
    } catch (error) {
      console.error("Error retrying post:", error);
      alert("Failed to retry post. Please try again.");
    }
  };

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const formatDate = (date: Date) => {
    return date.toLocaleString("default", { month: "long", year: "numeric" });
  };

  const getPostsForDay = (day: number) => {
    return filteredPosts.filter((post) => {
      const postDate = new Date(post.scheduledFor);
      return (
        postDate.getDate() === day &&
        postDate.getMonth() === currentDate.getMonth() &&
        postDate.getFullYear() === currentDate.getFullYear()
      );
    });
  };

  const handlePrevMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1),
    );
  };

  const handleNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1),
    );
  };

  if (isLoading) {
    return (
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-700 rounded w-1/4 mb-4"></div>
            <div className="h-96 bg-gray-700 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-white">Scheduled Posts</h1>
          <div className="flex items-center space-x-4">
            <UserFilter
              users={users}
              selectedUsers={selectedUsers}
              onUserChange={setSelectedUsers}
            />
            <StatusFilter
              selectedStatus={selectedStatus}
              onStatusChange={setSelectedStatus}
            />
            <div className="flex items-center space-x-2 bg-gray-800 rounded-lg p-1">
              <button
                onClick={() => setView("calendar")}
                className={`p-2 rounded-md flex items-center space-x-2 ${
                  view === "calendar"
                    ? "bg-gray-700 text-white"
                    : "text-gray-400 hover:text-white hover:bg-gray-700/50"
                }`}
              >
                <Calendar className="w-4 h-4" />
                <span className="text-sm">Calendar</span>
              </button>
              <button
                onClick={() => setView("list")}
                className={`p-2 rounded-md flex items-center space-x-2 ${
                  view === "list"
                    ? "bg-gray-700 text-white"
                    : "text-gray-400 hover:text-white hover:bg-gray-700/50"
                }`}
              >
                <List className="w-4 h-4" />
                <span className="text-sm">List</span>
              </button>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-900/50 border border-red-500 rounded-md">
            <p className="text-sm text-red-200">{error}</p>
          </div>
        )}

        {view === "calendar" ? (
          <div className="bg-gray-800 rounded-lg overflow-hidden">
            <div className="p-3 border-b border-gray-700 flex items-center justify-between">
              <button
                onClick={handlePrevMonth}
                className="p-1 hover:bg-gray-700 rounded-full"
              >
                <ChevronLeft className="w-4 h-4 text-gray-400" />
              </button>
              <h2 className="text-lg font-medium text-white">
                {formatDate(currentDate)}
              </h2>
              <button
                onClick={handleNextMonth}
                className="p-1 hover:bg-gray-700 rounded-full"
              >
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </button>
            </div>

            <div className="grid grid-cols-7 text-center border-b border-gray-700">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div
                  key={day}
                  className="py-1 text-xs font-medium text-gray-400"
                >
                  {day}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 text-center">
              {Array.from({ length: 42 }, (_, i) => {
                const dayNumber = i - getFirstDayOfMonth(currentDate) + 1;
                const isCurrentMonth =
                  dayNumber > 0 && dayNumber <= getDaysInMonth(currentDate);
                const dayPosts = isCurrentMonth
                  ? getPostsForDay(dayNumber)
                  : [];
                const isToday =
                  isCurrentMonth &&
                  dayNumber === new Date().getDate() &&
                  currentDate.getMonth() === new Date().getMonth() &&
                  currentDate.getFullYear() === new Date().getFullYear();

                return (
                  <div
                    key={i}
                    className={`min-h-[80px] p-1 border-r border-b border-gray-700 ${
                      isCurrentMonth ? "bg-gray-800" : "bg-gray-900/50"
                    } ${isToday ? "ring-1 ring-inset ring-indigo-500" : ""}`}
                  >
                    {isCurrentMonth && (
                      <>
                        <span
                          className={`text-xs ${isToday ? "text-indigo-400 font-medium" : "text-gray-400"}`}
                        >
                          {dayNumber}
                        </span>
                        <div className="mt-1 space-y-0.5">
                          {dayPosts.map((post) => (
                            <button
                              key={post.id}
                              onClick={() => setSelectedPost(post)}
                              className="w-full text-left px-1 py-0.5 rounded text-xs hover:bg-gray-700 flex items-center space-x-1"
                            >
                              <div className="flex items-center space-x-1">
                                {post.user.image ? (
                                  <div className="relative w-4 h-4">
                                    <Image
                                      src={post.user.image}
                                      alt={post.user.name}
                                      width={24}
                                      height={24}
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
                                    <div className="fallback-avatar hidden w-4 h-4 rounded-full bg-gray-600 flex items-center justify-center absolute top-0 left-0">
                                      <span className="text-[8px] text-white">
                                        {post.user.name.charAt(0)}
                                      </span>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="w-4 h-4 rounded-full bg-gray-600 flex items-center justify-center">
                                    <span className="text-[8px] text-white">
                                      {post.user.name.charAt(0)}
                                    </span>
                                  </div>
                                )}
                                <PlatformIcon
                                  platform={post.metadata.platform as Platform}
                                  className="w-3 h-3"
                                />
                              </div>
                              <span
                                className={`px-1 rounded-sm text-[10px] ${getStatusBadgeClass(post.status)}`}
                              >
                                {new Date(post.scheduledFor).toLocaleTimeString(
                                  [],
                                  { hour: "2-digit", minute: "2-digit" },
                                )}
                                {post.status === "failed" &&
                                  post.errorMessage && (
                                    <span className="relative group">
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                        className="w-3 h-3 ml-0.5 inline-block"
                                      >
                                        <path
                                          fillRule="evenodd"
                                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z"
                                          clipRule="evenodd"
                                        />
                                      </svg>
                                      <div className="absolute left-0 top-full mt-1 w-64 p-2 bg-gray-900 text-xs text-red-200 rounded shadow-lg border border-red-500/30 opacity-0 group-hover:opacity-100 transition-opacity z-[100] pointer-events-none">
                                        <div className="absolute top-[-6px] left-4 w-3 h-3 bg-gray-900 border-l border-t border-red-500/30 transform rotate-45"></div>
                                        <p className="font-medium text-red-300 mb-1">
                                          Error:
                                        </p>
                                        <p>{post.errorMessage}</p>
                                      </div>
                                    </span>
                                  )}
                              </span>
                            </button>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <ListView
            posts={filteredPosts}
            onSelectPost={setSelectedPost}
            onDelete={handleDelete}
            onRetry={handleRetry}
          />
        )}
      </div>

      {selectedPost && (
        <EditPostModal
          post={selectedPost}
          onClose={() => setSelectedPost(null)}
          onSave={handleSaveEdit}
          onDelete={handleDelete}
          onRetry={handleRetry}
        />
      )}
    </div>
  );
}
