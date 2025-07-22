import React, { InputHTMLAttributes, useMemo, useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import Label from "./label";
import { cn } from "@/utils/tailwind-merge";

interface OptionalParams {
  label: string;
  error: string;
  prefixIcon: React.ReactNode;
  suffixIcon: React.ReactNode;
}

type TInputProps = Partial<OptionalParams> &
  InputHTMLAttributes<HTMLInputElement> & {
    name: string;
  };

export const Input = (props: TInputProps) => {
  const { name, label, prefixIcon, suffixIcon, className, ...others } = props;

  const [secure, setSecure] = useState(true);

  const passwordIcon = useMemo(() => {
    return (
      <button
        className="my-auto cursor-pointer pe-4"
        onClick={() => setSecure(!secure)}
      >
        {secure ? <FiEye /> : <FiEyeOff />}
      </button>
    );
  }, [secure, setSecure]);

  return (
    <div className="flex w-full flex-col gap-2">
      {label && <Label>{label}</Label>}

      <div
        className={cn(
          `flex p-4 flex-row gap-x-2 bg-[#2B2B31] overflow-hidden rounded-[12px] border border-[#424248] duration-200 ease-in focus-within:border-primary`,
          className
        )}
      >
        {prefixIcon}

        <input
          disabled={others.disabled}
          id={name}
          className={cn(
            `bg-transparent placeholder:text-secondary-text text-white flex-1 w-full outline-none  disabled:cursor-not-allowed disabled:bg-[#F9F9F9]`, prefixIcon && "pl-3"
          )}
          {...others}
          type={
            others.type === "password"
              ? secure
                ? "password"
                : "text"
              : others.type
          }
        />

        {others.type === "password" && passwordIcon}

        {suffixIcon}
      </div>
    </div>
  );
};
