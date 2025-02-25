"use client";

import { useState, useEffect } from "react";
import { useSidebarStore } from "../../RootWrapper";
import type { AIMarketingModalProps, Platform, EditedPreviews } from "./types";
import { ScheduleDialog } from "./ScheduleDialog";
import { ConfirmationDialog } from "./ConfirmationDialog";
import { PreviewSection } from "./PreviewSection";
import { ChatSection } from "./ChatSection";
import { PlatformIcon } from "./platforms/PlatformIcon";
import { validateContent } from "./platforms/validation";
import { useSession } from "next-auth/react";
import { platformPrompts, platformProcessors } from "./platforms/handlers";

export default function AIMarketingModal({
  isOpen,
  onClose,
  pageContext,
  accounts,
  modalState,
  onModalStateChange,
}: AIMarketingModalProps) {
  console.log("🚀 AIMarketingModal render", {
    isOpen,
    accountsLength: accounts.length,
  });
  const { data: session } = useSession();
  const [isScheduleDialogOpen, setIsScheduleDialogOpen] = useState(false);
  const [isConfirmationDialogOpen, setIsConfirmationDialogOpen] =
    useState(false);
  const [pendingScheduleTime, setPendingScheduleTime] = useState<Date | null>(
    null,
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
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
    hackernewsUrl,
  } = modalState;

  const currentPlatform = selectedPlatform as Platform | null;

  const updateModalState = (updates: Partial<typeof modalState>) => {
    console.log("updateModalState called with:", updates);
    onModalStateChange({
      ...modalState,
      ...updates,
    });
  };

  const handlePlatformSelect = (platform: Platform) => {
    updateModalState({
      selectedPlatform: platform,
    });
  };

  const handlePreviewEdit = (platform: Platform, content: string) => {
    if (platform === "hackernews") {
      // Check if the pasted content contains a URL
      const learnMoreFormats = [
        "\n\nLearn more: ",
        "\nLearn more: ",
        "Learn more: ",
        "Learn More: ",
        "\n\nRead more: ",
        "\nRead more: ",
        "Read more: ",
        "Read More: ",
      ];

      let title = content;
      let url = modalState.hackernewsUrl || "";

      for (const format of learnMoreFormats) {
        if (content.includes(format)) {
          const parts = content.split(format);
          if (parts.length === 2) {
            title = parts[0].trim();
            url = parts[1].trim();
            break;
          }
        }
      }

      // Update both title and URL
      updateModalState({
        editedPreviews: {
          ...editedPreviews,
          [platform]: title,
        },
        hackernewsUrl: url,
      });
    } else {
      updateModalState({
        editedPreviews: {
          ...editedPreviews,
          [platform]: content,
        },
      });
    }
  };

  const handleSaveVersion = (platform: Platform) => {
    const content = editedPreviews[platform];
    if (!content) return;

    let versionContent = content;
    if (platform === "hackernews" && hackernewsUrl) {
      // For HackerNews, save both title and URL in the version
      versionContent = `${content}\n\nLearn more: ${hackernewsUrl}`;
    }

    const newVersions = {
      ...versions,
      [platform]: [
        { content: versionContent, timestamp: Date.now(), source: "user" },
        ...versions[platform],
      ],
    };

    updateModalState({
      versions: newVersions,
    });

    setLastSavedContent({
      ...lastSavedContent,
      [platform]: content,
    });
  };

  const handleSubmit = async () => {
    console.log("=== Submit Handler ===");
    console.log("Starting submission with:", {
      message: modalState.message,
      isGenerating,
      selectedPlatform: modalState.selectedPlatform,
    });

    if (!message.trim() || isGenerating || !selectedPlatform) {
      console.log("handleSubmit early return:", {
        hasMessage: !!message.trim(),
        isGenerating,
        selectedPlatform,
      });
      return;
    }

    try {
      console.log("Setting isGenerating to true");
      setIsGenerating(true);
      console.log("Creating new conversation");
      const newConversation = [
        ...(conversations[selectedPlatform] || []),
        { role: "user" as const, content: message },
      ];

      console.log("Getting current preview");
      const currentPreview = editedPreviews[selectedPlatform];
      console.log("Getting context with preview");
      const contextWithPreview = platformPrompts[selectedPlatform](
        message,
        currentPreview,
        pageContext,
      );

      console.log("Making API call");
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

      console.log("Got API response");
      const data = await response.json();
      console.log("API response data:", data);

      // First update conversations
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
        console.group("🔄 Processing Updates");
        console.log("Current modal state:", modalState);
        const platformUpdates = platformProcessors[
          selectedPlatform
        ].processAIResponse(data, modalState, pageContext);
        console.log("Platform updates:", platformUpdates);
        Object.assign(updates, platformUpdates);
        console.groupEnd();
      } else if (
        selectedPlatform === "hackernews" &&
        data.previews?.hackernews
      ) {
        // Always process HackerNews responses if we have preview content
        const platformUpdates = platformProcessors[
          selectedPlatform
        ].processAIResponse(data, modalState, pageContext);
        Object.assign(updates, platformUpdates);
      }

      console.log("📝 Final updates:", updates);
      console.groupEnd();

      updateModalState(updates);
    } catch (error) {
      console.group("❌ Error");
      console.error("Error details:", error);
      console.groupEnd();

      updateModalState({
        conversations: {
          ...conversations,
          [selectedPlatform]: [
            ...(conversations[selectedPlatform] || []),
            {
              role: "assistant" as const,
              content:
                "Sorry, I encountered an error while generating content. Please try again.",
            },
          ],
        },
        message: "",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleVersionSelect = (platform: Platform, versionIndex: number) => {
    const selectedVersion = versions[platform][versionIndex];
    const updates = platformProcessors[platform].processVersionSelect(
      selectedVersion.content,
      modalState,
    );

    updateModalState(updates);
    setLastSavedContent({
      ...lastSavedContent,
      [platform]: updates.editedPreviews[platform],
    });
  };

  const handleHackernewsUrlChange = (url: string) => {
    updateModalState({
      hackernewsUrl: url,
    });
  };

  const handleSchedulePost = async (scheduledFor: Date) => {
    if (!selectedPlatform || !editedPreviews[selectedPlatform]) return;

    // Set the pending schedule time and open the confirmation dialog
    setPendingScheduleTime(scheduledFor);
    setIsConfirmationDialogOpen(true);
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

      updateModalState({
        ...modalState,
        imageAssets: {
          ...modalState.imageAssets,
          [selectedPlatform]: [
            ...(modalState.imageAssets?.[selectedPlatform] || []),
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

  const handleRemoveImage = (platform: Platform, index: number) => {
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
      // Convert local time to UTC for storage
      const scheduledForUTC = new Date(pendingScheduleTime.toISOString());

      if (selectedPlatform === "hackernews") {
        // Use the HackerNews-specific endpoint
        const response = await fetch("/api/admin/schedule-hn-reminder", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: editedPreviews[selectedPlatform],
            url: hackernewsUrl,
            scheduledFor: scheduledForUTC,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to schedule HackerNews reminder");
        }
      } else {
        // Regular social media post
        const account = accounts.find(
          (acc) => acc.provider === selectedPlatform,
        );
        if (!account) throw new Error("No connected account found");

        const platformImageAssets = imageAssets[selectedPlatform] || [];

        const response = await fetch("/api/admin/schedule-post", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            content: editedPreviews[selectedPlatform],
            scheduledFor: scheduledForUTC,
            socialAccountId: account.id,
            imageAssets: platformImageAssets,
            metadata: {
              platform: selectedPlatform,
              pageContext,
              imageAssets: platformImageAssets,
              scheduledInTimezone:
                session?.user?.timezone || "America/Los_Angeles",
              userEmail: session?.user?.email,
              userName: session?.user?.name,
            },
          }),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || "Failed to schedule post");
        }
      }

      alert("Post scheduled successfully!");
      setIsConfirmationDialogOpen(false);
      setPendingScheduleTime(null);
      onClose();
    } catch (error) {
      console.error("Error scheduling post:", error);
      alert(
        error instanceof Error
          ? error.message
          : "Failed to schedule post. Please try again.",
      );
    }
  };

  const setIsSidebarOpen = useSidebarStore((state) => state.setIsOpen);

  // Move initial render logging into an effect that runs on every render
  useEffect(() => {
    const mountTime = Date.now();

    console.log("=== AIMarketingModal Mount ===", {
      mountTime,
      isOpen,
      selectedPlatform: modalState.selectedPlatform,
    });

    // Set sidebar state
    setIsSidebarOpen(isOpen);

    return () => {
      console.log("=== AIMarketingModal Unmount ===", {
        mountDuration: Date.now() - mountTime,
        isOpen,
        selectedPlatform: modalState.selectedPlatform,
      });
    };
  }, [isOpen, setIsSidebarOpen, modalState.selectedPlatform]);

  // Keep this effect separate as it handles content syncing
  useEffect(() => {
    if (selectedPlatform && editedPreviews[selectedPlatform]) {
      setLastSavedContent((prev) => ({
        ...prev,
        [selectedPlatform]: editedPreviews[selectedPlatform],
      }));
    }
  }, [selectedPlatform, editedPreviews]);

  // Modal open state logging
  useEffect(() => {
    console.log("=== Modal State Change ===");
    console.log("isOpen:", isOpen);
    console.log("selectedPlatform:", modalState.selectedPlatform);
  }, [isOpen, modalState.selectedPlatform]);

  if (!isOpen) {
    console.log("=== Modal Render Skip ===");
    console.log("Modal not open, returning null");
    return null;
  }

  console.log("=== Modal Render ===");
  console.log("About to render modal content, isOpen:", isOpen);

  return (
    <div className="z-50">
      {/* Modal */}
      <div className="fixed inset-y-0 right-0 bg-gray-900 border-l border-gray-600/20 shadow-xl flex flex-col transform transition-transform duration-300 w-full md:w-[400px]">
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
                    onClick={() => handlePlatformSelect(platform)}
                    className={`p-1 rounded flex items-center ${
                      currentPlatform === platform
                        ? "bg-blue-600 text-white"
                        : "bg-gray-700/50 text-gray-300 hover:bg-gray-700"
                    }`}
                  >
                    <PlatformIcon platform={platform} />
                  </button>
                );
              })}
              <button
                onClick={() => handlePlatformSelect("hackernews")}
                className={`p-1 rounded flex items-center ${
                  currentPlatform === "hackernews"
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
        <div className="flex flex-col flex-1 overflow-y-auto">
          {currentPlatform && (
            <PreviewSection
              selectedPlatform={currentPlatform}
              editedPreviews={editedPreviews as EditedPreviews}
              versions={versions}
              isPreviewMode={isPreviewMode}
              imageAssets={imageAssets}
              pageContext={pageContext}
              onPreviewEdit={handlePreviewEdit}
              onVersionSelect={handleVersionSelect}
              onSaveVersion={handleSaveVersion}
              onTogglePreviewMode={() =>
                updateModalState({
                  isPreviewMode: !isPreviewMode,
                })
              }
              onSchedule={() => setIsScheduleDialogOpen(true)}
              isUploading={isUploading}
              onImageUpload={handleImageUpload}
              onImageRemove={handleRemoveImage}
              hackernewsUrl={hackernewsUrl}
              onHackernewsUrlChange={handleHackernewsUrlChange}
            />
          )}

          <ChatSection
            message={message}
            conversations={conversations}
            selectedPlatform={currentPlatform}
            isGenerating={isGenerating}
            onMessageChange={(newMessage) =>
              updateModalState({ message: newMessage })
            }
            onSubmit={handleSubmit}
          />
        </div>
      </div>

      {currentPlatform && pendingScheduleTime && (
        <ConfirmationDialog
          isOpen={isConfirmationDialogOpen}
          onClose={() => {
            setIsConfirmationDialogOpen(false);
            setPendingScheduleTime(null);
          }}
          onConfirm={handleConfirmPost}
          content={editedPreviews[currentPlatform] || ""}
          platform={currentPlatform}
          scheduledTime={pendingScheduleTime}
          pageContext={pageContext}
          imageAssets={imageAssets}
        />
      )}

      {currentPlatform && (
        <ScheduleDialog
          isOpen={isScheduleDialogOpen}
          onClose={() => setIsScheduleDialogOpen(false)}
          onConfirm={handleSchedulePost}
          platform={currentPlatform}
        />
      )}
    </div>
  );
}
