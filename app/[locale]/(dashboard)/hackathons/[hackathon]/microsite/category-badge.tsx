import { cn } from "@/utils/tailwind-merge";
import React from "react";


interface CategoryBadgeProps {
  children: React.ReactNode;
  className?: string;
}

const CategoryBadge = ({ children, className }: CategoryBadgeProps) => {
  return (
    <div
      className={cn(
        "text-sm font-roboto px-3 py-1.5 rounded-full border border-[#FFFFFF] bg-transparent text-white",
        className
      )}
    >
      {children}
    </div>
  );
};

export default CategoryBadge;
