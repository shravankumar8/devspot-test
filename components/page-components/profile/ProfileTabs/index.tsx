import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuthStore } from "@/state";
import { Judgings } from "@/types/entities";
import { UserProfile } from "@/types/profile";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import useSWR from "swr";
import ProfileBounties from "./Bounties";
import ProfileDiscussions from "./Discussions";
import ProfileHackathons from "./Hackathons";
import ProfileJudging from "./Judging";
import ProfileProjects from "./Projects";
import { Wallet } from "./Wallet";

const baseTabs = [
  { value: "projects", label: "Projects" },
  { value: "hackathons", label: "Hackathons" },
  { value: "discussions", label: "Discussions" },
  { value: "bounties", label: "Bounties" },
] as const;

type ProfileTabTypes =
  | (typeof baseTabs)[number]["value"]
  | "wallets"
  | "judging";

interface ProfileTabsProps {
  isOwner: boolean;
  userProfile: UserProfile;
}

const ProfileTabs = (props: ProfileTabsProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const URL_QUERY_NAME = "profileTabSelected";

  const [activeProfileTab, setActiveProfileTab] =
    useState<ProfileTabTypes>("projects");

  const { user } = useAuthStore();
  const fetchJudgings = async (url: string) => {
    const resp = await axios.get(url);
    return resp.data as Judgings[];
  };

  const { data: judgings = [], isLoading } = useSWR<Judgings[]>(
    `/api/people/${user?.id}/judgings`,
    fetchJudgings
  );

  const tabs = [
    ...baseTabs,
    ...(props.isOwner ? [{ value: "wallets", label: "Wallet" }] : []),
    ...(props.isOwner && judgings.length > 0
      ? [{ value: "judging", label: "Judging" }]
      : []),
  ] as const;

  const isValidTab = (tab: any): tab is ProfileTabTypes => {
    const tabExists = [...tabs].find((item) => item.value === tab);

    return Boolean(tabExists);
  };

  const handleSelectTab = (tab: string) => {
    if (!isValidTab(tab)) return;

    setActiveProfileTab(tab);

    const params = new URLSearchParams(searchParams.toString());

    params.set(URL_QUERY_NAME, tab);

    router.push(`?${params.toString()}`, { scroll: false });
  };

  const renderTabContent = (tab: (typeof tabs)[number]) => {
    switch (activeProfileTab) {
      case "projects":
        return (
          <ProfileProjects
            userProfile={props.userProfile}
            isOwner={props.isOwner}
          />
        );
      case "hackathons":
        return (
          <ProfileHackathons
            userProfile={props.userProfile}
            isOwner={props.isOwner}
          />
        );
      case "discussions":
        return <ProfileDiscussions />;
      case "bounties":
        return <ProfileBounties />;
      case "wallets":
        return <Wallet />;
      case "judging":
        return <ProfileJudging />;

      default:
        return <div>{tab.label} Section</div>;
    }
  };

  useEffect(() => {
    const queryTab = searchParams.get(URL_QUERY_NAME);

    if (isValidTab(queryTab)) {
      setActiveProfileTab(queryTab);
    }
  }, [searchParams, isValidTab]);

  return (
    <Tabs value={activeProfileTab} onValueChange={handleSelectTab}>
      {/* Desktop TabsList */}
      <TabsList className="flex flex-nowrap whitespace-nowrap overflow-x-auto scrollbar-hide dark:bg-secondary-bg gap-6 px-4 pt-3 max-w-full w-fit h-[40px] !overflow-y-hidden rounded-none rounded-tr-xl rounded-tl-xl">
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

      {/* Tabs Content */}
      {tabs.map((tab) => (
        <TabsContent
          key={tab.value}
          value={tab.value}
          className="bg-secondary-bg !mt-0 !px-4 !py-6 rounded-xl rounded-tl-none rounded-tr-none sm:rounded-tr-xl min-h-[500px] lg:min-h-fit"
        >
          {renderTabContent(tab)}
        </TabsContent>
      ))}
    </Tabs>
  );
};

export default ProfileTabs;
