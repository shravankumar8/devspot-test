"use client";

import { useCallback, useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

const SkeletonStatCard = () => {
  const [itemsToShow, setItemsToShow] = useState(4);

  const updateItemsToShow = useCallback(() => {
    const width = window.innerWidth;
    if (width < 430) setItemsToShow(2);
    else if (width >= 430 && width < 768) setItemsToShow(3);
    else if (width >= 768 && width < 1024) setItemsToShow(4);
    else if (width >= 1024 && width < 1200) setItemsToShow(2);
    else if (width >= 1200 && width < 2050) setItemsToShow(3);
    else if (width >= 2050) setItemsToShow(4);
  }, []);

  useEffect(() => {
    updateItemsToShow();
    window.addEventListener("resize", updateItemsToShow);
    return () => window.removeEventListener("resize", updateItemsToShow);
  }, [updateItemsToShow]);

  return (
    <div className="bg-devspot-gray-200 border border-devspot-gray-300 w-full h-[60px] rounded-xl flex gap-1 sm:gap-3 overflow-hidden">
      <div className="flex items-center justify-center bg-[#1B1B22] h-[60px] w-[42px]">
        <Skeleton className="h-6 w-6 rounded-md" />
      </div>

      <div className="flex items-center justify-center gap-2 w-[80%] h-[60px] overflow-scroll">
        {Array.from({ length: itemsToShow }).map((_, index) => (
          <div key={index} className="flex items-center">
            <div className="flex flex-col items-center gap-0 flex-shrink-0 min-w-[50px]">
              <Skeleton className="h-6 w-12 mb-1" />
              <Skeleton className="h-2 w-14" />
            </div>

            {index < itemsToShow - 1 && (
              <div className="bg-devspot-gray-300 w-0.5 h-11 flex-shrink-0 ml-2"></div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SkeletonStatCard;
