import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import React from 'react'

const ProfileAboutSkeletonLoader = () => {
  return (
    <>
      <div className="flex flex-col gap-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton
            key={i}
            className="h-3 rounded w-full"
            style={{ width: `${Math.floor(Math.random() * 30) + 70}%` }}
          />
        ))}
      </div>

      <div className="flex items-center gap-4 flex-wrap w-full">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-7 w-20 rounded-2xl" />
        ))}
      </div>

      <div className="flex flex-col gap-5">
        <Separator className="h-0.5 bg-tertiary-bg" />

        <div className="flex items-center gap-2">
          <Skeleton className="w-5 h-5 rounded-full" />
          <Skeleton className="h-3 w-40 rounded" />
        </div>

        <div className="flex items-center gap-2">
          <Skeleton className="w-5 h-5 rounded-full" />
          <Skeleton className="h-3 w-36 rounded" />
        </div>

        <Separator className="h-0.5 bg-tertiary-bg" />

        <div className="flex gap-4 justify-between items-center max-w-[300px]">
          <div className="flex items-center gap-2">
            <Skeleton className="w-5 h-5 rounded-full" />
            <Skeleton className="h-3 w-24 rounded" />
          </div>

          <Separator className="w-0.5 h-[30px] bg-tertiary-bg" />

          <div className="flex items-center gap-2">
            <Skeleton className="w-5 h-5 rounded-full" />
            <Skeleton className="h-3 w-24 rounded" />
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl bg-secondary-bg">
        <div className="flex items-center">
          <Skeleton className="w-12 h-12 rounded-lg mr-4" />
          <div className="flex-1">
            <Skeleton className="h-3 w-40 rounded mb-2" />
            <Skeleton className="h-3 w-24 rounded" />
          </div>
          <Skeleton className="w-8 h-8 rounded-full" />
        </div>
      </div>
    </>
  );
}

export default ProfileAboutSkeletonLoader