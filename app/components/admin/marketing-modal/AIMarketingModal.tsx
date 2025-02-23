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

export default function AIMarketingModal({
  isOpen,
  onClose,
  pageContext,
  accounts,
  modalState,
  onModalStateChange,
}: AIMarketingModalProps) {
  const [isScheduleDialogOpen, setIsScheduleDialogOpen] = useState(false);
  const [isConfirmationDialogOpen, setIsConfirmationDialogOpen] = useState(false);
  const [pendingScheduleTime, setPendingScheduleTime] = useState<Date | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [lastSavedContent, setLastSavedContent] = useState<EditedPreviews>({
    twitter: modalState.editedPreviews.twitter || "",
    linkedin: modalState.editedPreviews.linkedin || "",
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
  } = modalState;

  const currentPlatform = selectedPlatform as Platform | null;

  const updateModalState = (updates: Partial<typeof modalState>) => {
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
    updateModalState({
      editedPreviews: {
        ...editedPreviews,
        [platform]: content,
      },
    });
  };

  const handleSaveVersion = (platform: Platform) => {
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
        ...(conversations[selectedPlatform] || []),
        { role: "user" as const, content: message },
      ];

      updateModalState({
        conversations: {
          ...conversations,
          [selectedPlatform]: newConversation,
        },
        message: "",
      });

      const currentPreview = editedPreviews[selectedPlatform];
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
    }
    setIsGenerating(false);
  };

  const handleVersionSelect = (platform: Platform, versionIndex: number) => {
    const selectedVersion = versions[platform][versionIndex];
    updateModalState({
      editedPreviews: {
        ...editedPreviews,
        [platform]: selectedVersion.content,
      },
    });
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

  const handleSchedulePost = async (scheduledFor: Date) => {
    if (!selectedPlatform || !editedPreviews[selectedPlatform]) return;

    if (!validateContent(selectedPlatform, editedPreviews[selectedPlatform])) {
      alert("Content is too long for the selected platform. Please shorten your message.");
      return;
    }

    setPendingScheduleTime(scheduledFor);
    setIsScheduleDialogOpen(false);
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
      const account = accounts.find((acc) => acc.provider === selectedPlatform);
      if (!account) return;

      const platformImageAssets = imageAssets[selectedPlatform] || [];

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

  const setIsSidebarOpen = useSidebarStore((state) => state.setIsOpen);

  useEffect(() => {
    setIsSidebarOpen(isOpen);
  }, [isOpen, setIsSidebarOpen]);

  const togglePreviewMode = () => {
    updateModalState({
      isPreviewMode: !isPreviewMode,
    });
  };

  if (!isOpen) return null;

  return (
    <div>
      <div className={`fixed inset-y-0 right-0 bg-gray-900/95 border-l border-gray-600/20 shadow-xl z-50 flex flex-col transform transition-transform duration-300 w-full md:w-[400px] backdrop-blur-sm ${isOpen ? "translate-x-0" : "translate-x-full"}`}>
        {/* Header */}
        <div className="flex items-center justify-between py-2 px-3 border-b border-gray-600/20 bg-gray-800/50">
          <div className="flex items-center gap-2">
            <div className="flex items-center">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse mr-1.5" />
              <h2 className="text-sm font-medium text-gray-100">AI Assistant</h2>
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
                      currentPlatform === account.provider
                        ? "bg-blue-600 text-white"
                        : "bg-gray-700/50 text-gray-300 hover:bg-gray-700"
                    }`}
                  >
                    <PlatformIcon platform={platform} />
                  </button>
                );
              })}
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-300 p-1 rounded-lg hover:bg-gray-700/50"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Main content area */}
        <div className="flex flex-col flex-1 overflow-hidden">
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
            selectedPlatform={currentPlatform}
            isGenerating={isGenerating}
            onMessageChange={(newMessage) => updateModalState({ message: newMessage })}
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