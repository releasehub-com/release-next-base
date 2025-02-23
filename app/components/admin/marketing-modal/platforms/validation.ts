import { Platform } from "../types";
import { calculateTwitterLength } from "./TwitterEditor";

export function validateContent(platform: Platform, content: string): boolean {
  if (!content) return false;

  if (platform === "twitter") {
    return calculateTwitterLength(content) <= 280;
  }

  // LinkedIn
  return content.length <= 3000;
}

export function getMaxImages(platform: Platform): number {
  return platform === "twitter" ? 4 : 9;
}
