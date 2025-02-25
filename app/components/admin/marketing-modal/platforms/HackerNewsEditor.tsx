import { HackerNewsIcon } from "./HackerNewsContent";

interface HackerNewsEditorProps {
  content: string;
  onContentChange: (content: string) => void;
  url?: string;
  onUrlChange?: (url: string) => void;
}

export function HackerNewsEditor({
  content,
  onContentChange,
  url,
  onUrlChange,
}: HackerNewsEditorProps) {
  return (
    <div className="bg-[#ff6600]/10 rounded-lg p-4">
      <div className="flex flex-col gap-4">
        <div className="flex items-start gap-3">
          <HackerNewsIcon />
          <div className="flex-1">
            <textarea
              value={content || ""}
              onChange={(e) => onContentChange(e.target.value)}
              placeholder="Enter your Hacker News title..."
              className="w-full h-24 bg-gray-800 text-white rounded-lg p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <div className="mt-2 text-gray-400 text-xs">
              Write a clear, concise title that follows Hacker News guidelines
            </div>
          </div>
        </div>
        <div className="flex items-start gap-3 pl-9">
          <div className="flex-1">
            <input
              type="url"
              value={url || ""}
              onChange={(e) => onUrlChange?.(e.target.value)}
              placeholder="Enter the URL to submit..."
              className="w-full bg-gray-800 text-white rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <div className="mt-2 text-gray-400 text-xs">
              The URL of the content you want to share on Hacker News
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
