"use client";

import { useTransition, useState } from "react";
import { signInWithProvider } from "@/app/[locale]/(authRoutes)/sign-up/actions";
import Image from "next/image";

export default function LogInButton({
  provider,
  image_src,
  options = {},
}: Readonly<{
  provider: string;
  image_src: string;
  options?: Record<string, any>;
}>) {
  const [isPending, startTransition] = useTransition();
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = (formData: FormData) => {
    setIsLoading(true);
    formData.append("provider", provider.toLowerCase());
    formData.append("options", JSON.stringify(options));

    startTransition(async () => {
      const { data, errorMessage } = await signInWithProvider(formData);
      if (data) {
        window.location.href = data.url;
      } else if (errorMessage) {
        console.error("Login error:", errorMessage);
        setIsLoading(false);
      }
    });
  };

  return (
    <form className="flex w-full justify-center rounded-[12px] py-[10px] items-center mb-2 bg-[#2B2B31]">
      <button
        className="flex w-full justify-center gap-2 items-center"
        formAction={handleClick}
        disabled={isPending || isLoading}
      >
        <Image
          src={image_src}
          width={25}
          height={25}
          className="object-contain"
          alt={`${provider} Icon`}
        />
        {isPending || isLoading ? "Connecting..." : `Continue with ${provider}`}
      </button>
    </form>
  );
}
