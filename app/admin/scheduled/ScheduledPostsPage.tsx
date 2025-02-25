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
                    <Image
                      src={user.image}
                      alt={user.name}
                      width={24}
                      height={24}
                      className="rounded-full"
                    />
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
}

function ListView({ posts, onSelectPost, onDelete }: ListViewProps) {
  const sortedPosts = useMemo(() => {
    return [...posts].sort((a, b) => {
      return (
        new Date(b.scheduledFor).getTime() - new Date(a.scheduledFor).getTime()
      );
    });
  }, [posts]);

  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden">
      <div className="divide-y divide-gray-700">
        {sortedPosts.map((post) => (
          <div
            key={post.id}
            className="p-4 hover:bg-gray-700/50 flex items-start justify-between gap-4"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                {post.user.image ? (
                  <Image
                    src={post.user.image}
                    alt={post.user.name}
                    width={24}
                    height={24}
                    className="rounded-full"
                  />
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
                className="text-gray-400 hover:text-white"
              >
                View
              </button>
              {canDeletePost(post.status) && (
                <button
                  onClick={() => onDelete(post.id)}
                  className="text-red-400 hover:text-red-300"
                >
                  Delete
                </button>
              )}
            </div>
          </div>
        ))}
        {sortedPosts.length === 0 && (
          <div className="p-8 text-center text-gray-400">No posts found</div>
        )}
      </div>
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

    if (!confirm("Are you sure you want to delete this scheduled post?")) {
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
                                  <Image
                                    src={post.user.image}
                                    alt={post.user.name}
                                    width={24}
                                    height={24}
                                    className="rounded-full"
                                  />
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
          />
        )}
      </div>

      {selectedPost && (
        <EditPostModal
          post={selectedPost}
          onClose={() => setSelectedPost(null)}
          onSave={handleSaveEdit}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}
