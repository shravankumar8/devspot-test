"use client";

import EmptyPage from "@/components/page-components/dashboard/EmptyPage";
import TechnologyOwnersCard from "@/components/page-components/dashboard/technology-owners/technologyOwnersCard";
import TechnologyOwnersCardSkeleton from "@/components/page-components/dashboard/technology-owners/technologyOwnersLoader";
import { TechOwners } from "@/mocked_data/data-helpers/technowners/techowners";
import { TechnologyOwners } from "@/types/entities";
import axios from "axios";
import Link from "next/link";
import useSWR from "swr";

export default function TechnologyOwnersPage() {
  const fetchTechOwners = async (url: string) => {
    const resp = await axios.get(url);
    return resp.data as TechnologyOwners[];
  };

  const { data: techOwners, isLoading } = useSWR<TechnologyOwners[]>(
    `/api/technology_owner`,
    fetchTechOwners
  );


  console.log(techOwners);
  return (
    // <div className="h-[calc(100vh-80px)] py-1 md:px-3">
    //   <h4 className="font-bold text-[28px]">Technology Owners</h4>
    //   <EmptyPage description="Come back soon to view technology owners." />
    // </div>
    TechOwners?.length === 0 ? (
      <div className="py-1 md:px-3">
        <h4 className="font-semibold text-[32px]">Technology Owners</h4>
        <EmptyPage description="No technology owners to view." />
      </div>
    ) : (
      <section className="flex py-1 md:px-3 flex-col gap-5 w-full">
        <div className="font-roboto flex flex-col gap-2">
          <h4 className="font-semibold text-[32px]">Technology Owners</h4>

          <span className="text-secondary-text text-sm">
            {techOwners?.length} technology owners found
          </span>

          <hr className="bg-[#2B2B31] h-[2px] border-none rounded-[20px]" />
        </div>

        <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-8">
          {isLoading &&
            Array.from({ length: 9 }).map((_, index) => (
              <TechnologyOwnersCardSkeleton key={index} />
            ))}
          {techOwners?.map((owner) => (
            <Link
              key={owner.id}
              href={owner?.id == 1 ? `/technology-owners/${owner.id}` : "#"}
            >
              <TechnologyOwnersCard techOwners={owner} />
            </Link>
          ))}
        </div>
      </section>
    )
  );

  // );
}
