import { cn } from "@/utils/tailwind-merge";
import { ReactNode } from "react";

interface CollapsibleCardProps {
  collapsed: boolean;
  children: ReactNode;
}

export function CollapsibleCard({ collapsed, children }: CollapsibleCardProps) {
  return (
    <div
      className={cn(
        "fixed font-roboto right-4 bottom-44 z-20 transition-all duration-200 ease-in-out shadow-lg",
        collapsed ? "max-h-12" : "max-h-[500px]"
      )}
    >
      <div className="w-80 rounded-xl p-4 border-2 border-secondary-900 bg-primary-300 backdrop-blur-md flex flex-col gap-3">
        {children}
      </div>
    </div>
  );
}
