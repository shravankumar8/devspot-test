"use client";

import React from "react";

interface ChatMessageProps {
  message: string;
  isBot?: boolean;
  avatar?: string;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({
  message,
  isBot = false,
  avatar,
}) => {
  return (
    <div
      className={`flex gap-4 mb-6 animate-fade-in ${
        isBot ? "justify-start" : "justify-end"
      }`}
    >
      {isBot && avatar && (
        <div className="flex-shrink-0">
          <img
            src={avatar}
            alt="Spot"
            className="w-10 h-10 rounded-full border-2 border-blue-500/20"
          />
        </div>
      )}
      <div
        className={`max-w-3xl px-3 py-2 rounded-[20px] ${
          isBot
            ? "bg-tertiary-bg text-gray-100 backdrop-blur-sm border border-tertiary-text"
            : "bg-main-primary text-white ml-auto"
        }`}
      >
        <p className="text-sm leading-relaxed font-roboto">{message}</p>
      </div>
    </div>
  );
};
