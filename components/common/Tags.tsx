import { TagsProps } from "@/types/hackathons";
import { cn } from "@/utils/tailwind-merge";

export const Tags = ({
  color = "#E7E7E8",
  bgColor = "#2B2B31",
  text,
}: TagsProps) => {
  return (
    <div
      className={`${cn(
        `text-[${color}] bg-[${bgColor}] capitalize rounded-[40px] px-4 h-[28px] whitespace-nowrap flex items-center text-center font-roboto text-[12px]`
      )}  `}
    >
      {text}
    </div>
  );
};
