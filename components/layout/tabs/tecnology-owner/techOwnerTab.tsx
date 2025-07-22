import { BuiltWithTab } from "@/components/page-components/dashboard/technology-owners/builtWith";
import { TechOwnerOverview } from "@/components/page-components/dashboard/technology-owners/overview";
import { OwnersHackathons } from "@/components/page-components/dashboard/technology-owners/ownersHackathon";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const tabs = [
  { value: "overview", label: "Overview" },
  { value: "hackathons", label: "Hackathons" },
  { value: "built_with", label: "Built with" },
];
export const TechOwnerTab = () => {
  const searchParams = useSearchParams();

  const defaultTab = searchParams.get("activeTab") ?? "overview";
  const [selectedTab, setSelectedTab] = useState(defaultTab);

  function renderTabContent(tab: { label: string; value: string }) {
    switch (selectedTab) {
      case "overview":
        return <TechOwnerOverview />;
      case "hackathons":
        return <OwnersHackathons />;
      case "built_with":
        return <BuiltWithTab />;

      default:
        return <div>{tab.label} Section</div>;
    }
  }

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    params.set("activeTab", selectedTab);
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState(null, "", newUrl);
  }, [selectedTab]);

  const handleDropdownChange = (e: { target: { value: string } }) => {
    setSelectedTab(e.target.value);
  };

  return (
    <Tabs value={selectedTab} onValueChange={setSelectedTab} className="">
      {/* Mobile Dropdown */}
      {/* <div className={`${styles.dropdownContainer} px-4`}>
        <div className="mb-1 py-6">
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
          <div className={` !bg-primary-bg py-3`}>{renderTabContent(tab)}</div>
        </TabsContent>
      ))}
    </Tabs>
  );
};
