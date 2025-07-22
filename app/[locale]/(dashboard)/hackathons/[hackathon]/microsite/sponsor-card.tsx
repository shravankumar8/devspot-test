import { cn } from "@/utils/tailwind-merge";
import React from "react";

interface SponsorCardProps {
  name: string;
  imageSrc?: string;
  className?: string;
  dark?: boolean;
}

const SponsorCard = ({
  name,
  imageSrc,
  className,
  dark = true,
}: SponsorCardProps) => {
  return (
    <div
      className={cn(
        "flex items-center gap-3 px-4 py-3 rounded-[20px] min-w-[228px]",
        dark ? "bg-secondary-bg" : "bg-gray-800 bg-opacity-50",
        className
      )}
    >
      {imageSrc && (
        <div className="w-11 h-11 rounded-full overflow-hidden">
          <img src={imageSrc} alt={name} className="h-full w-full" />
        </div>
      )}
      <span className="text-white font-medium text-sm">{name}</span>
    </div>
  );
};

export default SponsorCard;
