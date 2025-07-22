import { cn } from "@/utils/tailwind-merge";
import { ChangeEvent, InputHTMLAttributes, TextareaHTMLAttributes, useState } from "react";

type TTextAreaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  name: string;
  label?: string;
  rows?: number;
  /** Optional error message to display */
  error?: string;
  maxWordLength?: number;
  showMaxLength?: boolean;
};

export const TextArea = ({
  name,
  label,
  className,
  value = "",
  onChange,
  rows,
  maxWordLength = 250,
  error,
  showMaxLength = true,
  ...others
}: TTextAreaProps) => {
  const [wordLength, setWordLength] = useState(() =>
    countWords(value.toString())
  );
  const hasError = Boolean(error);

  function countWords(text: string) {
    return text.replace(/\s/g, "").length;
  }

  const handleBlur = (e: ChangeEvent<HTMLTextAreaElement>) => {
    let text = e.target.value;
    const words = text
      .trim()
      .split(/\s+/)
      .filter((w) => w);

    if (words.length > maxWordLength) {
      text = words.slice(0, maxWordLength).join(" ");
      e.target.value = text;
    }

    setWordLength(countWords(text));
    onChange?.(e);
  };

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setWordLength(countWords(e.target.value));
    onChange?.(e);
  };

  return (
    <label htmlFor={name} className="flex w-full flex-col gap-2 font-roboto">
      <textarea
        id={name}
        name={name}
        rows={rows}
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        className={cn(
          "flex px-5 py-3 text-sm font-normal bg-[#2B2B31] rounded-[12px] min-h-[105px] outline-none transition-all duration-200 ease-in-out flex-row border",
          hasError
            ? "border-red-500 focus:border-red-500"
            : "border-tertiary-text focus:border-secondary-text",
          "dark:bg-tertiary-bg dark:focus-visible:border-secondary-text",
          className
        )}
        {...others}
      />

      {showMaxLength && (
        <div className="flex items-center gap-4">
          <span
            className={cn(
              "text-sm",
              wordLength === maxWordLength
                ? "text-red-500"
                : "text-secondary-text"
            )}
          >
            {wordLength}/{maxWordLength} characters
          </span>

          {wordLength >= maxWordLength && (
            <p className="text-red-500 text-xs mt-1">
              Maximum word limit of {maxWordLength} reached.
            </p>
          )}
        </div>
      )}

      {/* <Button className="w-fit h-9 text-sm" disabled>
        Write with Ai
      </Button> */}
      {hasError && (
        <p className="text-red-500 text-xs font-medium capitalize" role="alert">
          {error}
        </p>
      )}
    </label>
  );
};
