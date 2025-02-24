"use client";

import { useState, useEffect, useRef, useMemo, Fragment } from "react";
import type { SocialAccount } from "@/lib/db/schema";
import Image from "next/image";
import { useSidebarStore } from "../RootWrapper";
import type {
  AIMarketingModalProps,
  Platform,
  EditedPreviews,
} from "./marketing-modal/types";
import { ScheduleDialog } from "./marketing-modal/ScheduleDialog";
import { ConfirmationDialog } from "./marketing-modal/ConfirmationDialog";
import { PreviewSection } from "./marketing-modal/PreviewSection";
import { ChatSection } from "./marketing-modal/ChatSection";
import { PlatformIcon } from "./marketing-modal/platforms/PlatformIcon";
import { validateContent } from "./marketing-modal/platforms/validation";

interface ModalState {
  message: string;
  conversations: {
    twitter: Array<{ role: "user" | "assistant"; content: string }>;
    linkedin: Array<{ role: "user" | "assistant"; content: string }>;
    hackernews?: Array<{ role: "user" | "assistant"; content: string }>;
  };
  selectedPlatform: string | null;
  preview: { twitter?: string; linkedin?: string };
  editedPreviews: { twitter?: string; linkedin?: string; hackernews?: string };
  isPreviewMode: boolean;
  versions: {
    twitter: Array<{
      content: string;
      timestamp: number;
      source: "ai" | "user";
    }>;
    linkedin: Array<{
      content: string;
      timestamp: number;
      source: "ai" | "user";
    }>;
  };
  imageAssets: {
    twitter: Array<{ asset: string; displayUrl: string }>;
    linkedin: Array<{ asset: string; displayUrl: string }>;
  };
  hnTitle?: string;
}

type MessageRole = "user" | "assistant";

function calculateTwitterLength(text: string): number {
  if (!text) return 0;

  // Find all URLs in the text
  const urlRegex = /https?:\/\/[^\s]+/g;
  const urls: string[] = text.match(urlRegex) || [];

  // Start with the total text length
  let length = text.length;

  // For each URL, subtract its length and add 23 (Twitter's t.co length)
  urls.forEach((url) => {
    length = length - url.length + 23;
  });

  return length;
}

function calculateLinkedInLength(text: string): number {
  if (!text) return 0;
  return text.length;
}

