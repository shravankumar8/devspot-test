"use client";

import { cn } from "@/utils/tailwind-merge";
import * as React from "react";

export interface CheckboxProps
  extends React.InputHTMLAttributes<HTMLDivElement> {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  variant?: "default" | "light" | "danger"; // Add your custom variants here
}

const variantStyles = {
  default: {
    border: "dark:border-[#4E52F5] border-main-primary",
    checkbg: "dark:bg-[#4E52F5] bg-main-primary",
    bg: "bg-tertiary-bg",
    check: "fill-white",
  },
  light: {
    border: "dark:border-[#0005DB] border-[#0005DB]/60",
    checkbg: "dark:bg-[#0005DB] bg-main-primary",
    bg: "bg-white",
    check: "fill-white",
  },
  danger: {
    border: "dark:border-red-600 border-red-500",
    checkbg: "dark:bg-red-600 bg-red-500",
    bg: "bg-red-400",
    check: "fill-white",
  },
};

const Checkbox = React.forwardRef<HTMLDivElement, CheckboxProps>(
  (
    {
      className,
      checked = false,
      onCheckedChange,
      disabled,
      variant = "default",
      ...props
    },
    ref
  ) => {
    const handleChange = () => {
      if (onCheckedChange && !disabled) {
        onCheckedChange(!checked);
      }
    };

    const styles = variantStyles[variant] || variantStyles.default;

    return (
      <div
        ref={ref}
        className={cn(
          "w-4 h-4 md:w-5 md:h-5 border-2 rounded cursor-pointer flex items-center justify-center transition-colors",
          disabled ? "dark:border-gray-600 border-gray-600" : styles.border,
          checked ? styles.checkbg : "hover:border-gray-400",
          styles.bg,
          className
        )}
        onClick={handleChange}
        role="checkbox"
        aria-checked={checked}
        tabIndex={0}
        onKeyDown={(e) => {
          if ((e.key === "Enter" || e.key === " ") && !disabled) {
            handleChange();
            e.preventDefault();
          }
        }}
        {...props}
      >
        {checked && (
          <svg
            width="14"
            height="11"
            viewBox="0 0 14 11"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={styles.check}
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M2.94735 3.95192C2.78921 3.78819 2.60005 3.65759 2.3909 3.56775C2.18175 3.4779 1.9568 3.43061 1.72918 3.42864C1.50156 3.42666 1.27582 3.47003 1.06514 3.55623C0.854465 3.64243 0.663062 3.76972 0.502103 3.93068C0.341144 4.09163 0.213853 4.28304 0.127657 4.49372C0.0414616 4.7044 -0.00191325 4.93013 6.47252e-05 5.15775C0.0020427 5.38538 0.0493327 5.61032 0.139177 5.81947C0.229021 6.02862 0.35962 6.21779 0.523352 6.37592L3.95192 9.80449C4.2734 10.1259 4.70936 10.3064 5.16392 10.3064C5.61849 10.3064 6.05445 10.1259 6.37592 9.80449L13.2331 2.94735C13.3968 2.78921 13.5274 2.60005 13.6172 2.3909C13.7071 2.18175 13.7544 1.9568 13.7564 1.72918C13.7583 1.50156 13.715 1.27582 13.6288 1.06515C13.5426 0.854466 13.4153 0.663063 13.2543 0.502104C13.0934 0.341145 12.902 0.213854 12.6913 0.127658C12.4806 0.0414624 12.2549 -0.00191325 12.0272 6.47241e-05C11.7996 0.00204269 11.5747 0.0493335 11.3655 0.139177C11.1564 0.229021 10.9672 0.359621 10.8091 0.523352L5.16392 6.1685L2.94735 3.95192Z"
            />
          </svg>
        )}
      </div>
    );
  }
);

Checkbox.displayName = "Checkbox";

export { Checkbox };
