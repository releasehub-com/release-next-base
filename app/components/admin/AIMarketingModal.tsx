"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import type { SocialAccount } from "@/lib/db/schema";
import Image from "next/image";

interface ModalState {
  message: string;
  conversations: {
    twitter: Array<{ role: "user" | "assistant"; content: string }>;
    linkedin: Array<{ role: "user" | "assistant"; content: string }>;
  };
  selectedPlatform: string | null;
  preview: { twitter?: string; linkedin?: string };
  editedPreviews: { twitter?: string; linkedin?: string };
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
}

interface AIMarketingModalProps {
  isOpen: boolean;
  onClose: () => void;
  pageContext: {
    title: string;
    description: string;
    url: string;
    content?: string;
  };
  accounts: SocialAccount[];
  modalState: ModalState;
  onModalStateChange: (state: ModalState) => void;
}

type MessageRole = "user" | "assistant";

// Add new interfaces for scheduling
interface ScheduleDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSchedule: (date: Date) => void;
}

function ScheduleDialog({ isOpen, onClose, onSchedule }: ScheduleDialogProps) {
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [error, setError] = useState<string>("");

  const handleSchedule = () => {
    if (!selectedDate || !selectedTime) {
      setError("Please select both date and time");
      return;
    }

    const scheduledDateTime = new Date(`${selectedDate}T${selectedTime}`);
    if (scheduledDateTime <= new Date()) {
      setError("Selected time must be in the future");
      return;
    }

    onSchedule(scheduledDateTime);
    onClose();
  };

  const handlePostNow = () => {
    // Schedule for 1 minute in the future to pass validation
    const scheduledFor = new Date(Date.now() + 60000);
    onSchedule(scheduledFor);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div
          className="fixed inset-0 bg-black/50 transition-opacity"
          onClick={onClose}
        />
        <div className="relative bg-gray-800 rounded-lg shadow-xl w-full max-w-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-medium text-white">Schedule Post</h3>
            <button
              onClick={handlePostNow}
              className="px-4 py-2 text-sm rounded-md bg-green-600 text-white hover:bg-green-700 transition-colors"
            >
              Post Now
            </button>
          </div>

          {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

          <div className="border-t border-gray-700 pt-6">
            <h4 className="text-sm font-medium text-gray-300 mb-4">
              Schedule for later
            </h4>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Date
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full bg-gray-700 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  min={new Date().toISOString().split("T")[0]}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Time
                </label>
                <input
                  type="time"
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                  className="w-full bg-gray-700 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm rounded-md bg-gray-700 text-white hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleSchedule}
                disabled={!selectedDate || !selectedTime}
                className="px-4 py-2 text-sm rounded-md bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Schedule
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Update the interface first
interface ConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  content: string;
  platform: string;
  scheduledTime: Date;
  pageContext: {
    title: string;
    description: string;
    url: string;
  };
  imageAssets: {
    twitter: Array<{ asset: string; displayUrl: string }>;
    linkedin: Array<{ asset: string; displayUrl: string }>;
  };
}

function ConfirmationDialog({
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

  const renderTwitterPreview = () => {
    // Process content to handle URLs, hashtags, and mentions
    let processed = content;

    // Handle URLs - make them blue and underlined
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
          className="text-white whitespace-pre-wrap break-words text-[15px] leading-[20px]"
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
            {pageContext.url.includes(
              process.env.NEXT_PUBLIC_BASE_URL || "",
            ) && (
              <Image
                src="/og/og-image.png"
                alt="Article preview"
                width={200}
                height={150}
                className="w-full h-52 object-cover rounded-lg"
              />
            )}
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

  const renderLinkedInPreview = () => {
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
            className="text-gray-900 whitespace-pre-wrap break-words text-[15px] leading-[20px]"
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
            {pageContext.url.includes(
              process.env.NEXT_PUBLIC_BASE_URL || "",
            ) && (
              <Image
                src="/og/og-image.png"
                alt="Article preview"
                width={200}
                height={150}
                className="w-full h-52 object-cover rounded-lg"
              />
            )}
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

  return (
    <div className="fixed inset-0 z-[70] overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div
          className="fixed inset-0 bg-black/50 transition-opacity"
          onClick={onClose}
        />
        <div className="relative bg-gray-800 rounded-lg shadow-xl w-full max-w-lg p-6">
          <h3 className="text-lg font-medium text-white mb-2">Confirm Post</h3>
          <p className="text-sm text-gray-300 mb-4">
            {isScheduled
              ? `This post will be published on ${formattedTime}`
              : "This post will be published immediately"}
          </p>

          <div className="mt-4 bg-gray-900 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-300 mb-2 flex items-center">
              {platform === "twitter" ? (
                <>
                  <svg
                    className="w-4 h-4 mr-1 text-blue-400"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                  Twitter Post
                </>
              ) : (
                <>
                  <svg
                    className="w-4 h-4 mr-1 text-blue-600"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M20.47 2H3.53a1.45 1.45 0 0 0-1.47 1.43v17.14A1.45 1.45 0 0 0 3.53 22h16.94a1.45 1.45 0 0 0 1.47-1.43V3.43A1.45 1.45 0 0 0 20.47 2ZM8.09 18.74h-3v-9h3ZM6.59 8.48a1.56 1.56 0 1 1 0-3.12 1.57 1.57 0 1 1 0 3.12Zm12.32 10.26h-3v-4.83c0-1.21-.43-2-1.52-2A1.65 1.65 0 0 0 12.85 13a2 2 0 0 0-.1.73v5h-3v-9h3V11a3 3 0 0 1 2.71-1.5c2 0 3.45 1.29 3.45 4.06Z" />
                  </svg>
                  LinkedIn Post
                </>
              )}
            </h4>
            <div
              className={`rounded-lg p-4 ${platform === "twitter" ? "bg-black" : "bg-white"}`}
            >
              {platform === "twitter"
                ? renderTwitterPreview()
                : renderLinkedInPreview()}
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm rounded-md bg-gray-700 text-white hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 text-sm rounded-md bg-blue-600 text-white hover:bg-blue-700"
            >
              {isScheduled ? "Schedule Post" : "Post Now"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Add this function before the AIMarketingModal component
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

// Add this function before the AIMarketingModal component
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
  const initialState: ModalState = {
    message: "",
    conversations: {
      twitter: [],
      linkedin: [],
    },
    selectedPlatform: null,
    preview: {},
    editedPreviews: {},
    isPreviewMode: false,
    versions: {
      twitter: [],
      linkedin: [],
    },
    imageAssets: {
      twitter: [],
      linkedin: [],
    },
  };

  const {
    message,
    conversations,
    selectedPlatform,
    preview,
    editedPreviews,
    isPreviewMode,
    versions,
    imageAssets = { twitter: [], linkedin: [] },
  } = modalState;

  // Add state to track last saved content
  const [lastSavedContent, setLastSavedContent] = useState<{
    twitter?: string;
    linkedin?: string;
  }>({
    twitter: editedPreviews.twitter || "",
    linkedin: editedPreviews.linkedin || "",
  });

  // Function to check if there are unsaved changes
  const hasUnsavedChanges = (platform: "twitter" | "linkedin"): boolean => {
    const currentContent = editedPreviews[platform];
    const savedContent = lastSavedContent[platform] || "";
    return currentContent !== savedContent;
  };

  // Get current platform's conversation
  const currentConversation = useMemo(() => {
    return conversations[selectedPlatform as "twitter" | "linkedin"] || [];
  }, [conversations, selectedPlatform]);

  const [isGenerating, setIsGenerating] = useState(false);
  // Add ref for messages container
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Add scroll to bottom function
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Scroll to bottom when conversation updates
  useEffect(() => {
    scrollToBottom();
  }, [currentConversation]);

  const updateModalState = (updates: Partial<ModalState>) => {
    onModalStateChange({
      ...modalState,
      ...updates,
    });
  };

  const handlePlatformSelect = (platform: string) => {
    // Only update the selected platform, preserving all other state
    updateModalState({
      selectedPlatform: platform,
    });
  };

  const handlePreviewEdit = (
    platform: "twitter" | "linkedin",
    content: string,
  ) => {
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

      // Add user message to conversation and clear input immediately
      const newConversation = [
        ...currentConversation,
        { role: "user" as MessageRole, content: message },
      ];

      // Clear message state immediately
      updateModalState({
        conversations: {
          ...conversations,
          [selectedPlatform]: newConversation,
        },
        message: "",
      });

      // Include edited preview in the context if it exists
      const currentPreview =
        editedPreviews[selectedPlatform as "twitter" | "linkedin"];
      const contextWithPreview =
        message +
        (currentPreview
          ? `\n\nCurrent ${selectedPlatform} post:\n${currentPreview}`
          : "");

      // Call AI endpoint to generate response and previews
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

      // Update conversation and previews based on intent
      const updates: Partial<ModalState> = {
        conversations: {
          ...conversations,
          [selectedPlatform]: [
            ...newConversation,
            { role: "assistant" as MessageRole, content: data.response },
          ],
        },
        message: "", // Ensure message stays cleared
      };

      // Update previews if the AI determined we're generating/editing a post
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
            ...currentConversation,
            {
              role: "assistant" as MessageRole,
              content:
                "Sorry, I encountered an error while generating content. Please try again.",
            },
          ],
        },
        message: "", // Ensure message stays cleared even on error
      });
    }
    setIsGenerating(false);
  };

  const handleVersionSelect = (
    platform: "twitter" | "linkedin",
    versionIndex: number,
  ) => {
    const selectedVersion = versions[platform][versionIndex];
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

  // Update lastSavedContent when AI generates new content or when editedPreviews changes
  useEffect(() => {
    if (selectedPlatform && editedPreviews[selectedPlatform]) {
      setLastSavedContent((prev) => ({
        ...prev,
        [selectedPlatform]: editedPreviews[selectedPlatform],
      }));
    }
  }, [selectedPlatform, editedPreviews]);

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
            className="text-gray-900 whitespace-pre-wrap break-words text-[15px] leading-[20px]"
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
            {pageContext.url.includes(
              process.env.NEXT_PUBLIC_BASE_URL || "",
            ) && (
              <Image
                src="/og/og-image.png"
                alt="Article preview"
                width={200}
                height={150}
                className="w-full h-52 object-cover rounded-lg"
              />
            )}
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
          className="text-white whitespace-pre-wrap break-words text-[15px] leading-[20px]"
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
            {pageContext.url.includes(
              process.env.NEXT_PUBLIC_BASE_URL || "",
            ) && (
              <Image
                src="/og/og-image.png"
                alt="Article preview"
                width={200}
                height={150}
                className="w-full h-52 object-cover rounded-lg"
              />
            )}
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

  const [isScheduleDialogOpen, setIsScheduleDialogOpen] = useState(false);
  const [isConfirmationDialogOpen, setIsConfirmationDialogOpen] =
    useState(false);
  const [pendingScheduleTime, setPendingScheduleTime] = useState<Date | null>(
    null,
  );

  const handleSchedulePost = async (scheduledFor: Date) => {
    if (!selectedPlatform || !editedPreviews[selectedPlatform]) return;

    // Add validation for Twitter length
    if (
      selectedPlatform === "twitter" &&
      editedPreviews.twitter &&
      calculateTwitterLength(editedPreviews.twitter) > 280
    ) {
      alert("Tweet is too long. Please shorten your message.");
      return;
    }

    // Set pending schedule time and open confirmation dialog
    setPendingScheduleTime(scheduledFor);
    setIsScheduleDialogOpen(false);
    setIsConfirmationDialogOpen(true);
  };

  const [isUploading, setIsUploading] = useState(false);

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
      const account = accounts.find((acc) => acc.provider === selectedPlatform);
      if (!account) return;

      // Send the full image asset objects including displayUrl
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div
          className="fixed inset-0 bg-black/50 transition-opacity"
          onClick={onClose}
        />

        <div className="relative bg-gray-900 rounded-lg shadow-xl w-full max-w-6xl flex flex-col max-h-[90vh]">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-700">
            <h2 className="text-xl font-semibold text-white">
              AI Marketing Assistant
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-300"
            >
              <svg
                className="w-6 h-6"
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

          {/* Content */}
          <div className="flex-1 flex overflow-hidden">
            {/* Left side - Conversation */}
            <div className="w-1/2 flex flex-col border-r border-gray-700">
              {/* Platform Selection */}
              <div className="p-4 border-b border-gray-700">
                <h3 className="text-sm font-medium text-gray-300 mb-2">
                  Select Platform
                </h3>
                <div className="flex space-x-2">
                  {accounts.map((account) => (
                    <button
                      key={account.id}
                      onClick={() => handlePlatformSelect(account.provider)}
                      className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm ${
                        selectedPlatform === account.provider
                          ? "bg-indigo-600 text-white"
                          : "bg-gray-700 text-gray-300"
                      }`}
                    >
                      {account.provider === "twitter" ? (
                        <svg
                          className="w-4 h-4"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                        </svg>
                      ) : (
                        <svg
                          className="w-4 h-4"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M20.47 2H3.53a1.45 1.45 0 0 0-1.47 1.43v17.14A1.45 1.45 0 0 0 3.53 22h16.94a1.45 1.45 0 0 0 1.47-1.43V3.43A1.45 1.45 0 0 0 20.47 2ZM8.09 18.74h-3v-9h3ZM6.59 8.48a1.56 1.56 0 1 1 0-3.12 1.57 1.57 0 1 1 0 3.12Zm12.32 10.26h-3v-4.83c0-1.21-.43-2-1.52-2A1.65 1.65 0 0 0 12.85 13a2 2 0 0 0-.1.73v5h-3v-9h3V11a3 3 0 0 1 2.71-1.5c2 0 3.45 1.29 3.45 4.06Z" />
                        </svg>
                      )}
                      <span>{account.provider}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {currentConversation.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex ${msg.role === "assistant" ? "justify-start" : "justify-end"}`}
                  >
                    <div
                      className={`rounded-lg px-4 py-2 max-w-[80%] ${
                        msg.role === "assistant"
                          ? "bg-gray-700 text-white"
                          : "bg-indigo-600 text-white"
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{msg.content}</p>
                    </div>
                  </div>
                ))}
                {isGenerating && (
                  <div className="flex justify-start">
                    <div className="bg-gray-700 text-white rounded-lg px-4 py-2 flex items-end space-x-1">
                      <div
                        className="w-2 h-2 bg-white rounded-full animate-bounce"
                        style={{ animationDelay: "0ms" }}
                      />
                      <div
                        className="w-2 h-2 bg-white rounded-full animate-bounce"
                        style={{ animationDelay: "150ms" }}
                      />
                      <div
                        className="w-2 h-2 bg-white rounded-full animate-bounce"
                        style={{ animationDelay: "300ms" }}
                      />
                    </div>
                  </div>
                )}
                {/* Add div for scroll reference */}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="p-4 border-t border-gray-700">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={message}
                    onChange={(e) =>
                      updateModalState({ message: e.target.value })
                    }
                    placeholder={
                      isGenerating
                        ? "AI is thinking..."
                        : selectedPlatform
                          ? `Type your message for ${selectedPlatform}...`
                          : "Select a platform..."
                    }
                    disabled={isGenerating}
                    className="flex-1 bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSubmit();
                      }
                    }}
                  />
                  <button
                    onClick={handleSubmit}
                    disabled={
                      !message.trim() || isGenerating || !selectedPlatform
                    }
                    className="bg-indigo-600 text-white rounded-lg px-4 py-2 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isGenerating ? "Thinking..." : "Send"}
                  </button>
                </div>
              </div>
            </div>

            {/* Right side - Preview */}
            <div className="w-1/2 flex flex-col">
              <div className="p-4 border-b border-gray-700 flex justify-between items-center">
                <div>
                  <h3 className="text-sm font-medium text-gray-300">
                    Current Post
                  </h3>
                  <p className="text-xs text-gray-400 mt-1">
                    {isPreviewMode
                      ? "Preview how your post will look"
                      : "Edit your post directly"}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  {selectedPlatform &&
                    versions[selectedPlatform]?.length > 0 && (
                      <select
                        className="bg-gray-700 text-white text-sm rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        onChange={(e) =>
                          handleVersionSelect(
                            selectedPlatform as "twitter" | "linkedin",
                            parseInt(e.target.value),
                          )
                        }
                        value=""
                      >
                        <option value="" disabled>
                          Select version...
                        </option>
                        {versions[selectedPlatform].map((version, index) => {
                          const date = new Date(version.timestamp);
                          const timeStr = date.toLocaleTimeString();
                          return (
                            <option key={version.timestamp} value={index}>
                              {version.source === "ai" ? "🤖" : "✏️"} {timeStr}
                            </option>
                          );
                        })}
                      </select>
                    )}
                  {selectedPlatform && editedPreviews[selectedPlatform] && (
                    <>
                      {!isPreviewMode ? (
                        <button
                          onClick={() =>
                            handleSaveVersion(
                              selectedPlatform as "twitter" | "linkedin",
                            )
                          }
                          disabled={
                            !hasUnsavedChanges(
                              selectedPlatform as "twitter" | "linkedin",
                            )
                          }
                          className={`px-3 py-1 text-sm rounded-md ${
                            hasUnsavedChanges(
                              selectedPlatform as "twitter" | "linkedin",
                            )
                              ? "bg-green-600 text-white hover:bg-green-700"
                              : "bg-gray-600 text-gray-300 cursor-not-allowed"
                          } transition-colors`}
                        >
                          Save Version
                        </button>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => setIsScheduleDialogOpen(true)}
                            className="px-3 py-1 text-sm rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                          >
                            Schedule Post
                          </button>
                        </div>
                      )}
                    </>
                  )}
                  <button
                    onClick={togglePreviewMode}
                    className="px-3 py-1 text-sm rounded-md bg-gray-700 text-white hover:bg-gray-600 transition-colors"
                  >
                    {isPreviewMode ? "Edit Post" : "Show Preview"}
                  </button>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-4">
                {selectedPlatform === "twitter" && (
                  <div className="h-full">
                    <div className="bg-gray-800 rounded-lg p-4 h-full flex flex-col">
                      <div className="flex items-center mb-2">
                        <h4 className="text-sm font-medium text-gray-300 flex items-center">
                          <svg
                            className="w-4 h-4 mr-1 text-blue-400"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                          </svg>
                          Twitter Post
                        </h4>
                      </div>
                      {isPreviewMode ? (
                        <div className="bg-black rounded-lg p-4 flex-1 overflow-y-auto">
                          {renderTwitterContent(editedPreviews.twitter || "")}
                        </div>
                      ) : (
                        <div className="flex-1 overflow-y-auto pr-2">
                          <div className="relative p-2">
                            <textarea
                              value={editedPreviews.twitter || ""}
                              onChange={(e) =>
                                handlePreviewEdit("twitter", e.target.value)
                              }
                              className={`w-full h-40 bg-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-4 focus:ring-offset-gray-900 text-base leading-relaxed resize-none mb-2 ${
                                calculateTwitterLength(
                                  editedPreviews.twitter || "",
                                ) > 280
                                  ? "border-2 border-red-500"
                                  : ""
                              }`}
                              placeholder="No content available"
                            />
                          </div>
                          <p
                            className={`text-xs mb-4 ${calculateTwitterLength(editedPreviews.twitter || "") > 280 ? "text-red-400" : "text-gray-400"}`}
                          >
                            {calculateTwitterLength(
                              editedPreviews.twitter || "",
                            )}
                            /280 characters
                            {calculateTwitterLength(
                              editedPreviews.twitter || "",
                            ) > 280 && (
                              <span className="ml-2 text-red-400">
                                Tweet is too long
                              </span>
                            )}
                          </p>

                          {/* Add Twitter image upload UI */}
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="text-sm font-medium text-gray-300">
                                Images
                              </h4>
                              <label className="cursor-pointer px-3 py-1 text-sm rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors">
                                {isUploading ? "Uploading..." : "Add Image"}
                                <input
                                  type="file"
                                  className="hidden"
                                  accept="image/*"
                                  onChange={handleImageUpload}
                                  disabled={
                                    isUploading ||
                                    (modalState.imageAssets?.twitter || [])
                                      .length >= 4
                                  }
                                />
                              </label>
                            </div>

                            {(modalState.imageAssets?.twitter || []).length >
                              0 && (
                              <div className="grid grid-cols-4 gap-2">
                                {(modalState.imageAssets?.twitter || []).map(
                                  (imageAsset, index) => {
                                    const key = `edit-${imageAsset.asset}-${index}`;
                                    return (
                                      <div key={key} className="relative group">
                                        <div className="aspect-square bg-gray-700 rounded-lg overflow-hidden">
                                          <Image
                                            src={imageAsset.displayUrl}
                                            alt={`Image ${index + 1}`}
                                            width={100}
                                            height={100}
                                            className="object-cover w-full h-full"
                                          />
                                        </div>
                                        <button
                                          onClick={() =>
                                            handleRemoveImage("twitter", index)
                                          }
                                          className="absolute top-1 right-1 p-1 bg-red-600 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                          <svg
                                            className="w-3 h-3"
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
                                    );
                                  },
                                )}
                              </div>
                            )}

                            {(modalState.imageAssets?.twitter || []).length >=
                              4 && (
                              <p className="text-xs text-yellow-400 mt-1">
                                Maximum number of images (4) reached
                              </p>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                {selectedPlatform === "linkedin" && (
                  <div className="h-full">
                    <div className="bg-gray-800 rounded-lg p-4 h-full flex flex-col">
                      <div className="flex items-center mb-2">
                        <h4 className="text-sm font-medium text-gray-300 flex items-center">
                          <svg
                            className="w-4 h-4 mr-1 text-blue-600"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M20.47 2H3.53a1.45 1.45 0 0 0-1.47 1.43v17.14A1.45 1.45 0 0 0 3.53 22h16.94a1.45 1.45 0 0 0 1.47-1.43V3.43A1.45 1.45 0 0 0 20.47 2ZM8.09 18.74h-3v-9h3ZM6.59 8.48a1.56 1.56 0 1 1 0-3.12 1.57 1.57 0 1 1 0 3.12Zm12.32 10.26h-3v-4.83c0-1.21-.43-2-1.52-2A1.65 1.65 0 0 0 12.85 13a2 2 0 0 0-.1.73v5h-3v-9h3V11a3 3 0 0 1 2.71-1.5c2 0 3.45 1.29 3.45 4.06Z" />
                          </svg>
                          LinkedIn Post
                        </h4>
                      </div>
                      {isPreviewMode ? (
                        <div className="bg-white rounded-lg p-4 shadow-sm flex-1 overflow-y-auto">
                          {renderLinkedInContent(editedPreviews.linkedin || "")}
                        </div>
                      ) : (
                        <>
                          <div className="relative">
                            <textarea
                              value={editedPreviews.linkedin || ""}
                              onChange={(e) =>
                                handlePreviewEdit("linkedin", e.target.value)
                              }
                              className={`w-full flex-1 bg-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-base leading-relaxed resize-none ${
                                calculateLinkedInLength(
                                  editedPreviews.linkedin || "",
                                ) > 3000
                                  ? "border-2 border-red-500"
                                  : ""
                              }`}
                              placeholder="No content available"
                            />
                          </div>
                          {/* Add LinkedIn character count and feedback */}
                          {(() => {
                            const length = calculateLinkedInLength(
                              editedPreviews.linkedin || "",
                            );
                            const feedback = getLinkedInLengthFeedback(length);
                            return (
                              <div className="flex items-center justify-between mt-2 text-xs">
                                <span className={feedback.color}>
                                  {length.toLocaleString()}/3,000{" "}
                                  {feedback.message}
                                </span>
                                {length > 200 && (
                                  <span className="text-gray-400">
                                    First {Math.min(length, 200)} characters
                                    visible in feed
                                  </span>
                                )}
                              </div>
                            );
                          })()}

                          {/* Existing image upload UI */}
                          <div className="mt-4">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="text-sm font-medium text-gray-300">
                                Images
                              </h4>
                              <label className="cursor-pointer px-3 py-1 text-sm rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors">
                                {isUploading ? "Uploading..." : "Add Image"}
                                <input
                                  type="file"
                                  className="hidden"
                                  accept="image/*"
                                  onChange={handleImageUpload}
                                  disabled={
                                    isUploading ||
                                    (modalState.imageAssets?.linkedin || [])
                                      .length >= 9
                                  }
                                />
                              </label>
                            </div>

                            {(imageAssets.linkedin || []).length > 0 && (
                              <div className="grid grid-cols-3 gap-2 mt-2">
                                {(imageAssets.linkedin || []).map(
                                  (imageAsset, index) => {
                                    const key = `edit-${imageAsset.asset}-${index}`;
                                    return (
                                      <div key={key} className="relative group">
                                        <div className="aspect-w-16 aspect-h-9 bg-gray-700 rounded-lg overflow-hidden">
                                          <Image
                                            src={imageAsset.displayUrl}
                                            alt={`Image ${index + 1}`}
                                            width={200}
                                            height={150}
                                            className="object-cover w-full h-full"
                                          />
                                        </div>
                                        <button
                                          onClick={() =>
                                            handleRemoveImage("linkedin", index)
                                          }
                                          className="absolute top-1 right-1 p-1 bg-red-600 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
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
                                    );
                                  },
                                )}
                              </div>
                            )}

                            {(modalState.imageAssets?.linkedin || []).length >=
                              9 && (
                              <p className="text-xs text-yellow-400 mt-1">
                                Maximum number of images (9) reached
                              </p>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Confirmation Dialog */}
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

      {/* Add Schedule Dialog */}
      <ScheduleDialog
        isOpen={isScheduleDialogOpen}
        onClose={() => setIsScheduleDialogOpen(false)}
        onSchedule={handleSchedulePost}
      />
    </div>
  );
}
