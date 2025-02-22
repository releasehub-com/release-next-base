'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { ChevronLeft, ChevronRight, Calendar, List, ChevronDown } from 'lucide-react';

interface ScheduledPost {
  id: string;
  content: string;
  scheduledFor: string;
  status: 'scheduled' | 'posted' | 'failed';
  errorMessage?: string;
  metadata: {
    platform: string;
    pageContext: {
      title: string;
      url: string;
    };
    imageAssets?: Array<{
      asset: string;
      displayUrl: string;
    }>;
  };
  createdAt: string;
  updatedAt: string;
}

interface PostPreviewModalProps {
  post: ScheduledPost;
  onClose: () => void;
  onDelete: (postId: string) => void;
  onEdit: (post: ScheduledPost) => void;
}

interface EditPostModalProps {
  post: ScheduledPost;
  onClose: () => void;
  onSave: (post: ScheduledPost, content: string, scheduledFor: Date) => Promise<void>;
}

// Helper function for status badge styling
const getStatusBadgeClass = (status: string) => {
  switch (status) {
    case 'scheduled':
      return 'bg-blue-900/50 text-blue-200 border-blue-500';
    case 'posted':
      return 'bg-green-900/50 text-green-200 border-green-500';
    case 'failed':
      return 'bg-red-900/50 text-red-200 border-red-500';
    default:
      return 'bg-gray-900/50 text-gray-200 border-gray-500';
  }
};

