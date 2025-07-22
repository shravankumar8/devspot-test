import { useTechOwnerStore } from "@/state/techOwnerStore";
import { HackathonCommunityPartners } from "@/types/entities";
import { cn } from "@/utils/tailwind-merge";
import axios from "axios";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import useSWR, { mutate } from "swr";
import { EditCommunityPartners } from "../EditHackathonPartners";
import { SponsorCardSkeleton } from "./sponsorSkelentonCard";

interface Sponsors {
  logo: string;
  name: string;
  tier: string;
  website: string;
  totalPrizes: number;
}

const fetchData = async (url: string) => {
  const resp = await axios.get(url);
  return resp.data?.data;
};

export const HackathonSponsors = ({
  isOwner,
  hackathonId,
}: {
  isOwner: boolean;
  hackathonId: string;
}) => {
  const { selectedOrg } = useTechOwnerStore();
  const handleSavePartners = async (formData: FormData) => {
    try {
      await axios.put(
        `/api/technology-owners/${selectedOrg?.technology_owner_id}/hackathons/${hackathonId}/edit/community-partners`,
        formData
      );

      mutate(`/api/hackathons/${hackathonId}/community-partners`);

      toast.success(`Updated Community Partners Successfully`, {
        position: "top-right",
      });
    } catch (error: any) {
      console.error("Error updating Community Partners:", error);
      toast.error(`Could not Update Community Partners ${error?.message}`, {
        position: "top-right",
      });
    }
  };

  const formatMoney = (amount: number): string => {
    return amount.toLocaleString("en-US");
  };

  const { data: sponsors, isLoading: isLoadingSponsors } = useSWR<Sponsors[]>(
    `/api/hackathons/${hackathonId}/sponsors`,
    fetchData
  );

  const { data: communityPartners, isLoading: isLoadingCommunityPartners } =
    useSWR<HackathonCommunityPartners[]>(
      `/api/hackathons/${hackathonId}/community-partners`,
      fetchData
    );

  return (
    <>
      <h4 className="font-semibold mb-4 text-[28px]">Sponsors</h4>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(min(280px,330px),1fr))] gap-6">
        {isLoadingSponsors &&
          Array.from({ length: 10 }, (_, index) => (
            <SponsorCardSkeleton key={index} type="sponsor" />
          ))}

        {!isLoadingSponsors &&
          sponsors?.map((sponsor, indx) => (
            <Link
              key={indx}
              href={sponsor?.website}
              rel="noopener noreferrer"
              target="__blank"
              className={`overflow-hidden sponsor-border relative rounded-xl h-[180px] flex-col items-center justify-center py-6 group cursor-pointer`}
            >
              <div className="absolute inset-0 z-0 group-hover:bg-gradient-to-l group-hover:from-[#9667FA] group-hover:to-[#4075FF]" />
              <div className="absolute top-2 right-2 z-10 group-hover:text-white text-secondary-text">
                <ArrowUpRight />
              </div>
              <div className="relative z-10 flex flex-col gap-3 items-center justify-center h-full">
                <div className="h-6 px-2 rounded-2xl bg-gradient-to-tr from-[#4075FF] to-[#9667FA] text-xs font-roboto flex items-center justify-center capitalize group-hover:bg-transparent group-hover:border group-hover:border-white group-hover:text-white">
                  {sponsor.tier?.trim() != "" ? sponsor.tier : "Ruby"} Sponsor
                </div>
                {Array.isArray(sponsor.logo) ? (
                  <div
                    className={cn(
                      "h-[55px] flex items-center justify-center w-[115px] gap-4"
                    )}
                  >
                    {sponsor.logo.map((logo, indx) => (
                      <img
                        key={indx}
                        src={logo}
                        alt={sponsor.name}
                        className="object-contain w-full h-full"
                      />
                    ))}
                  </div>
                ) : (
                  <div
                    className={cn(
                      "h-[55px] flex items-center justify-center w-[172px]"
                    )}
                  >
                    <img
                      src={sponsor.logo}
                      alt={sponsor.name}
                      className="object-contain w-full h-full"
                    />
                  </div>
                )}

                {/* Price */}
                <div>
                  <p className="text-sm font-semibold bg-gradient-to-r from-[#4075FF] to-[#9667FA] bg-clip-text text-transparent group-hover:bg-none group-hover:text-white">
                    ${formatMoney(sponsor.totalPrizes)}
                  </p>
                </div>
              </div>
            </Link>
          ))}
      </div>
      <h4 className="font-semibold mt-8 mb-4 text-[28px]">
        Community Partners
      </h4>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(min(140px,165px),1fr))] gap-6 relative">
        {isLoadingCommunityPartners &&
          Array.from({ length: 10 }, (_, index) => (
            <SponsorCardSkeleton key={index} type="community-partner" />
          ))}

        {!isLoadingCommunityPartners &&
          communityPartners
            ?.filter((sponsor) => sponsor.logo_url)
            .map((sponsor, indx) => (
              <Link
                key={indx}
                href={sponsor.partner_website}
                rel="noopener noreferrer"
                target="__blank"
                className={`overflow-hidden sponsor-border relative rounded-xl h-[180px] flex-col items-center justify-center py-6 group cursor-pointer `}
              >
                <div className="absolute inset-0 z-0 group-hover:bg-gradient-to-l group-hover:from-[#9667FA] group-hover:to-[#4075FF]" />
                <div className="absolute top-2 right-2 z-10 group-hover:text-white text-secondary-text">
                  <ArrowUpRight />
                </div>
                <div className="relative z-10 flex flex-col gap-3 items-center justify-center h-full">
                  <div className="h-6 px-2 rounded-2xl bg-gradient-to-tr from-[#4075FF] to-[#9667FA] text-xs font-roboto flex items-center justify-center  group-hover:bg-transparent group-hover:border group-hover:border-white group-hover:text-white">
                    Community Partner
                  </div>
                  <div
                    className={cn(
                      "h-[55px] flex items-center justify-center w-[86px]"
                    )}
                  >
                    <img
                      src={sponsor.logo_url}
                      alt="Community Partner"
                      className="object-contain w-full h-full"
                    />
                  </div>
                </div>
              </Link>
            ))}
        {isOwner && communityPartners && (
          <EditCommunityPartners
            onSave={handleSavePartners}
            initialPartners={communityPartners}
            hackathonId={parseInt(hackathonId ?? "1")}
          />
        )}
      </div>
    </>
  );
};
