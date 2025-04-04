"use client";

import { useRef, useEffect } from "react";
import type { ChatSectionProps } from "./types";

export function ChatSection({
  message,
  conversations,
  selectedPlatform,
  isGenerating,
  onMessageChange,
  onSubmit,
}: ChatSectionProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversations, selectedPlatform]);

  const currentConversation =
    conversations[selectedPlatform as "twitter" | "linkedin"] || [];

  return (
    <div className="flex-[0.4] flex flex-col min-h-0">
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {currentConversation.map((msg, i) => (
          <div
            key={i}
            className={`flex ${
              msg.role === "assistant" ? "justify-start" : "justify-end"
            }`}
          >
            <div
              className={`rounded px-3 py-1.5 max-w-[85%] ${
                msg.role === "assistant"
                  ? "bg-gray-700 text-white"
                  : "bg-indigo-600 text-white"
              }`}
            >
              <p className="whitespace-pre-wrap text-xs">{msg.content}</p>
            </div>
          </div>
        ))}
        {isGenerating && (
          <div className="flex justify-start">
            <div className="bg-gray-700 text-white rounded px-3 py-1.5 flex items-end space-x-1">
              <div
                className="w-1.5 h-1.5 bg-white rounded-full animate-bounce"
                style={{ animationDelay: "0ms" }}
              />
              <div
                className="w-1.5 h-1.5 bg-white rounded-full animate-bounce"
                style={{ animationDelay: "150ms" }}
              />
              <div
                className="w-1.5 h-1.5 bg-white rounded-full animate-bounce"
                style={{ animationDelay: "300ms" }}
              />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="p-5 border-t border-indigo-500/20 bg-gradient-to-r from-slate-900/50 to-indigo-950/50">
        <div className="flex space-x-2">
          <input
            type="text"
            value={message}
            onChange={(e) => onMessageChange(e.target.value)}
            placeholder={
              isGenerating
                ? "AI is thinking..."
                : selectedPlatform
                  ? `Type your message for ${selectedPlatform}...`
                  : "Select a platform..."
            }
            disabled={isGenerating}
            className="flex-1 bg-white/5 text-indigo-100 text-xs rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 disabled:opacity-50 disabled:cursor-not-allowed placeholder-indigo-300/30 border border-white/5"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                onSubmit();
              }
            }}
          />
          <button
            onClick={onSubmit}
            disabled={!message.trim() || isGenerating || !selectedPlatform}
            className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-indigo-100 text-xs rounded-xl px-5 py-3 hover:from-indigo-500 hover:to-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm transition-all duration-200 font-medium"
          >
            {isGenerating ? "Thinking..." : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
}
