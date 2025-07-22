"use client";
import { ActiveProject } from "@/components/icons/Laptop";
import { ActiveBounty } from "@/components/icons/Location";
import {
  ActiveChatWithSpot,
  ActiveHackathon,
  ActiveOverview,
  ChatWithSpotIcon,
  OverviewIcon,
  TOCommunityIcon,
  TOEditIcon,
  TOHackathonIcon,
  TOMessagingIcon,
  TOProfileIcon,
} from "@/components/icons/technoogyowner";
import { NavItem } from "@/components/layout/dashboard/NavItem";
import { useNavHighlight } from "@/hooks/useNavHighligt";
import { useAuthStore } from "@/state";
import { useSidebarStore } from "@/state/sidebar";
import { useTechOwnerStore } from "@/state/techOwnerStore";
import { TechnologyOrganization } from "@/types/profile";
import { cn } from "@/utils/tailwind-merge";
import { getInitials } from "@/utils/url-validator";
import { ChevronDown, Plus } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { SubNav } from "./TOSubNav";

export type NavItemData = {
  href: string;
  icon: JSX.Element;
  label: string;
  activeRoutes: string[];
};

export type SubNavItemData = {
  href: string;
  icon?: JSX.Element;
  label: string;
  activeRoutes: string[];
};

interface TOSideNavProps {
  hideDesktopSidebar: boolean;
  technologyOrganizations: TechnologyOrganization[];
}

