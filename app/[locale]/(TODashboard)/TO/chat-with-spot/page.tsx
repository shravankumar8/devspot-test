"use client";

import { useState } from "react";
import { toast } from "sonner";
import { ChatInput } from "./chatInput";
import { ChatMessage } from "./chatMessage";

interface Message {
  id: number;
  text: string;
  isBot: boolean;
  timestamp: Date;
}

const ChatWithSpot = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Welcome to DevSpot! I can help you create your technology profile, host a hackathon, and more. What can I do for you?",
      isBot: true,
      timestamp: new Date(),
    },
  ]);
  const [showSuggestions, setShowSuggestions] = useState(true);

  const handleSendMessage = (messageText: string) => {
    const newMessage: Message = {
      id: messages.length + 1,
      text: messageText,
      isBot: false,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setShowSuggestions(false);

    // Simulate bot response
    setTimeout(() => {
      const botResponse: Message = {
        id: messages.length + 2,
        text: "Thanks for your message! I'm processing your request and will help you with that shortly.",
        isBot: true,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botResponse]);
    }, 1000);

    toast.success("Message sent!");
  };

  const handleActionClick = (action: string) => {
    handleSendMessage(action);
  };
  return (
    // <div className="h-[calc(100vh-80px)] py-1 md:px-3">
    //   <EmptyPage
    //     description="Come back soon to view Chat with spot."
    //     showButton={false}
    //   />
    // </div>

    <div className=" text-white relative overflow-hidden">
      {/* Background decoration */}

      {/* Main content */}
      <div className="relative z-10 min-h-[calc(100vh-70px)] flex flex-col">
        {/* Chat messages area */}
        <div className="flex-1 overflow-y-scroll max-h-[calc(100vh-170px)] pt-8 pb-32">
          <div className="max-w-4xl mx-auto px-6">
            {messages.map((message) => (
              <ChatMessage
                key={message.id}
                message={message.text}
                isBot={message.isBot}
                avatar={message.isBot ? "/Oval.png" : undefined}
              />
            ))}
          </div>
        </div>

        {/* Chat input */}
        <ChatInput
          onSendMessage={handleSendMessage}
          handleActionClick={handleActionClick}
          showSuggestions={showSuggestions}
        />
      </div>
    </div>
  );
};

export default ChatWithSpot;
