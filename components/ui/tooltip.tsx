"use client";

import * as React from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { cn } from "@/utils/tailwind-merge";


interface TooltipProps {
  children: React.ReactNode;
}

export const TooltipProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <TooltipPrimitive.Provider delayDuration={100}>
    {children}
  </TooltipPrimitive.Provider>
);

export const Tooltip: React.FC<TooltipProps> = ({ children }) => (
  <TooltipPrimitive.Root>{children}</TooltipPrimitive.Root>
);

export const TooltipTrigger: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => <TooltipPrimitive.Trigger asChild>{children}</TooltipPrimitive.Trigger>;

export const TooltipContent: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => (
  <TooltipPrimitive.Content
    side="top"
    align="center"
    className={cn(
      "z-50 p-3 font-roboto text-xs text-white bg-secondary-bg rounded-md shadow-md",
      "animate-fadeIn",
      className
    )}
  >
    {children}
    <TooltipPrimitive.Arrow className="fill-gray-800" />
  </TooltipPrimitive.Content>
);
