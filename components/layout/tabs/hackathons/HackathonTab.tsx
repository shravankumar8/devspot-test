"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useState } from "react";

import { HackathonLeaderboard } from "@/components/page-components/hackathons/leaderboard";
import { HackathonProjects } from "@/components/page-components/hackathons/projects";
import { HackathonResources } from "@/components/page-components/hackathons/resources";
import { useRouter, useSearchParams } from "next/navigation";
import { HackathonFAQs } from "../../../page-components/hackathons/faqs";
import { HackathonOverview } from "../../../page-components/hackathons/overview";
import { HackathonParticipants } from "../../../page-components/hackathons/participants";
import { HackathonPrizes } from "../../../page-components/hackathons/prizes";
import { HackathonSchedule } from "../../../page-components/hackathons/schedule";
import { HackathonSponsors } from "../../../page-components/hackathons/sponsors";
import { HackathonVIPs } from "../../../page-components/hackathons/vips";

export const tabs = [
  { value: "overview", label: "Overview" },
  { value: "schedule", label: "Schedule" },
  { value: "participants", label: "Participants" },
  { value: "prizes", label: "Prizes" },
  { value: "vips", label: "Judges/Mentors" },
  { value: "sponsors", label: "Partners" },
  { value: "faqs", label: "FAQs" },
  { value: "resources", label: "Resources" },
  { value: "projects", label: "Projects" },
  { value: "leaderboard", label: "Leaderboard" },
];

const HackathonTab = ({
  hackathonId,
  isOwner,
}: {
  hackathonId: string;
  isOwner: boolean;
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultTab = searchParams.get("activeTab") ?? "overview";
  const [selectedTab, setSelectedTab] = useState(defaultTab);

  const handleTabChange = (tab: string) => {
    setSelectedTab(tab);

    // Create new URLSearchParams
    const params = new URLSearchParams(window.location.search);
    params.set("activeTab", tab);

    // Use Next.js router to update URL
    router.replace(`${window.location.pathname}?${params.toString()}`, {
      scroll: true, // This should force scroll to top
    });
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    params.set("activeTab", selectedTab);
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.scrollTo(0, 0);
    window.history.replaceState(null, "", newUrl);
  }, [selectedTab]);

  function renderTabContent(tab: { label: string; value: string }) {
    switch (selectedTab) {
      case "overview":
        return (
          <HackathonOverview
            hackathonId={hackathonId}
            setSelectedTab={setSelectedTab}
            isOwner={isOwner}
          />
        );
      case "schedule":
        return (
          <HackathonSchedule hackathonId={hackathonId} isOwner={isOwner} />
        );
      case "participants":
        return <HackathonParticipants hackathonId={hackathonId} />;
      case "sponsors":
        return (
          <HackathonSponsors isOwner={isOwner} hackathonId={hackathonId} />
        );
      case "faqs":
        return <HackathonFAQs isOwner={isOwner} hackathonId={hackathonId} />;
      case "prizes":
        return (
          <HackathonPrizes
            setSelectedTab={setSelectedTab}
            hackathonId={hackathonId}
          />
        );
      case "vips":
        return <HackathonVIPs hackathonId={hackathonId} />;
      case "projects":
        return <HackathonProjects hackathonId={hackathonId} />;
      case "resources":
        return (
          <HackathonResources hackathonId={hackathonId} isOwner={isOwner} />
        );
      case "leaderboard":
        return <HackathonLeaderboard hackathonId={hackathonId} />;
      default:
        return <div>{tab.label} Section</div>;
    }
  }

  return (
    <Tabs value={selectedTab} onValueChange={handleTabChange} className="">
      {/* Mobile Dropdown */}
      {/* <div className={`${styles.dropdownContainer} px-4`}>
        <div className="pt-4 pb-2">
          <MobileDropdown
            selectedTab={selectedTab}
            handleDropdownChange={handleDropdownChange}
            options={tabs}
          />
        </div>
      </div> */}

      {/* Desktop TabsList */}
      <div className="-mt-10">
        <TabsList
          className={`flex flex-nowrap whitespace-nowrap overflow-x-auto scrollbar-hide justify-start pt-5 items-center space-x-5 lg:space-x-12 !w-full px-5  rounded-t-[12px] dark:bg-[#13131A99] z-10 relative !overflow-y-hidden`}
        >
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className={`!p-0 !pb-4 !bg-transparent capitalize relative text-sm font-semibold text-[#B8B8BA] transition-all duration-200 ease-in-out hover:text-white after:absolute after:w-0 after:transition-all after:duration-200 after:ease-in-out after:h-0.5 after:left-0 after:rounded-[1px] data-[state=active]:after:w-full after:bottom-2 data-[state=active]:after:bg-[#4E52F5] data-[state=active]:text-white `}
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>

      {/* Tabs Content */}
      {tabs.map((tab) => (
        <TabsContent key={tab.value} value={tab.value}>
          <div className={` !bg-primary-bg py-5 !mt-0`}>
            {renderTabContent(tab)}
          </div>
        </TabsContent>
      ))}
    </Tabs>
  );
};

export default HackathonTab;