export function TOSideNav({
  hideDesktopSidebar,
  technologyOrganizations,
}: TOSideNavProps) {
  const pathname = usePathname();
  const { isOpen } = useSidebarStore();
  const { user } = useAuthStore();
  const [showOrgSwitcher, setShowOrgSwitcher] = useState(false);

  const { normalizedPath, isSubdomain } = useNavHighlight();

  const getStrippedPathname = (pathname: string) => {
    const segments = pathname.split("/").filter(Boolean);
    if (segments.length > 1) {
      return `/${segments.slice(1).join("/")}`;
    }
    return "/";
  };

  // const isAnalyticsRoute = pathname.startsWith("/TO/hackathons/");
  const { selectedOrg, setSelectedOrg } = useTechOwnerStore();

  useEffect(() => {
    if (technologyOrganizations.length > 0 && !selectedOrg) {
      setSelectedOrg(technologyOrganizations[0]);
    }
  }, [technologyOrganizations, selectedOrg, setSelectedOrg]);

  const isActive = (activeRoutes: string[]) => {
    const strippedPath = getStrippedPathname(pathname);

    return activeRoutes.some(
      (route) => strippedPath === route || strippedPath.startsWith(route + "/")
    );
  };

  const TOnavItems: NavItemData[] = [
    {
      href: `${process.env.NEXT_PUBLIC_PROTOCOL}${process.env.NEXT_PUBLIC_BASE_SITE_URL}/TO/chat-with-spot`,
      icon:
        !isSubdomain && normalizedPath === "/TO/chat-with-spot" ? (
          <ActiveChatWithSpot />
        ) : (
          <ChatWithSpotIcon className="transition-all duration-200 ease-in-out" />
        ),
      label: "Chat with Spot",
      activeRoutes: !isSubdomain ? ["/TO/chat-with-spot"] : [],
    },
    {
      href: `/TO/overview`,
      icon:
        isSubdomain || normalizedPath.startsWith("/TO/overview") ? (
          <ActiveOverview />
        ) : (
          <OverviewIcon className="transition-all duration-200 ease-in-out" />
        ),
      label: "Overview",
      activeRoutes: ["/TO/overview"],
    },
    {
      href: `${process.env.NEXT_PUBLIC_PROTOCOL}${process.env.NEXT_PUBLIC_BASE_SITE_URL}/TO/hackathons`,
      icon: isActive(["/TO/hackathons", "/TO/analytics"]) ? (
        <ActiveHackathon />
      ) : (
        <TOHackathonIcon className="transition-all duration-200 ease-in-out" />
      ),
      label: "Hackathons",
      activeRoutes: ["/TO/hackathons", "/TO/analytics"],
    },
    {
      href: `${process.env.NEXT_PUBLIC_PROTOCOL}${process.env.NEXT_PUBLIC_BASE_SITE_URL}/TO/technology-profile`,
      icon: isActive(["/TO/technology-profile"]) ? (
        <ActiveBounty />
      ) : (
        <TOProfileIcon className="transition-all duration-200 ease-in-out" />
      ),
      label: "Technology Profile",
      activeRoutes: ["/TO/technology-profile"],
    },
    {
      href: `${process.env.NEXT_PUBLIC_PROTOCOL}${process.env.NEXT_PUBLIC_BASE_SITE_URL}/TO/community`,
      icon: isActive(["/TO/community"]) ? (
        <ActiveProject />
      ) : (
        <TOCommunityIcon className="transition-all duration-200 ease-in-out" />
      ),
      label: "Community",
      activeRoutes: ["/TO/community"],
    },
  ];

  const analyticsNavItems: SubNavItemData[] = [
    {
      href: `/TO/hackathons/[id]/analytics/participants`,
      label: "Participants",
      activeRoutes: ["/TO/analytics/participants"],
    },
    {
      href: `/TO/analytics/projects`,
      label: "Projects",
      activeRoutes: ["/TO/analytics/projects"],
    },
    {
      href: `/TO/analytics/judging`,
      label: "Judging",
      activeRoutes: ["/TO/analytics/judging"],
    },
    {
      href: `/TO/analytics/prizes`,
      label: "Prizes",
      activeRoutes: ["/TO/analytics/prizes"],
    },
    {
      href: `/TO/analytics/feedback`,
      label: "Feedback",
      activeRoutes: ["/TO/analytics/feedback"],
    },
    {
      href: `/TO/analytics/hackathons/1`,
      icon: <TOEditIcon />,
      label: "Edit details",
      activeRoutes: ["/TO/analytics/hackathons/1"],
    },
    {
      href: `/TO/analytics/messaging`,
      icon: <TOMessagingIcon />,
      label: "Messaging",
      activeRoutes: ["/TO/analytics/messaging"],
    },
  ];

  const handleOrgSelect = (org: TechnologyOrganization) => {
    setSelectedOrg(org);
    setShowOrgSwitcher(false);
  };

  const segments = pathname.split("/").filter(Boolean);
  const [, section, entity, maybeId, subroute] = segments;
  const isAnalyticsRoute =
    section === "TO" &&
    entity === "hackathons" &&
    !!maybeId &&
    subroute === "analytics";

  const hackathonId = maybeId ?? "";

  return (
    <aside
      className={`dark:bg-secondary-bg border-r border-r-[#2B2B31] md:w-20 lg:w-[220px] fixed top-16 bottom-0 z-50 transition-all duration-200 ease-in-out ${cn(
        isOpen ? "w-64" : "w-0",
        hideDesktopSidebar ? "lg:hidden" : "block",
        isAnalyticsRoute ? "" : "py-3"
      )}`}
    >
      <nav>
        <ul className="flex flex-col gap-5 h-full">
          {/* Organization Switcher */}
          {selectedOrg && (
            <li
              className={`px-3  font-roboto ${
                isAnalyticsRoute ? "pt-3" : "pt-1"
              }`}
            >
              <div className="relative">
                <button
                  onClick={() => setShowOrgSwitcher(!showOrgSwitcher)}
                  className={`flex items-center justify-between w-full rounded  ${
                    showOrgSwitcher ? "text-white" : "text-secondary-text"
                  }`}
                >
                  <div className="flex gap-2 items-center">
                    {selectedOrg?.technology_owners.logo ? (
                      <img
                        src={selectedOrg?.technology_owners.logo}
                        alt="judge"
                        className="w-6 h-6 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-gray-300 border-2 border-gray-200 flex items-center justify-center text-xs font-normal text-gray-700">
                        {getInitials(selectedOrg.technology_owners.name)}
                      </div>
                    )}
                    <span className={`font-medium truncate `}>
                      {selectedOrg.technology_owners.name}
                    </span>
                  </div>

                  <ChevronDown className="h-4 w-4 ml-2" />
                </button>

                {showOrgSwitcher && (
                  <div className="absolute left-0 z-10 w-full mt-1 border rounded-xl shadow-lg bg-secondary-bg border-tertiary-bg">
                    <ul className="py-1">
                      {technologyOrganizations.map((org) => (
                        <li key={org.id}>
                          <button
                            onClick={() => handleOrgSelect(org)}
                            className={`flex items-center justify-between w-full px-4 py-2 text-sm text-left ${
                              selectedOrg.id === org.id
                                ? " text-white"
                                : "text-secondary-text"
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              {org?.technology_owners.logo ? (
                                <img
                                  src={org?.technology_owners.logo}
                                  alt="judge"
                                  className="w-6 h-6 rounded-full object-cover"
                                />
                              ) : (
                                <div className="w-6 h-6 rounded-full bg-gray-300 border-2 border-gray-200 flex items-center justify-center text-xs font-normal text-gray-700">
                                  {getInitials(org.technology_owners.name)}
                                </div>
                              )}
                              {org.technology_owners.name}
                            </div>

                            <span className="flex items-center">
                              {selectedOrg.id === org.id && (
                                <svg
                                  className="w-4 h-4 mr-2 text-white"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M5 13l4 4L19 7"
                                  />
                                </svg>
                              )}
                            </span>
                          </button>
                        </li>
                      ))}
                      <li>
                        <button
                          onClick={() => {
                            // Handle create new organization
                            // This could navigate to a creation page or open a modal
                          }}
                          className="flex items-center w-full px-4 py-2 text-left text-secondary-text whitespace-nowrap text-xs"
                        >
                          <Plus className="flex-shrink-0 w-4 h-4" />
                          Add new technology profile
                        </button>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </li>
          )}

          {/* Rest of the navigation items */}
          {isAnalyticsRoute ? (
            <SubNav
              mainNav={TOnavItems}
              subNav={[
                {
                  href: `/TO/hackathons/${hackathonId}/analytics/participants`,
                  label: "Participants",
                  activeRoutes: [
                    `/TO/hackathons/${hackathonId}/analytics/participants`,
                  ],
                },
                {
                  href: `/TO/hackathons/${hackathonId}/analytics/projects`,
                  label: "Projects",
                  activeRoutes: [
                    `/TO/hackathons/${hackathonId}/analytics/projects`,
                  ],
                },
                {
                  href: `/TO/hackathons/${hackathonId}/analytics/judging`,
                  label: "Judging",
                  activeRoutes: [
                    `/TO/hackathons/${hackathonId}/analytics/judging`,
                  ],
                },
                {
                  href: `/TO/hackathons/${hackathonId}/analytics/prizes`,
                  label: "Prizes",
                  activeRoutes: [
                    `/TO/hackathons/${hackathonId}/analytics/prizes`,
                  ],
                },
                {
                  href: `/TO/hackathons/${hackathonId}/analytics/feedback`,
                  label: "Feedback",
                  activeRoutes: [
                    `/TO/hackathons/${hackathonId}/analytics/feedback`,
                  ],
                },
                {
                  href: `/TO/hackathons/${hackathonId}/analytics/hackathons`,
                  icon: <TOEditIcon />,
                  label: "Edit details",
                  activeRoutes: [
                    `/TO/hackathons/${hackathonId}/analytics/hackathons`,
                  ],
                },
                {
                  href: `/TO/hackathons/${hackathonId}/analytics/messaging`,
                  icon: <TOMessagingIcon />,
                  label: "Messaging",
                  activeRoutes: [
                    `/TO/hackathons/${hackathonId}/analytics/messaging`,
                  ],
                },
              ]}
            />
          ) : (
            TOnavItems.map(({ href, icon, label, activeRoutes }) => (
              <NavItem
                key={href}
                href={href}
                icon={icon}
                label={label}
                activeRoutes={activeRoutes}
              />
            ))
          )}
        </ul>
      </nav>
    </aside>
  );
}