function PostPreviewModal({ post, onClose, onDelete, onEdit }: PostPreviewModalProps) {
  const renderLinkedInContent = (content: string) => {
    if (!content) return null;

    // Split content into paragraphs
    const paragraphs = content.split('\n\n').filter(Boolean);

    // Process each paragraph to handle URLs, hashtags, and mentions
    const processedParagraphs = paragraphs.map(paragraph => {
      // Handle URLs - make them blue and underlined
      let processed = paragraph.replace(
        /(?:^|\s)(https?:\/\/[^\s]+)(?=\s|$)/g,
        ' <span class="text-[#0a66c2] underline">$1</span>'
      );

      // Handle hashtags - make them LinkedIn blue
      processed = processed.replace(
        /(?:^|\s)#(\w+)/g,
        ' <span class="text-[#0a66c2]">#$1</span>'
      );

      // Handle mentions - make them LinkedIn blue
      processed = processed.replace(
        /(?:^|\s)@(\w+)/g,
        ' <span class="text-[#0a66c2]">@$1</span>'
      );

      return processed;
    });

    return (
      <div className="space-y-4">
        {processedParagraphs.map((paragraph, i) => (
          <p 
            key={i} 
            className="text-gray-900 whitespace-pre-wrap break-words text-[15px] leading-[20px]"
            dangerouslySetInnerHTML={{ __html: paragraph }}
          />
        ))}
        {/* Show LinkedIn images if any */}
        {post.metadata.imageAssets && post.metadata.imageAssets.length > 0 && (
          <div className={`grid ${post.metadata.imageAssets.length === 1 ? 'grid-cols-1' : 'grid-cols-2'} gap-2 mt-4`}>
            {post.metadata.imageAssets.map((imageAsset, index) => (
              <div key={`preview-${imageAsset.asset}-${index}`} className="relative aspect-[16/9]">
                <img
                  src={imageAsset.displayUrl}
                  alt={`Image ${index + 1}`}
                  className="object-cover rounded-lg w-full h-full"
                />
              </div>
            ))}
          </div>
        )}
        {/* Only show URL preview if no images are attached */}
        {post.metadata.pageContext?.url && (!post.metadata.imageAssets || post.metadata.imageAssets.length === 0) && (
          <div className="mt-4 border border-gray-200 rounded-lg overflow-hidden bg-white">
            {post.metadata.pageContext.url.includes(process.env.NEXT_PUBLIC_BASE_URL || '') && (
              <img 
                src="/og/og-image.png" 
                alt="Article preview" 
                className="w-full h-52 object-cover"
              />
            )}
            <div className="p-3">
              <h3 className="text-[15px] font-medium text-gray-900 line-clamp-2">{post.metadata.pageContext.title}</h3>
              <p className="text-[13px] text-gray-400 mt-1">{new URL(post.metadata.pageContext.url).hostname}</p>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderTwitterContent = (content: string) => {
    if (!content) return null;

    // Process content to handle URLs, hashtags, and mentions
    let processed = content;

    // Handle URLs - make them blue and underlined
    processed = processed.replace(
      /(?:^|\s)(https?:\/\/[^\s]+)(?=\s|$)/g,
      ' <span class="text-[#1d9bf0] underline">$1</span>'
    );

    // Handle hashtags - make them Twitter blue
    processed = processed.replace(
      /(?:^|\s)#(\w+)/g,
      ' <span class="text-[#1d9bf0]">#$1</span>'
    );

    // Handle mentions - make them Twitter blue
    processed = processed.replace(
      /(?:^|\s)@(\w+)/g,
      ' <span class="text-[#1d9bf0]">@$1</span>'
    );

    return (
      <div>
        <div 
          className="text-white whitespace-pre-wrap break-words text-[15px] leading-[20px]"
          dangerouslySetInnerHTML={{ __html: processed }}
        />
        {/* Show Twitter images if any */}
        {post.metadata.imageAssets && post.metadata.imageAssets.length > 0 && (
          <div className={`grid ${post.metadata.imageAssets.length === 1 ? 'grid-cols-1' : 'grid-cols-2'} gap-2 mt-4`}>
            {post.metadata.imageAssets.map((imageAsset, index) => (
              <div key={`preview-${imageAsset.asset}-${index}`} className="relative aspect-[16/9]">
                <img
                  src={imageAsset.displayUrl}
                  alt={`Image ${index + 1}`}
                  className="object-cover rounded-lg w-full h-full"
                />
              </div>
            ))}
          </div>
        )}
        {/* Only show URL preview if no images are attached */}
        {post.metadata.pageContext?.url && (!post.metadata.imageAssets || post.metadata.imageAssets.length === 0) && (
          <div className="mt-3 border border-gray-700 rounded-xl overflow-hidden bg-black/50">
            {post.metadata.pageContext.url.includes(process.env.NEXT_PUBLIC_BASE_URL || '') && (
              <img 
                src="/og/og-image.png" 
                alt="Article preview" 
                className="w-full h-52 object-cover"
              />
            )}
            <div className="p-3">
              <p className="text-[13px] text-gray-400">{new URL(post.metadata.pageContext.url).hostname}</p>
              <h3 className="text-[15px] font-medium text-white line-clamp-1">{post.metadata.pageContext.title}</h3>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="fixed inset-0 bg-black/50 transition-opacity" onClick={onClose} />
        <div className="relative bg-gray-900 rounded-lg shadow-xl w-full max-w-2xl">
          <div className="flex items-center justify-between p-4 border-b border-gray-700">
            <div className="flex items-center space-x-3">
              {post.metadata.platform === 'twitter' ? (
                <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.47 2H3.53a1.45 1.45 0 0 0-1.47 1.43v17.14A1.45 1.45 0 0 0 3.53 22h16.94a1.45 1.45 0 0 0 1.47-1.43V3.43A1.45 1.45 0 0 0 20.47 2ZM8.09 18.74h-3v-9h3ZM6.59 8.48a1.56 1.56 0 1 1 0-3.12 1.57 1.57 0 1 1 0 3.12Zm12.32 10.26h-3v-4.83c0-1.21-.43-2-1.52-2A1.65 1.65 0 0 0 12.85 13a2 2 0 0 0-.1.73v5h-3v-9h3V11a3 3 0 0 1 2.71-1.5c2 0 3.45 1.29 3.45 4.06Z" />
                </svg>
              )}
              <h2 className="text-lg font-medium text-white">Post Preview</h2>
              <span className={`px-2 py-1 text-xs rounded-full border ${getStatusBadgeClass(post.status)}`}>
                {post.status.charAt(0).toUpperCase() + post.status.slice(1)}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => onEdit(post)}
                className="p-2 text-indigo-400 hover:text-indigo-300 hover:bg-indigo-900/20 rounded-full"
                title="Edit post"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              <button
                onClick={() => onDelete(post.id)}
                className="p-2 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded-full"
                title="Delete post"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-300 hover:bg-gray-700 rounded-full"
                title="Close preview"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
          <div className="p-4">
            {post.metadata.platform === 'twitter' ? (
              <div className="bg-black rounded-lg p-4">
                {renderTwitterContent(post.content)}
              </div>
            ) : (
              <div className="bg-white rounded-lg p-4">
                {renderLinkedInContent(post.content)}
              </div>
            )}
            <div className="mt-4 text-sm text-gray-400">
              Scheduled for: {new Date(post.scheduledFor).toLocaleString('en-US', {
                dateStyle: 'medium',
                timeStyle: 'short'
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function EditPostModal({ post, onClose, onSave }: EditPostModalProps) {
  const [content, setContent] = useState(post.content);
  const [scheduledFor, setScheduledFor] = useState(new Date(post.scheduledFor));
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    try {
      setIsSaving(true);
      setError(null);
      await onSave(post, content, scheduledFor);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save changes');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="fixed inset-0 bg-black/50 transition-opacity" onClick={onClose} />
        <div className="relative bg-gray-900 rounded-lg shadow-xl w-full max-w-2xl">
          <div className="flex items-center justify-between p-4 border-b border-gray-700">
            <div className="flex items-center space-x-3">
              {post.metadata.platform === 'twitter' ? (
                <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.47 2H3.53a1.45 1.45 0 0 0-1.47 1.43v17.14A1.45 1.45 0 0 0 3.53 22h16.94a1.45 1.45 0 0 0 1.47-1.43V3.43A1.45 1.45 0 0 0 20.47 2ZM8.09 18.74h-3v-9h3ZM6.59 8.48a1.56 1.56 0 1 1 0-3.12 1.57 1.57 0 1 1 0 3.12Zm12.32 10.26h-3v-4.83c0-1.21-.43-2-1.52-2A1.65 1.65 0 0 0 12.85 13a2 2 0 0 0-.1.73v5h-3v-9h3V11a3 3 0 0 1 2.71-1.5c2 0 3.45 1.29 3.45 4.06Z" />
                </svg>
              )}
              <h2 className="text-lg font-medium text-white">Edit Post</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-300 hover:bg-gray-700 rounded-full"
              title="Close"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="p-4">
            <div className="space-y-4">
              <div>
                <label htmlFor="content" className="block text-sm font-medium text-gray-200 mb-2">
                  Post Content
                </label>
                <textarea
                  id="content"
                  rows={4}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="scheduledFor" className="block text-sm font-medium text-gray-200 mb-2">
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
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ListView({ 
  posts, 
  onSelectPost, 
  onDelete 
}: { 
  posts: ScheduledPost[]; 
  onSelectPost: (post: ScheduledPost) => void;
  onDelete: (postId: string) => void;
}) {
  const [sortBy, setSortBy] = useState<'date' | 'platform' | 'status'>('date');
  const [filterStatus, setFilterStatus] = useState<'all' | 'scheduled' | 'posted' | 'failed'>('all');

  const sortedAndFilteredPosts = [...posts]
    .filter(post => filterStatus === 'all' || post.status === filterStatus)
    .sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(a.scheduledFor).getTime() - new Date(b.scheduledFor).getTime();
        case 'platform':
          return a.metadata.platform.localeCompare(b.metadata.platform);
        case 'status':
          return a.status.localeCompare(b.status);
        default:
          return 0;
      }
    });

  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden">
      <div className="p-4 border-b border-gray-700 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-400">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-gray-700 text-white rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="date">Date</option>
              <option value="platform">Platform</option>
              <option value="status">Status</option>
            </select>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-400">Status:</span>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="bg-gray-700 text-white rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All</option>
              <option value="scheduled">Scheduled</option>
              <option value="posted">Posted</option>
              <option value="failed">Failed</option>
            </select>
          </div>
        </div>
        <div className="text-sm text-gray-400">
          {sortedAndFilteredPosts.length} posts
        </div>
      </div>
      <div className="divide-y divide-gray-700">
        {sortedAndFilteredPosts.map(post => (
          <div key={post.id} className="p-4 hover:bg-gray-700/50 transition-colors">
            <div className="flex items-start justify-between">
              <button
                onClick={() => onSelectPost(post)}
                className="flex-1 text-left"
              >
                <div className="flex items-center space-x-3 mb-2">
                  {post.metadata.platform === 'twitter' ? (
                    <svg className="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.47 2H3.53a1.45 1.45 0 0 0-1.47 1.43v17.14A1.45 1.45 0 0 0 3.53 22h16.94a1.45 1.45 0 0 0 1.47-1.43V3.43A1.45 1.45 0 0 0 20.47 2ZM8.09 18.74h-3v-9h3ZM6.59 8.48a1.56 1.56 0 1 1 0-3.12 1.57 1.57 0 1 1 0 3.12Zm12.32 10.26h-3v-4.83c0-1.21-.43-2-1.52-2A1.65 1.65 0 0 0 12.85 13a2 2 0 0 0-.1.73v5h-3v-9h3V11a3 3 0 0 1 2.71-1.5c2 0 3.45 1.29 3.45 4.06Z" />
                    </svg>
                  )}
                  <span className={`px-2 py-1 text-xs rounded-full border ${getStatusBadgeClass(post.status)}`}>
                    {post.status.charAt(0).toUpperCase() + post.status.slice(1)}
                  </span>
                  <span className="text-sm text-gray-400">
                    {new Date(post.scheduledFor).toLocaleString('en-US', {
                      dateStyle: 'medium',
                      timeStyle: 'short'
                    })}
                  </span>
                </div>
                <p className="text-white text-sm line-clamp-2">{post.content}</p>
                <div className="mt-2 text-sm text-gray-400">
                  <span className="hover:text-indigo-400">{post.metadata.pageContext.title}</span>
                </div>
              </button>
              <button
                onClick={() => onDelete(post.id)}
                className="ml-4 p-2 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded-full"
                title="Delete post"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
            {post.errorMessage && (
              <p className="mt-2 text-sm text-red-400">{post.errorMessage}</p>
            )}
          </div>
        ))}
        {sortedAndFilteredPosts.length === 0 && (
          <div className="p-8 text-center text-gray-400">
            No posts found
          </div>
        )}
      </div>
    </div>
  );
}

export default function ScheduledPostsPage() {
  const { data: session } = useSession();
  const [posts, setPosts] = useState<ScheduledPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedPost, setSelectedPost] = useState<ScheduledPost | null>(null);
  const [view, setView] = useState<'calendar' | 'list'>('calendar');
  const [editingPost, setEditingPost] = useState<ScheduledPost | null>(null);

  useEffect(() => {
    fetchPosts();
  }, [currentDate]);

  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/admin/scheduled-posts');
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch scheduled posts');
      }
      
      setPosts(data.posts);
    } catch (error) {
      console.error('Error fetching posts:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch scheduled posts');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (postId: string) => {
    if (!confirm('Are you sure you want to delete this scheduled post?')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/scheduled-posts/${postId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete post');
      }
      
      // Close the modal if a post is currently selected
      setSelectedPost(null);
      
      // Refresh posts list
      fetchPosts();
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Failed to delete post. Please try again.');
    }
  };

  const handleSaveEdit = async (post: ScheduledPost, content: string, scheduledFor: Date) => {
    try {
      const response = await fetch(`/api/admin/scheduled-posts/${post.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content,
          scheduledFor: scheduledFor.toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update post');
      }

      // Refresh posts list
      await fetchPosts();
    } catch (error) {
      console.error('Error updating post:', error);
      throw new Error('Failed to save changes. Please try again.');
    }
  };

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const formatDate = (date: Date) => {
    return date.toLocaleString('default', { month: 'long', year: 'numeric' });
  };

  const getPostsForDay = (day: number) => {
    return posts.filter(post => {
      const postDate = new Date(post.scheduledFor);
      return postDate.getDate() === day &&
             postDate.getMonth() === currentDate.getMonth() &&
             postDate.getFullYear() === currentDate.getFullYear();
    });
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
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
          <div className="flex items-center space-x-2 bg-gray-800 rounded-lg p-1">
            <button
              onClick={() => setView('calendar')}
              className={`p-2 rounded-md flex items-center space-x-2 ${
                view === 'calendar' 
                  ? 'bg-gray-700 text-white' 
                  : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span className="text-sm">Calendar</span>
            </button>
            <button
              onClick={() => setView('list')}
              className={`p-2 rounded-md flex items-center space-x-2 ${
                view === 'list' 
                  ? 'bg-gray-700 text-white' 
                  : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
              }`}
            >
              <List className="w-4 h-4" />
              <span className="text-sm">List</span>
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-900/50 border border-red-500 rounded-md">
            <p className="text-sm text-red-200">{error}</p>
          </div>
        )}

        {view === 'calendar' ? (
          <div className="bg-gray-800 rounded-lg overflow-hidden">
            {/* Existing Calendar View Code */}
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
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="py-1 text-xs font-medium text-gray-400">
                  {day}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 text-center">
              {Array.from({ length: 42 }, (_, i) => {
                const dayNumber = i - getFirstDayOfMonth(currentDate) + 1;
                const isCurrentMonth = dayNumber > 0 && dayNumber <= getDaysInMonth(currentDate);
                const dayPosts = isCurrentMonth ? getPostsForDay(dayNumber) : [];
                const isToday = isCurrentMonth && dayNumber === new Date().getDate() && 
                              currentDate.getMonth() === new Date().getMonth() && 
                              currentDate.getFullYear() === new Date().getFullYear();

                return (
                  <div
                    key={i}
                    className={`min-h-[80px] p-1 border-r border-b border-gray-700 ${
                      isCurrentMonth ? 'bg-gray-800' : 'bg-gray-900/50'
                    } ${isToday ? 'ring-1 ring-inset ring-indigo-500' : ''}`}
                  >
                    {isCurrentMonth && (
                      <>
                        <span className={`text-xs ${isToday ? 'text-indigo-400 font-medium' : 'text-gray-400'}`}>
                          {dayNumber}
                        </span>
                        <div className="mt-1 space-y-0.5">
                          {dayPosts.map(post => (
                            <button
                              key={post.id}
                              onClick={() => setSelectedPost(post)}
                              className="w-full text-left px-1 py-0.5 rounded text-xs hover:bg-gray-700 flex items-center space-x-1"
                            >
                              {post.metadata.platform === 'twitter' ? (
                                <svg className="w-3 h-3 text-blue-400 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                </svg>
                              ) : (
                                <svg className="w-3 h-3 text-blue-600 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M20.47 2H3.53a1.45 1.45 0 0 0-1.47 1.43v17.14A1.45 1.45 0 0 0 3.53 22h16.94a1.45 1.45 0 0 0 1.47-1.43V3.43A1.45 1.45 0 0 0 20.47 2ZM8.09 18.74h-3v-9h3ZM6.59 8.48a1.56 1.56 0 1 1 0-3.12 1.57 1.57 0 1 1 0 3.12Zm12.32 10.26h-3v-4.83c0-1.21-.43-2-1.52-2A1.65 1.65 0 0 0 12.85 13a2 2 0 0 0-.1.73v5h-3v-9h3V11a3 3 0 0 1 2.71-1.5c2 0 3.45 1.29 3.45 4.06Z" />
                                </svg>
                              )}
                              <span className={`px-1 rounded-sm text-[10px] ${getStatusBadgeClass(post.status)}`}>
                                {new Date(post.scheduledFor).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
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
            posts={posts}
            onSelectPost={setSelectedPost}
            onDelete={handleDelete}
          />
        )}
      </div>

      {selectedPost && (
        <PostPreviewModal
          post={selectedPost}
          onClose={() => setSelectedPost(null)}
          onDelete={handleDelete}
          onEdit={(post) => {
            setEditingPost(post);
            setSelectedPost(null);
          }}
        />
      )}

      {editingPost && (
        <EditPostModal
          post={editingPost}
          onClose={() => setEditingPost(null)}
          onSave={handleSaveEdit}
        />
      )}
    </div>
  );
} 