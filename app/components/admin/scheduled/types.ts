import { Platform } from "../marketing-modal/types";

interface User {
  name: string;
  email: string;
  image?: string;
  id: string;
}

interface ImageAsset {
  asset: string;
  displayUrl: string;
}

export interface Post {
  id: string;
  content: string;
  status: string;
  scheduledFor: string;
  user: User;
  metadata: {
    platform: Platform;
    pageContext?: {
      title: string;
      url: string;
      description?: string;
    };
    imageAssets?: ImageAsset[];
    scheduledInTimezone?: string;
    userEmail?: string;
    userName?: string;
  };
  errorMessage?: string;
}

export interface ScheduledPost {
  id: string;
  content: string;
  scheduledFor: string;
  status: "scheduled" | "posted" | "failed";
  errorMessage?: string;
  metadata: {
    platform: string;
    pageContext: {
      title: string;
      url: string;
      description?: string;
    };
    imageAssets?: ImageAsset[];
    scheduledInTimezone?: string;
    userEmail?: string;
    userName?: string;
  };
  createdAt: string;
  updatedAt: string;
  user: User;
}
