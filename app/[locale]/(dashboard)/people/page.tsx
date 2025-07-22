"use client";
import PeopleCard from "@/components/page-components/dashboard/sections/people/PeopleCard";
import PeopleCardSkeleton from "@/components/page-components/dashboard/sections/people/PeopleSkeletonCard";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { useAuthStore } from "@/state";
import { Users } from "@/types/entities";
import Link from "next/link";

export default function PeoplePage() {
  const { user } = useAuthStore();

  const {
    data: users,
    isLoading,
    isLoadingMore,
    loadMoreRef,
    totalCount
  } = useInfiniteScroll<Users>("/api/people", 50);

  return (
    <section className="flex py-1 md:px-3 flex-col gap-5 w-full">
      <div className="font-roboto flex flex-col gap-2">
        <h4 className="font-bold text-[28px]">People</h4>

        <span className="text-secondary-text text-sm">
          {totalCount} people found
        </span>

        <hr className="bg-[#2B2B31] h-[2px] border-none rounded-[20px]" />
      </div>

      <div className="grid grid-cols-[repeat(auto-fill,minmax(min(280px,350px),1fr))] gap-8">
        {users
          ?.filter((participant) => participant.id !== user?.id)
          .map((participant) => (
            <Link key={participant.id} href={`/people/${participant.id}`}>
              <PeopleCard participant={participant} showTeamUp={false} />
            </Link>
          ))}

        {(isLoading || isLoadingMore) &&
          Array.from({ length: 10 }).map((_, index) => (
            <PeopleCardSkeleton key={index} />
          ))}

        <div ref={loadMoreRef} className="h-1" />
      </div>
    </section>
  );
}
