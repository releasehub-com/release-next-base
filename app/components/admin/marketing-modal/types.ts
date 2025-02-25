import type { SocialAccount } from "@/lib/db/schema";

export type MessageRole = "user" | "assistant";

export type Message = {
  role: MessageRole;
  content: string;
};

export type Platform = "twitter" | "linkedin" | "hackernews";

export type Conversations = {
  twitter: Array<Message>;
  linkedin: Array<Message>;
  hackernews: Array<Message>;
  current?: Array<Message>;
};

export interface ModalState {
  message: string;
  conversations: {
    twitter: Array<{ role: MessageRole; content: string }>;
    linkedin: Array<{ role: MessageRole; content: string }>;
    hackernews: Array<{ role: MessageRole; content: string }>;
  };
  selectedPlatform: Platform | null;
  preview: {
    twitter?: string;
    linkedin?: string;
    hackernews?: string;
  };
  editedPreviews: EditedPreviews;
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
    hackernews: Array<{
      content: string;
      timestamp: number;
      source: "ai" | "user";
    }>;
  };
  imageAssets: {
    twitter: Array<{ asset: string; displayUrl: string }>;
    linkedin: Array<{ asset: string; displayUrl: string }>;
  };
  hackernewsUrl?: string;
  hnTitle?: string;
}

export interface PageContext {
  url: string;
  title: string;
  description: string;
}

export interface ImageAsset {
  asset: string;
  displayUrl: string;
}

export interface ImageAssets {
  twitter: ImageAsset[];
  linkedin: ImageAsset[];
}

export interface Version {
  content: string;
  timestamp: number;
  source: "ai" | "user";
}

export interface Versions {
  twitter: Version[];
  linkedin: Version[];
  hackernews: Version[];
}

export interface EditedPreviews {
  twitter: string;
  linkedin: string;
  hackernews: string;
}

export interface PreviewSectionProps {
  selectedPlatform: Platform;
  editedPreviews: EditedPreviews;
  versions: Versions;
  isPreviewMode: boolean;
  imageAssets: ImageAssets;
  pageContext: PageContext;
  onPreviewEdit: (platform: Platform, content: string) => void;
  onVersionSelect: (platform: Platform, versionIndex: number) => void;
  onSaveVersion: (platform: Platform) => void;
  onTogglePreviewMode: () => void;
  onSchedule: () => void;
  isUploading: boolean;
  onImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onImageRemove: (platform: Platform, index: number) => void;
}

export interface PlatformContentProps {
  content: string;
  imageAssets: ImageAsset[];
  pageContext: PageContext;
  isPreview?: boolean;
}

export interface PlatformEditorProps {
  content: string;
  imageAssets: ImageAsset[];
  isUploading: boolean;
  onContentChange: (content: string) => void;
  onImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onImageRemove: (index: number) => void;
}

export interface ConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (scheduledTime: Date) => void | Promise<void>;
  content: string;
  platform: Platform;
  scheduledTime: Date;
  pageContext: PageContext;
  imageAssets: {
    twitter?: ImageAsset[];
    linkedin?: ImageAsset[];
  };
}

export interface ScheduleDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (date: Date) => void;
  platform: Platform;
  minDate?: Date;
}

export interface ChatSectionProps {
  message: string;
  conversations: Conversations;
  selectedPlatform: Platform | null;
  isGenerating: boolean;
  onMessageChange: (message: string) => void;
  onSubmit: () => void;
}

export interface AIMarketingModalProps {
  isOpen: boolean;
  onClose: () => void;
  pageContext: PageContext;
  accounts: SocialAccount[];
  modalState: ModalState;
  onModalStateChange: (state: ModalState) => void;
}
