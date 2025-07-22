import { Button } from "@/components/ui/button";
import { Hackathons } from "@/types/entities";
import axios from "axios";
import Link from "next/link";
import useSWR from "swr";
import HackathonCard from "./HackathonCard";
import HackathonCardSkeleton from "./HackathonSkeletonCard";

type DiscoverResponse = {
  data: Hackathons[];
  count: number;
};

const hackathonUrl = `${process.env.NEXT_PUBLIC_PROTOCOL}${process.env.NEXT_PUBLIC_BASE_SITE_URL}/hackathons`;

const HackathonCategory = () => {
  const fetchDiscoverData = async (url: string) => {
    const resp = await axios.get(url);
    return resp.data?.data as DiscoverResponse;
  };
  const { data: discoverResponse, isLoading } = useSWR<DiscoverResponse>(
    "/api/discover/hackathons",
    fetchDiscoverData
  );

  const count = discoverResponse?.count ?? 0;
  const hackathonText = count === 1 ? "hackathon" : "hackathons";

  return (
    <section className="flex flex-col gap-5 w-full">
      <div className="font-roboto flex flex-col gap-2">
        <h2 className="text-xl font-bold">Hackathons</h2>

        <span className="text-secondary-text text-sm font-medium">
          {`${count} ${hackathonText} found`}
        </span>

        <hr className="bg-[#2B2B31] h-[2px] border-none rounded-[20px]" />
      </div>

      <div className="grid grid-cols-[repeat(auto-fill,minmax(min(280px,350px),1fr))] gap-8">
        {isLoading &&
          Array.from({ length: 10 }).map((_, index) => (
            <HackathonCardSkeleton key={index} />
          ))}

        {!isLoading &&
          discoverResponse?.data.map((hackathon) => (
            <Link
              key={hackathon.id}
              href={hackathon?.id == 1 ? `/hackathons/${hackathon.id}` : "#"}
              prefetch={false}
            >
              <HackathonCard
                props={{
                  id: hackathon?.id,
                  hackathon_name: hackathon?.name,
                  organizer_name: hackathon?.organizer?.name,
                  location: hackathon?.location!,
                  start_date: hackathon?.start_date,
                  number_of_participant: hackathon?.number_of_participants ?? 0,
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
      </div>
      <div className="w-full flex justify-center mt-4">
        <Link href={hackathonUrl}>
          <Button variant="ghost">Browse all hackathons</Button>
        </Link>
      </div>
    </section>
  );
};

export default HackathonCategory;
