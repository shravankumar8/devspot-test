import { FC } from "react";

interface RatingButtonsProps {
  value: number | null;
  onChange: (n: number) => void;
  label: string;
}

export const RatingButtons: FC<RatingButtonsProps> = ({
  value,
  onChange,
  label,
}) => (
  <div className="flex flex-col gap-2">
    <h3 className="text-white text-xs font-medium">{label}</h3>

    <div className="flex gap-0 overflow-hidden">
      {[1, 2, 3, 4, 5].map((num) => {
        const isSelected = num <= (value || 0);
        const isFirst = num === 1;
        const isLast = num === 5;
        const base = "flex-1 py-2 px-3 text-sm font-medium transition-all";
        const color = isSelected
          ? "bg-[#7c42ff] text-[#E6DBFF]"
          : "bg-[#F7F7FF] text-[#A076FF]";
        const border = isSelected
          ? `border-[#E6DBFF] ${
              isFirst ? "border-2" : "border-t-2 border-r-2 border-b-2"
            }`
          : `border-main-secondary ${
              isFirst ? "border" : "border-t border-r border-b"
            }`;
        const round = [
          isFirst && "rounded-tl-full rounded-bl-full",
          isLast && "rounded-tr-full rounded-br-full",
        ]
          .filter(Boolean)
          .join(" ");

        return (
          <button
            key={num}
            type="button"
            onClick={() => onChange(num)}
            className={`${base} ${color} ${border} ${round}`}
          >
            {num}
          </button>
        );
      })}
    </div>
  </div>
);
