"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowUp } from "lucide-react";
import React, { useState } from "react";
import { SuggestedActions } from "./suggestedActions";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  placeholder?: string;
  handleActionClick: (action: string) => void;
  showSuggestions: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  showSuggestions,
  handleActionClick,
  placeholder = "Reply to Spot...",
}) => {
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message.trim());
      setMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="sticky !z-50 bottom-0 left-0 right-0 p-6 ">
      {showSuggestions && (
        <div className="mt-8 max-w-4xl mx-auto">
          <SuggestedActions onActionClick={handleActionClick} />
        </div>
      )}
      <div className="max-w-4xl mx-auto">
        <form onSubmit={handleSubmit} className="relative">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={placeholder}
            className="w-full bg-gray-800/60 border-gray-600/50 text-gray-100 placeholder-gray-400 rounded-2xl pl-6 pr-14 py-4 text-sm backdrop-blur-sm focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200"
          />
          <Button
            type="submit"
            size="sm"
            disabled={!message.trim()}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:opacity-50 rounded-xl w-8 h-8 p-0 transition-all duration-200"
          >
            <ArrowUp className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </div>
  );
};
