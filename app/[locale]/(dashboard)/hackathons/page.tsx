"use client";

import EmptyPage from "@/components/page-components/dashboard/EmptyPage";
import HackathonCard from "@/components/page-components/dashboard/sections/hackathons/HackathonCard";
import HackathonCardSkeleton from "@/components/page-components/dashboard/sections/hackathons/HackathonSkeletonCard";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { useHackathonStore } from "@/state/hackathon";
import { Hackathons } from "@/types/entities";
import Link from "next/link";

export default function HackathonPage() {
  const {
    data: hackathons,
    isLoading,
    isLoadingMore,
    loadMoreRef,
  } = useInfiniteScroll<Hackathons>("/api/hackathons", 10);
  const { setSelectedHackathon } = useHackathonStore();

  return (
    // <div className="h-[calc(100vh-80px)]">
    //   <h4 className="font-bold text-[28px]">Hackathons</h4>
    //   <EmptyPage description="Come back soon to view hackathons." />
    // </div>
    <section className="flex py-1 md:px-3 flex-col gap-5 w-full">
      {(isLoading || isLoadingMore) &&
        Array.from({ length: 10 }).map((_, index) => (
          <HackathonCardSkeleton key={index} />
        ))}
      {hackathons?.length === 0 ? (
        <div>
          <h4 className="font-semibold text-[32px]">Hackathons</h4>
          <EmptyPage description="Come back soon to view hackathons." />
        </div>
      ) : (
        <>
          <div className="font-roboto flex flex-col gap-2">
            <h4 className="font-semibold text-[32px]">Hackathons</h4>
            <span className="text-secondary-text text-sm">
              {hackathons?.length} hackathons found
            </span>

            <hr className="bg-[#2B2B31] h-[2px] border-none rounded-[20px]" />
          </div>

          <div className="grid grid-cols-[repeat(auto-fill,minmax(min(280px,350px),1fr))] gap-8">
            {hackathons?.map((hackathon) => (
              <Link key={hackathon.id} href={`/hackathons/${hackathon.id}`}>
                <HackathonCard
                  props={{
                    hackathon_name: hackathon?.name,
                    organizer_name: hackathon?.organizer?.name,
                    location: hackathon?.location!,
                    start_date: hackathon?.start_date,
                    number_of_participant:
                      hackathon?.number_of_participants ?? 0,
                    organizer_logo: hackathon?.organizer?.logo,
                    type: hackathon?.type,
                    status: hackathon?.status,
                    registration_start_date:
                      hackathon?.registration_start_date ?? undefined,
                    deadline_to_join: hackathon?.deadline_to_join ?? undefined,
                    submission_start_date:
                      hackathon?.submission_start_date ?? undefined,
                    deadline_to_submit:
                      hackathon?.deadline_to_submit ?? undefined,
                  }}
                />
              </Link>
            ))}

            <div ref={loadMoreRef} className="h-1" />
          </div>
        </>
      )}
    </section>
  );
}
