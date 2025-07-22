import React, { useEffect, useState } from "react";

interface ScoreInputProps {
  name?: string;
  value?: number;
  onChange?: (value: number) => void;
  readOnly?: boolean;
}

const ScoreInput: React.FC<ScoreInputProps> = ({
  name = "score",
  value: controlledValue,
  onChange,
  readOnly = false,
}) => {
  const [internalValue, setInternalValue] = useState<number>(
    controlledValue ?? 0
  );

  useEffect(() => {
    if (typeof controlledValue === "number") {
      setInternalValue(controlledValue);
    }
  }, [controlledValue]);

  const handleClick = (val: number) => {
    if (readOnly) return;
    setInternalValue(val);
    onChange?.(val);
  };

  return (
    <div
      className={`rounded-xl overflow-hidden ${
        readOnly ? "opacity-60 pointer-events-none" : "bg-white"
      }`}
    >
      <div className="grid grid-cols-10 border border-primary-400 rounded-xl overflow-hidden">
        {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => {
          const isSelected = num <= internalValue;
          const backgroundClass = isSelected ? "bg-primary-300" : "bg-white";
          const borderClass = isSelected
            ? "border-primary-900"
            : "border-primary-400";
          const textClass = isSelected
            ? "text-primary-900"
            : "text-primary-400";

          return (
            <button
              key={num}
              type="button"
              onClick={() => handleClick(num)}
              disabled={readOnly}
              className={`w-full h-12 flex items-center justify-center border-l first:border-l-0 ${borderClass} ${textClass} ${backgroundClass} font-semibold transition-all duration-200 focus:outline-none ${
                readOnly ? "cursor-not-allowed" : "cursor-pointer"
              }`}
            >
              {num}
            </button>
          );
        })}
      </div>

      <input type="hidden" name={name} value={internalValue} />
    </div>
  );
};

export default ScoreInput;
