import * as React from "react";

import { cn } from "@/utils/tailwind-merge";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  prefixIcon?: React.ReactNode;
  /** Optional error message to display */
  error?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, prefixIcon, error, ...props }, ref) => {
    const hasError = Boolean(error);

    return (
      <div className={cn("w-full flex flex-col gap-1")}>
        <div
          className={cn(
            "flex px-5 gap-4 items-center h-[48px] w-full rounded-xl  border bg-white text-sm font-roboto transition-all duration-200 ease-in-out",
            hasError
              ? "border-red-500 focus-within:border-red-500"
              : "border-[#424248] focus-within:border-secondary-text",
            "dark:bg-tertiary-bg dark:focus-visible:border-2 dark:focus-visible:border-secondary-text",
            className
          )}
        >
          {prefixIcon && prefixIcon}
          <input
            type={type}
            ref={ref}
            {...props}
            className="h-full w-full py-1 sm:py-3 text-sm bg-transparent  placeholder:text-sm placeholder:text-secondary-text text-white font-roboto font-normal outline-none disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>
        {hasError && (
          <p
            className="text-red-500 text-xs font-medium capitalize font-roboto"
            role="alert"
          >
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };
