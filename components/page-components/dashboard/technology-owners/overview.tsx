"use client"

import { TechTagIcon, WebsiteLink } from "@/components/icons/Location";
import { Button } from "@/components/ui/button";
import { useTechOwner } from "@/state/hackathon";
import { Hackathons } from "@/types/entities";
import axios from "axios";
import { Plus } from "lucide-react";
import Link from "next/link";
import useSWR from "swr";
import HackathonCard from "../../profile/ProfileTabs/Hackathons/HackathonCard";
import ProfileHackathonCardSkeleton from "../../profile/ProfileTabs/Hackathons/HackathonSkeletonCard";

type DiscoverResponse = {
  data: Hackathons[];
  count: number;
};
export const TechOwnerOverview = () => {
  const OverviewData = {
    url: "https://www.protocol.ai/",
    domain: "Software Development",
    employee_range: "201-500",
    location: "San Francisco, United States",
    technologies: [
      "Filecoin",
      "IPFS",
      "libp2p",
      "Filecoin Calibration Network",
    ],
    about:
      "About: Protocol Labs is an innovation network driving breakthroughs in computing to push humanity forward. The PL network connects 600+ startups, accelerators, foundations, open‑source projects, and more—spanning web3, AI, AR/VR, BCI, hardware, and beyond.",
  };

  const { following, setFollowing } = useTechOwner();

  const fetchDiscoverData = async (url: string) => {
    const resp = await axios.get(url);
    return resp.data?.data as DiscoverResponse;
  };
  const { data: discoverResponse, isLoading } = useSWR<DiscoverResponse>(
    "/api/discover/hackathons",
    fetchDiscoverData
  );

  return (
    <section className="flex gap-4 lg:flex-row flex-col-reverse">
      <aside className="lg:basis-[25%] basis-[100%] flex flex-col gap-4">
        <div className="w-full bg-secondary-bg px-6 rounded-[12px] py-5">
          <div className="flex items-center gap-2 mb-3 pb-3 font-roboto border-b border-b-[#424248]">
            <WebsiteLink color="#4E52F5" width="24px" height="24px" />

            <span className="text-[#89898C] text-[13px]">
              <a
                href={OverviewData.url}
                className="hover:text-main-primary"
                target="_blank"
              >
                {OverviewData.url}
              </a>
            </span>
          </div>
          <div className="flex items-center gap-2 mb-3 pb-3 font-roboto ">
            <TechTagIcon width="24px" height="24px" />
            <span className="text-[#89898C] text-[13px]">
              {OverviewData?.domain}
            </span>
          </div>
          {/* <div className="flex items-center pb-3  mb-3 gap-2 font-roboto border-b border-b-[#424248]">
            <UserSvg width="24px" height="24px" />
            <span className="text-[#89898C] text-[13px]">
              {OverviewData?.employee_range} employees
            </span>
          </div> */}
          {/* <div className="flex items-center gap-2 font-roboto ">
            <LocationSvg width="24px" height="24px" />
            <span className="text-[#89898C] text-[13px]">
              {OverviewData?.location}
            </span>
          </div> */}
        </div>
        <div className="bg-secondary-bg rounded-[12px] py-5 px-6">
          <h3 className="font-roboto text-base font-medium">Technologies</h3>
          <div className="flex gap-3 flex-wrap mt-3">
            {OverviewData.technologies.map((tech) => (
              <span
                key={tech}
                className="px-2 h-7 flex items-center bg-gradient-to-r from-[#9667FA] to-[#4075FF] rounded-[16px] text-sm font-roboto font-medium"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </aside>
      <main className="lg:basis-[75%] basis-[100%]">
        <section className="w-full bg-[#1B1B22] py-5 px-6 rounded-[12px] font-roboto">
          <p className="font-roboto text-base">About</p>
          <p className="mt-3 text-secondary-text leading-[20px] text-sm font-normal font-roboto">
            {OverviewData.about}
          </p>
          <p className="text-secondary-text leading-[20px] text-sm font-normal font-roboto">
            Learn more →{" "}
            <a
              href="https://www.plnetwork.io/"
              target="_blank"
              className="hover:text-main-primary"
            >
              https://www.plnetwork.io/
            </a>{" "}
          </p>
        </section>
        <section className="w-full bg-[#1B1B22] p-4 rounded-[12px] font-roboto mt-4">
          <p className="font-roboto text-base mb-3 font-normal">Hackathons</p>
          <div className="gap-4 grid grid-cols-1 lg:grid-cols-2">
            {isLoading &&
              Array.from({ length: 4 }).map((_, index) => (
                <ProfileHackathonCardSkeleton key={index} />
              ))}
          </div>
          {discoverResponse?.data?.length !== undefined &&
          discoverResponse?.data?.length > 0 ? (
            <div className="gap-4 grid grid-cols-1 lg:grid-cols-2">
              {!isLoading && discoverResponse && (
                <Link
                  key={discoverResponse.data[0].id}
                  href={`/hackathons/${discoverResponse.data[0].id}`}
                >
                  <HackathonCard
                    key={discoverResponse.data[0].id}
                    userHackathon={discoverResponse.data[0]}
                  />
                </Link>
              )}
            </div>
          ) : (
            <div className="w-full min-h-[500px] flex items-center justify-center">
              <div className="flex flex-col gap-2.5 items-center justify-center font-roboto">
                <h3 className="text-white leading-[24px] text-xl font-semibold">
                  Protocol Labs hasn’t hosted any hackathons yet.
                </h3>
                <p className="text-secondary-text text-sm font-normal">
                  {following
                    ? "You’ll get notified with any new updates!"
                    : "Follow them to stay updated!"}
                </p>
                {!following && (
                  <Button onClick={() => setFollowing(true)}>
                    {" "}
                    <Plus /> Follow
                  </Button>
                )}
              </div>
            </div>
          )}
        </section>
      </main>
    </section>
  );
};
