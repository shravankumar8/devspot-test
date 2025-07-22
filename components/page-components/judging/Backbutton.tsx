"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

const BackButton = ({ url }: { url: string }) => {
  const router = useRouter();

  const handleBack = () => {
    router.push(url);
  };

  return (
    <div onClick={handleBack} className="cursor-pointer">
      <ArrowLeft size={24} className="stroke-main-primary" />
    </div>
  );
};

export default BackButton;
