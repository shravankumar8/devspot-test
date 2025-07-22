"use client";

import { Skeleton } from "@/components/ui/skeleton";

const CertificationTagSkeleton = () => {
  const width = `${Math.floor(Math.random() * (180 - 120) + 120)}px`;

  return (
    <Skeleton style={{ width }} className="h-8 rounded-full bg-gray-700/50" />
  );
};

export default CertificationTagSkeleton;
