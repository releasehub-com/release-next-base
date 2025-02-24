"use client";

import { TwitterContent } from "./platforms/TwitterContent";
import { LinkedInContent } from "./platforms/LinkedInContent";
import { TwitterEditor } from "./platforms/TwitterEditor";
import { LinkedInEditor } from "./platforms/LinkedInEditor";
import { HackerNewsContent } from "./platforms/HackerNewsContent";
import { HackerNewsEditor } from "./platforms/HackerNewsEditor";
import type {
  Platform,
  EditedPreviews,
  Versions,
  ImageAssets,
  PageContext,
} from "./types";

interface PreviewSectionProps {
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

export function PreviewSection({
  selectedPlatform,
  editedPreviews,
  versions,
  isPreviewMode,
  imageAssets,
  pageContext,
  onPreviewEdit,
  onVersionSelect,
  onSaveVersion,
  onTogglePreviewMode,
  onSchedule,
  isUploading,
  onImageUpload,
  onImageRemove,
}: PreviewSectionProps) {
  const content = editedPreviews[selectedPlatform] || "";
  const platformVersions = versions[selectedPlatform] || [];

  return (
    <div className="flex-[0.6] flex flex-col min-h-0 border-b border-indigo-500/20">
      <div className="py-2 px-3 border-b border-indigo-500/20 bg-gradient-to-r from-slate-900/50 to-indigo-950/50 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <h3 className="text-xs font-medium text-gray-300">Current Post</h3>
          <span className="text-[11px] text-gray-400">
            {isPreviewMode ? "Preview" : "Edit"}
          </span>
        </div>
        <div className="flex items-center space-x-1.5">
          {platformVersions.length > 0 && (
            <select
              className="bg-gray-700 text-white text-xs rounded px-1.5 py-0.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              onChange={(e) =>
                onVersionSelect(selectedPlatform, parseInt(e.target.value))
              }
              value=""
            >
              <option value="" disabled>
                Select version...
              </option>
              {platformVersions.map((version, index) => {
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
          {content && (
            <>
              {!isPreviewMode ? (
                <button
                  onClick={() => onSaveVersion(selectedPlatform)}
                  className="px-2 py-0.5 text-xs rounded bg-green-600 text-white hover:bg-green-700 transition-colors"
                >
                  Save
                </button>
              ) : (
                <div className="flex items-center space-x-1.5">
                  <button
                    onClick={onSchedule}
                    className={`px-2 py-0.5 text-xs rounded text-white transition-colors ${
                      selectedPlatform === "hackernews"
                        ? "bg-orange-600 hover:bg-orange-700"
                        : "bg-blue-600 hover:bg-blue-700"
                    }`}
                  >
                    {selectedPlatform === "hackernews"
                      ? "Schedule Reminder"
                      : "Schedule"}
                  </button>
                </div>
              )}
            </>
          )}
          <button
            onClick={onTogglePreviewMode}
            className="px-2 py-0.5 text-xs rounded bg-gray-700 text-white hover:bg-gray-600 transition-colors"
          >
            {isPreviewMode ? "Edit" : "Preview"}
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3">
        {selectedPlatform === "twitter" ? (
          isPreviewMode ? (
            <TwitterContent
              content={content}
              imageAssets={imageAssets.twitter}
              pageContext={pageContext}
              isPreview
            />
          ) : (
            <TwitterEditor
              content={content}
              imageAssets={imageAssets.twitter}
              isUploading={isUploading}
              onContentChange={(content) =>
                onPreviewEdit(selectedPlatform, content)
              }
              onImageUpload={onImageUpload}
              onImageRemove={(index) => onImageRemove(selectedPlatform, index)}
            />
          )
        ) : selectedPlatform === "hackernews" ? (
          isPreviewMode ? (
            <HackerNewsContent
              content={content}
              pageContext={pageContext}
              isPreview
            />
          ) : (
            <HackerNewsEditor
              content={content}
              onContentChange={(content) =>
                onPreviewEdit(selectedPlatform, content)
              }
            />
          )
        ) : isPreviewMode ? (
          <LinkedInContent
            content={content}
            imageAssets={imageAssets.linkedin}
            pageContext={pageContext}
            isPreview
          />
        ) : (
          <LinkedInEditor
            content={content}
            imageAssets={imageAssets.linkedin}
            isUploading={isUploading}
            onContentChange={(content) =>
              onPreviewEdit(selectedPlatform, content)
            }
            onImageUpload={onImageUpload}
            onImageRemove={(index) => onImageRemove(selectedPlatform, index)}
          />
        )}
      </div>
    </div>
  );
}
