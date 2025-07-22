"use client";

import React from "react";
import { Button } from "@/components/ui/button";

interface SuggestedActionsProps {
  onActionClick: (action: string) => void;
}

export const SuggestedActions: React.FC<SuggestedActionsProps> = ({
  onActionClick,
}) => {
  const actions = [
    "Help me create a hackathon",
    "Create my technology profile",
    "I want to explore DevSpot",
  ];

  return (
    <div className="flex flex-wrap gap-3 mb-6 animate-fade-in">
      {actions.map((action, index) => (
        <Button
          key={index}
          variant="ghost"
          size="sm"
          onClick={() => onActionClick(action)}
          className="tags-gradient-border rounded-full px-4 py-2 text-sm backdrop-blur-sm"
        >
          {action}
        </Button>
      ))}
    </div>
  );
};
