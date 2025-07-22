"use client";

import { Button } from "@/components/ui/button";
import { Users } from "@/types/entities";
import axios from "axios";
import Link from "next/link";
import useSWR from "swr";
import PeopleCard from "./PeopleCard";
import PeopleCardSkeleton from "./PeopleSkeletonCard";

type DiscoverResponse = {
  data: Users[];
  count: number;
};

const PeopleCategory = () => {
  const fetchDiscoverData = async (url: string) => {
    const resp = await axios.get(url);
    return resp.data?.data as DiscoverResponse;
  };
  const { data: discoverResponse, isLoading } = useSWR<DiscoverResponse>(
    "/api/discover/people",
    fetchDiscoverData
  );

  const count = discoverResponse?.count ?? 0;

  return (
    <section className="flex flex-col gap-5 w-full">
      <div className="font-roboto flex flex-col gap-2">
        <h2 className="text-xl font-bold">People</h2>

        <span className="text-secondary-text text-sm font-medium">
          {`${count} people found`}
        </span>

        <hr className="bg-[#2B2B31] h-[2px] border-none rounded-[20px]" />
      </div>

      <div className="grid grid-cols-[repeat(auto-fill,minmax(min(280px,350px),1fr))] gap-8">
        {isLoading &&
          Array.from({ length: 10 }).map((_, index) => (
            <PeopleCardSkeleton key={index} />
          ))}

        {!isLoading &&
          discoverResponse?.data.map((user) => (
            <Link key={user.id} href={`/people/${user.id}`}>
              <PeopleCard participant={user} showTeamUp={false} />
            </Link>
          ))}
      </div>
      <div className="w-full flex justify-center mt-4">
        <Link href="/people">
          <Button variant="ghost">Browse all people</Button>
        </Link>
      </div>
    </section>
  );
};

export default PeopleCategory;
