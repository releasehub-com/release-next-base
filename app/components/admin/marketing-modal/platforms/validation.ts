import { Platform } from "../types";
import { calculateTwitterLength } from "./TwitterEditor";

function containsUrl(text: string): boolean {
  const urlRegex = /(https?:\/\/[^\s]+)|(www\.[^\s]+)/gi;
  return urlRegex.test(text);
}

export function validateContent(platform: Platform, content: string): boolean {
  if (!content) return false;

  if (platform === "twitter") {
    return calculateTwitterLength(content) <= 280;
  }

  if (platform === "hackernews") {
    // HN titles should be under 80 characters and not contain URLs
    return content.length <= 80 && !containsUrl(content);
  }

  // LinkedIn
  return content.length <= 3000;
}

export function getMaxImages(platform: Platform): number {
  return platform === "twitter" ? 4 : 9;
}
