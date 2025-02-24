import { HackerNewsIcon } from "./HackerNewsContent";

interface HackerNewsEditorProps {
  content: string;
  onContentChange: (content: string) => void;
}

export function HackerNewsEditor({
  content,
  onContentChange,
}: HackerNewsEditorProps) {
  return (
    <div className="bg-[#ff6600]/10 rounded-lg p-4">
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
    </div>
  );
}
