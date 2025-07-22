import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/utils/tailwind-merge";

const buttonVariants = cva(
  "inline-flex items-center font-roboto justify-center whitespace-nowrap rounded-lg ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-950 focus-visible:ring-offset-2 disabled:pointer-events-none dark:ring-offset-neutral-950 dark:focus-visible:ring-neutral-300",
  {
    variants: {
      variant: {
        primary:
          "bg-neutral-900 text-neutral-50 hover:bg-neutral-900/90 dark:bg-main-primary dark:hover:bg-primary-400 dark:disabled:bg-[#424248] dark:disabled:text-secondary-text",
        special:
          "bg-red-500 text-neutral-50 hover:bg-red-500/90 dark:bg-gradient-to-l dark:from-[#9667FA] dark:to-[#4075FF] dark:text-white dark:hover:from-[#B492FC] dark:hover:to-[#6691FF] dark:disabled:bg-[#424248] dark:disabled:text-secondary-text dark:hover:bg-red-900/90",
        tertiary:
          "border-b !rounded-none !h-auto !py-0  !px-0 border-b-neutral-200  hover:text-secondary-text dark:border-b-white  dark:hover:border-b-secondary-text dark:hover:text-secondary-text dark:disabled:text-[#424248] dark:disabled:border-b-[#424248]",
        secondary:
          "bg-neutral-100 text-neutral-900 hover:bg-neutral-100/80 dark:bg-[#424248] dark:text-white dark:hover:bg-[#5A5A5F] dark:disabled:bg-[#424248] dark:disabled:text-secondary-text",
        ghost:
          "hover:bg-neutral-100 hover:text-neutral-900 dark:hover:bg-[#5A5A5F] dark:disabled:bg-[#424248] dark:disabled:text-secondary-text dark:hover:text-neutral-50 dark:bg-tertiary-bg dark:text-[#A1A1A3]",
        link: "text-neutral-900 dark:text-white dark:hover:text-secondary-text dark:disabled:text-[#424248]",
      },
      size: {
        default: "h-11 px-5 py-2 min-w-[94px] text-lg font-medium",
        sm: "h-7 rounded-[8px] px-3 text-sm font-medium",
        xs: "h-6 rounded-[8px] px-2 text-xs font-medium",
        md: "h-9 rounded-[8px] px-4 text-sm md:text-base font-medium",
        lg: "h-10 rounded-[8px] px-5 text-sm md:text-base font-medium",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      loading = false,
      children,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={loading || props.disabled}
        {...props}
      >
        {loading && (
          <svg
            className="animate-spin h-4 w-4 mr-2 text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4l3.5-3.5L12 0v4a8 8 0 000 16v-4l-3.5 3.5L12 24v-4a8 8 0 01-8-8z"
            />
          </svg>
        )}
        {children}
      </Comp>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
