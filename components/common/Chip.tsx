import React from "react";
import { useFormikContext } from "formik";

type ChipProps = {
  className?: string;
  variant: "outlined" | "gradient";
  children: React.ReactNode;
  value: number;
  name: string;
  checked: boolean;
  onClick?: (role: number) => void;
  onChange?: (value: number) => void;
};

const Chip = ({
  className,
  variant,
  children,
  value,
  onClick,
  name,
  checked,
  onChange,
}: ChipProps) => {
  return (
    <div
      onClick={() => onClick && onClick(value)}
      className={`border  rounded-[40px] px-4 text-[14px] py-1.5 hover:cursor-pointer font-medium ${className} ${
        variant === "outlined"
          ? "bg-transparent border-white hover:bg-neutral-700/70 transition-all duration-100 hover:border-gray-400"
          : "bg-gradient-to-l from-[#9667FA] to-[#4075FF] border-transparent"
      }`}
    >
      <input
        type="radio"
        name={name}
        value={value}
        id={`role-${value}`}
        onChange={() => onChange && onChange(value)}
        checked={checked}
        className="hidden"
      />
      {children}
    </div>
  );
};

export default Chip;
