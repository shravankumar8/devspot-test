import { cn } from "@/utils/tailwind-merge";
import { LabelHTMLAttributes } from "react";

interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
  name?: string;
}

const Label = (props: LabelProps) => {
  const { children, name, required,className, ...rest } = props;
  return (
    <label
      htmlFor={name}
      className={cn("text-sm font-normal text-secondary-text font-roboto", className)}
      {...rest}
    >
      {children}

      {required && <span className="text-sm leading-none ml-1 text-red-400">*</span>}
    </label>
  );
};

export default Label;
