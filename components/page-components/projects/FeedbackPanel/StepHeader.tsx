import { cn } from "@/utils/tailwind-merge";
import { ArrowDownRight } from "lucide-react";

interface StepHeaderProps {
  collapsed: boolean;
  onToggle: () => void;
  label: string;
}

export function StepHeader({ collapsed, onToggle, label }: StepHeaderProps) {
  return (
    <div
      className="flex items-start gap-3 mb-3 cursor-pointer"
      onClick={onToggle}
    >
      <ArrowDownRight
        className={cn(
          "text-secondary-900 flex-shrink-0 transition-all duration-200 ease-in-out",
          collapsed ? "-rotate-180" : " rotate-0"
        )}
        size={16}
      />
      <p className="text-white text-xs font-medium">
        Please provide feedback on{" "}
        <span className="text-[#7C42FF]">{label}</span>
      </p>
    </div>
  );
}