function getLinkedInLengthFeedback(length: number): {
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

export default function AIMarketingModal({
  isOpen,
  onClose,
  pageContext,
  accounts,
  modalState,
  onModalStateChange,
}: AIMarketingModalProps) {
  const [isScheduleDialogOpen, setIsScheduleDialogOpen] = useState(false);
  const [isConfirmationDialogOpen, setIsConfirmationDialogOpen] =
    useState(false);
  const [pendingScheduleTime, setPendingScheduleTime] = useState<Date | null>(
    null,
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isImagesExpanded, setIsImagesExpanded] = useState(false);
  const [isHNMode, setIsHNMode] = useState(false);
  const [lastSavedContent, setLastSavedContent] = useState<EditedPreviews>({
    twitter: modalState.editedPreviews.twitter || "",
    linkedin: modalState.editedPreviews.linkedin || "",
    hackernews: modalState.editedPreviews.hackernews || "",
  });

  const {
    message,
    conversations,
    selectedPlatform,
    preview,
    editedPreviews,
    isPreviewMode,
    versions,
    imageAssets = { twitter: [], linkedin: [] },
    hnTitle,
  } = modalState;

  const currentPlatform = selectedPlatform as Platform | null;

  const currentConversation = useMemo(() => {
    return conversations[selectedPlatform as "twitter" | "linkedin"] || [];
  }, [conversations, selectedPlatform]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentConversation]);

  const updateModalState = (updates: Partial<typeof modalState>) => {
    onModalStateChange({
      ...modalState,
      ...updates,
    });
  };

  const handlePlatformSelect = (platform: Platform) => {
    setIsHNMode(platform === "hackernews");
    updateModalState({
      selectedPlatform: platform,
      editedPreviews: {
        ...editedPreviews,
        [platform]: editedPreviews[platform] || "",
      },
    });
  };

  const handlePreviewEdit = (platform: Platform, content: string) => {
    updateModalState({
      editedPreviews: {
        ...editedPreviews,
        [platform]: content,
      },
    });
  };

  const handleSaveVersion = (platform: "twitter" | "linkedin") => {
    const content = editedPreviews[platform];
    if (!content) return;

    const newVersions = {
      ...versions,
      [platform]: [
        { content, timestamp: Date.now(), source: "user" },
        ...versions[platform],
      ],
    };

    updateModalState({
      versions: newVersions,
    });

    // Update last saved content after saving
    setLastSavedContent({
      ...lastSavedContent,
      [platform]: content,
    });
  };

  const handleSubmit = async () => {
    if (!message.trim() || isGenerating || !selectedPlatform) return;

    try {
      setIsGenerating(true);

      const newConversation = [
        ...(conversations[selectedPlatform as "twitter" | "linkedin"] || []),
        { role: "user" as const, content: message },
      ];

      updateModalState({
        conversations: {
          ...conversations,
          [selectedPlatform]: newConversation,
        },
        message: "",
      });

      const currentPreview =
        editedPreviews[selectedPlatform as "twitter" | "linkedin"];
      const contextWithPreview =
        message +
        (currentPreview
          ? `\n\nCurrent ${selectedPlatform} post:\n${currentPreview}`
          : "");

      const response = await fetch("/api/admin/ai/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: contextWithPreview,
          pageContext,
          platforms: [selectedPlatform],
          conversation: newConversation,
          generateDistinctContent: true,
        }),
      });

      const data = await response.json();

      const updates: Partial<typeof modalState> = {
        conversations: {
          ...conversations,
          [selectedPlatform]: [
            ...newConversation,
            { role: "assistant" as const, content: data.response },
          ],
        },
        message: "",
      };

      if (data.intent.isGeneratingPost || data.intent.isEditing) {
        const newContent = data.previews[selectedPlatform];
        if (newContent) {
          updates.preview = {
            ...preview,
            [selectedPlatform]: newContent,
          };
          updates.editedPreviews = {
            ...editedPreviews,
            [selectedPlatform]: newContent,
          };
          updates.versions = {
            ...versions,
            [selectedPlatform]: [
              { content: newContent, timestamp: Date.now(), source: "ai" },
              ...versions[selectedPlatform],
            ],
          };
        }
      }

      updateModalState(updates);
    } catch (error) {
      console.error("Error generating content:", error);
      updateModalState({
        conversations: {
          ...conversations,
          [selectedPlatform]: [
            ...(conversations[selectedPlatform as "twitter" | "linkedin"] ||
              []),
            {
              role: "assistant" as const,
              content:
                "Sorry, I encountered an error while generating content. Please try again.",
            },
          ],
        },
        message: "",
      });
    }
    setIsGenerating(false);
  };

  const handleVersionSelect = (platform: Platform, versionIndex: number) => {
    const selectedVersion = versions[platform]?.[versionIndex];
    if (!selectedVersion) return;

    updateModalState({
      editedPreviews: {
        ...editedPreviews,
        [platform]: selectedVersion.content,
      },
    });
    // Update last saved content when selecting a version
    setLastSavedContent({
      ...lastSavedContent,
      [platform]: selectedVersion.content,
    });
  };

  useEffect(() => {
    if (selectedPlatform && editedPreviews[selectedPlatform]) {
      setLastSavedContent((prev) => ({
        ...prev,
        [selectedPlatform]: editedPreviews[selectedPlatform],
      }));
    }
  }, [selectedPlatform, editedPreviews]);

  const handleHNSubmit = async () => {
    if (!message.trim() || isGenerating) return;

    try {
      setIsGenerating(true);

      const newConversation = [
        ...(modalState.conversations.hackernews || []),
        { role: "user" as const, content: message },
      ];

      updateModalState({
        conversations: {
          ...conversations,
          hackernews: newConversation,
        },
        message: "",
      });

      const response = await fetch("/api/admin/ai/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message,
          pageContext,
          platforms: ["hackernews"],
          conversation: newConversation,
          generateDistinctContent: true,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate title");
      }

      updateModalState({
        conversations: {
          ...conversations,
          hackernews: [
            ...newConversation,
            { role: "assistant" as const, content: data.response },
          ],
        },
        message: "",
        editedPreviews: {
          ...editedPreviews,
          hackernews: data.previews?.hackernews || "",
        },
        hnTitle: data.previews?.hackernews || modalState.hnTitle,
      });
    } catch (error) {
      console.error("Error generating HN title:", error);
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred";
      updateModalState({
        conversations: {
          ...conversations,
          hackernews: [
            ...(modalState.conversations.hackernews || []),
            {
              role: "assistant" as const,
              content: `Sorry, I encountered an error while generating the title: ${errorMessage}. Please try again.`,
            },
          ],
        },
        message: "",
      });
    }
    setIsGenerating(false);
  };

  const renderLinkedInContent = (content: string) => {
    if (!content) return null;

    // Split content into paragraphs
    const paragraphs = content.split("\n\n").filter(Boolean);

    // Process each paragraph to handle URLs, hashtags, and mentions
    const processedParagraphs = paragraphs.map((paragraph) => {
      // Handle URLs - make them blue and underlined
      let processed = paragraph.replace(
        /(?:^|\s)(https?:\/\/[^\s]+)(?=\s|$)/g,
        ' <span class="text-[#0a66c2] underline">$1</span>',
      );

      // Handle hashtags - make them LinkedIn blue
      processed = processed.replace(
        /(?:^|\s)#(\w+)/g,
        ' <span class="text-[#0a66c2]">#$1</span>',
      );

      // Handle mentions - make them LinkedIn blue
      processed = processed.replace(
        /(?:^|\s)@(\w+)/g,
        ' <span class="text-[#0a66c2]">@$1</span>',
      );

      return processed;
    });

    return (
      <div className="space-y-4">
        {processedParagraphs.map((paragraph, i) => (
          <p
            key={i}
            className="text-gray-900 whitespace-pre-wrap break-words text-xs leading-[20px]"
            dangerouslySetInnerHTML={{ __html: paragraph }}
          />
        ))}
        {/* Show LinkedIn images if any */}
        {(imageAssets.linkedin || []).length > 0 && (
          <div
            className={`grid ${(imageAssets.linkedin || []).length === 1 ? "" : "grid-cols-2"} gap-2 mt-4`}
          >
            {(imageAssets.linkedin || []).map((imageAsset, index) => (
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
        )}
        {/* Only show URL preview if no images are attached */}
        {pageContext.url && (imageAssets.linkedin || []).length === 0 && (
          <div className="mt-4 border border-gray-200 rounded-lg overflow-hidden bg-white">
            <div className="aspect-video relative">
              <Image
                src="/og/og-image.png"
                alt="Article preview"
                fill
                className="object-cover"
              />
            </div>
            <div className="p-3">
              <h3 className="text-[15px] font-medium text-gray-900 line-clamp-2">
                {pageContext.title}
              </h3>
              <p className="text-[13px] text-gray-500 mt-1 line-clamp-2">
                {pageContext.description}
              </p>
              <p className="text-[13px] text-gray-400 mt-1">
                {new URL(pageContext.url).hostname}
              </p>
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

    // Handle URLs - make them blue and underlined (more precise regex)
    processed = processed.replace(
      /(?:^|\s)(https?:\/\/[^\s]+)(?=\s|$)/g,
      ' <span class="text-[#1d9bf0] underline">$1</span>',
    );

    // Handle hashtags - make them Twitter blue
    processed = processed.replace(
      /(?:^|\s)#(\w+)/g,
      ' <span class="text-[#1d9bf0]">#$1</span>',
    );

    // Handle mentions - make them Twitter blue
    processed = processed.replace(
      /(?:^|\s)@(\w+)/g,
      ' <span class="text-[#1d9bf0]">@$1</span>',
    );

    return (
      <div>
        <div
          className="text-white whitespace-pre-wrap break-words text-xs leading-[20px]"
          dangerouslySetInnerHTML={{ __html: processed }}
        />
        {/* Show Twitter images if any */}
        {(imageAssets.twitter || []).length > 0 && (
          <div
            className={`grid ${(imageAssets.twitter || []).length === 1 ? "" : "grid-cols-2"} gap-2 mt-4`}
          >
            {(imageAssets.twitter || []).map((imageAsset, index) => (
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
        )}
        {/* Only show URL preview if no images are attached */}
        {pageContext.url && (imageAssets.twitter || []).length === 0 && (
          <div className="mt-3 border border-gray-700 rounded-xl overflow-hidden bg-black/50">
            <div className="aspect-video relative">
              <Image
                src="/og/og-image.png"
                alt="Article preview"
                fill
                className="object-cover"
              />
            </div>
            <div className="p-3">
              <p className="text-[13px] text-gray-400">
                {new URL(pageContext.url).hostname}
              </p>
              <h3 className="text-[15px] font-medium text-white line-clamp-1">
                {pageContext.title}
              </h3>
              <p className="text-[13px] text-gray-400 line-clamp-2">
                {pageContext.description}
              </p>
            </div>
          </div>
        )}
      </div>
    );
  };

  const togglePreviewMode = () => {
    updateModalState({ isPreviewMode: !isPreviewMode });
  };

  const handleSchedulePost = async (scheduledFor: Date) => {
    if (!selectedPlatform || !editedPreviews[selectedPlatform]) return;

    if (!validateContent(selectedPlatform, editedPreviews[selectedPlatform])) {
      alert(
        "Content is too long for the selected platform. Please shorten your message.",
      );
      return;
    }

    // For immediate posts ("Post Now"), add a small buffer to avoid validation issues
    const isImmediate = scheduledFor.getTime() <= Date.now();
    const adjustedScheduledFor = isImmediate
      ? new Date(Date.now() + 5000)
      : scheduledFor;

    // Show confirmation dialog
    setPendingScheduleTime(adjustedScheduledFor);
    setIsConfirmationDialogOpen(true);
    setIsScheduleDialogOpen(false);
    return;

    // Note: The actual posting logic is now handled in handleConfirmPost
  };

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (!selectedPlatform || !event.target.files?.length) return;

    const file = event.target.files[0];
    const formData = new FormData();
    formData.append("image", file);

    setIsUploading(true);

    try {
      const response = await fetch(
        `/api/admin/${selectedPlatform}/upload-image`,
        {
          method: "POST",
          body: formData,
        },
      );

      if (!response.ok) {
        throw new Error("Failed to upload image");
      }

      const { asset, displayUrl } = await response.json();

      // Update image assets in modal state
      updateModalState({
        ...modalState,
        imageAssets: {
          ...modalState.imageAssets,
          [selectedPlatform]: [
            ...(modalState.imageAssets?.[
              selectedPlatform as "linkedin" | "twitter"
            ] || []),
            { asset, displayUrl },
          ],
        },
      });
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Failed to upload image. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = (
    platform: "linkedin" | "twitter",
    index: number,
  ) => {
    const newAssets = [...(modalState.imageAssets?.[platform] || [])];
    newAssets.splice(index, 1);

    updateModalState({
      ...modalState,
      imageAssets: {
        ...modalState.imageAssets,
        [platform]: newAssets,
      },
    });
  };

  const handleConfirmPost = async () => {
    if (
      !selectedPlatform ||
      !editedPreviews[selectedPlatform] ||
      !pendingScheduleTime
    )
      return;

    try {
      if (selectedPlatform === "hackernews") {
        // Schedule HN reminder
        const response = await fetch("/api/admin/schedule-hn-reminder", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            title: editedPreviews[selectedPlatform],
            url: pageContext.url,
            scheduledFor: pendingScheduleTime.toISOString(),
          }),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || "Failed to schedule reminder");
        }

        alert("Hacker News reminder scheduled successfully!");
        setIsConfirmationDialogOpen(false);
        setPendingScheduleTime(null);
        return;
      }

      // Handle Twitter/LinkedIn posts
      const account = accounts.find((acc) => acc.provider === selectedPlatform);
      if (!account) return;

      const platformImageAssets =
        imageAssets[selectedPlatform as "linkedin" | "twitter"] || [];

      const response = await fetch("/api/admin/schedule-post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: editedPreviews[selectedPlatform],
          scheduledFor: pendingScheduleTime.toISOString(),
          socialAccountId: account.id,
          metadata: {
            platform: selectedPlatform,
            pageContext,
            imageAssets: platformImageAssets,
          },
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to schedule post");
      }

      alert("Post scheduled successfully!");
      setIsConfirmationDialogOpen(false);
      setPendingScheduleTime(null);
    } catch (error) {
      console.error("Error scheduling post:", error);
      alert(
        error instanceof Error
          ? error.message
          : "Failed to schedule post. Please try again.",
      );
    }
  };

  const handlePostNow = () => {
    // Use current time plus 5 seconds for immediate posts to avoid validation issues
    const scheduledFor = new Date(Date.now() + 5000);
    handleSchedulePost(scheduledFor);
    onClose();
  };

  const setIsSidebarOpen = useSidebarStore((state) => state.setIsOpen);

  useEffect(() => {
    setIsSidebarOpen(isOpen);
  }, [isOpen, setIsSidebarOpen]);

  if (!isOpen) return null;

  return (
    <div>
      <div
        className={`fixed inset-y-0 right-0 bg-gray-900/95 border-l border-gray-600/20 shadow-xl z-50 flex flex-col transform transition-transform duration-300 w-full md:w-[400px] backdrop-blur-sm ${isOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between py-2 px-3 border-b border-gray-600/20 bg-gray-800/50">
          <div className="flex items-center gap-2">
            <div className="flex items-center">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse mr-1.5" />
              <h2 className="text-sm font-medium text-gray-100">
                AI Assistant
              </h2>
            </div>
            <div className="h-4 w-px bg-gray-600/20" />
            <div className="flex gap-1">
              {accounts.map((account) => {
                const platform = account.provider as Platform;
                return (
                  <button
                    key={account.id}
                    type="button"
                    onClick={() => {
                      handlePlatformSelect(platform);
                    }}
                    className={`p-1 rounded flex items-center ${
                      selectedPlatform === platform && !isHNMode
                        ? "bg-blue-600 text-white"
                        : "bg-gray-700/50 text-gray-300 hover:bg-gray-700"
                    }`}
                  >
                    <PlatformIcon platform={platform} />
                  </button>
                );
              })}
              <button
                type="button"
                onClick={() => {
                  handlePlatformSelect("hackernews");
                }}
                className={`p-1 rounded flex items-center ${
                  selectedPlatform === "hackernews"
                    ? "bg-orange-600 text-white"
                    : "bg-gray-700/50 text-orange-500 hover:bg-gray-700"
                }`}
                title="Generate Hacker News Title"
              >
                <PlatformIcon platform="hackernews" />
              </button>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-300 p-1 rounded-lg hover:bg-gray-700/50"
          >
            <svg
              className="w-4 h-4"
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

        {/* Main content area */}
        <div className="flex flex-col flex-1 overflow-hidden">
          {isHNMode ? (
            <>
              <PreviewSection
                selectedPlatform="hackernews"
                editedPreviews={editedPreviews}
                versions={versions}
                isPreviewMode={isPreviewMode}
                imageAssets={imageAssets}
                pageContext={pageContext}
                onPreviewEdit={handlePreviewEdit}
                onVersionSelect={handleVersionSelect}
                onSaveVersion={handleSaveVersion}
                onTogglePreviewMode={togglePreviewMode}
                onSchedule={() => setIsScheduleDialogOpen(true)}
                isUploading={isUploading}
                onImageUpload={handleImageUpload}
                onImageRemove={handleRemoveImage}
              />
              <ChatSection
                message={message}
                conversations={{
                  ...conversations,
                  current: conversations.hackernews || [],
                }}
                selectedPlatform="hackernews"
                isGenerating={isGenerating}
                onMessageChange={(newMessage) =>
                  updateModalState({ message: newMessage })
                }
                onSubmit={handleHNSubmit}
              />
            </>
          ) : (
            <>
              {selectedPlatform && (
                <PreviewSection
                  selectedPlatform={selectedPlatform}
                  editedPreviews={editedPreviews}
                  versions={versions}
                  isPreviewMode={isPreviewMode}
                  imageAssets={imageAssets}
                  pageContext={pageContext}
                  onPreviewEdit={handlePreviewEdit}
                  onVersionSelect={handleVersionSelect}
                  onSaveVersion={handleSaveVersion}
                  onTogglePreviewMode={togglePreviewMode}
                  onSchedule={() => setIsScheduleDialogOpen(true)}
                  isUploading={isUploading}
                  onImageUpload={handleImageUpload}
                  onImageRemove={handleRemoveImage}
                />
              )}
              <ChatSection
                message={message}
                conversations={conversations}
                selectedPlatform={selectedPlatform}
                isGenerating={isGenerating}
                onMessageChange={(newMessage) =>
                  updateModalState({ message: newMessage })
                }
                onSubmit={handleSubmit}
              />
            </>
          )}
        </div>
      </div>

      {selectedPlatform && pendingScheduleTime && (
        <ConfirmationDialog
          isOpen={isConfirmationDialogOpen}
          onClose={() => {
            setIsConfirmationDialogOpen(false);
            setPendingScheduleTime(null);
          }}
          onConfirm={handleConfirmPost}
          content={editedPreviews[selectedPlatform] || ""}
          platform={selectedPlatform}
          scheduledTime={pendingScheduleTime}
          pageContext={pageContext}
          imageAssets={imageAssets}
        />
      )}

      {selectedPlatform && (
        <ScheduleDialog
          isOpen={isScheduleDialogOpen}
          onClose={() => setIsScheduleDialogOpen(false)}
          onConfirm={handleSchedulePost}
          platform={selectedPlatform}
        />
      )}
    </div>
  );
}
