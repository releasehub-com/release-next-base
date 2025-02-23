import type { SocialAccount } from "@/lib/db/schema";

export type MessageRole = "user" | "assistant";
export type Platform = "twitter" | "linkedin";

export interface ModalState {
  message: string;
  conversations: {
    twitter: Array<{ role: MessageRole; content: string }>;
    linkedin: Array<{ role: MessageRole; content: string }>;
  };
  selectedPlatform: Platform | null;
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
}

export interface EditedPreviews {
  twitter: string;
  linkedin: string;
}

export interface PreviewSectionProps {
  selectedPlatform: Platform;
  editedPreviews: EditedPreviews;
  versions: Versions;
  isPreviewMode: boolean;
  imageAssets: ImageAssets;
  pageContext: PageContext;
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
  onConfirm: () => void;
  content: string;
  platform: Platform;
  scheduledTime: Date;
  pageContext: PageContext;
  imageAssets: ImageAssets;
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
  conversations: ModalState["conversations"];
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
