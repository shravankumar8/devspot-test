"use client";
import Account, { ActiveAccount } from "@/components/icons/Account";
import BriefCase, { ActiveBriefcase } from "@/components/icons/BriefCase";
import Discover, { ActiveDiscover } from "@/components/icons/Discover";
import Laptop, { ActiveProject } from "@/components/icons/Laptop";
import { ActiveBounty, Bounty } from "@/components/icons/Location";
import Star, { ActiveStar } from "@/components/icons/Star";
import { NavItem } from "@/components/layout/dashboard/NavItem";
import { useNavHighlight } from "@/hooks/useNavHighligt";
import { useAuthStore } from "@/state";
import { useSidebarStore } from "@/state/sidebar";
import { cn } from "@/utils/tailwind-merge";
import { usePathname } from "next/navigation";

type NavItemData = {
  href: string;
  icon: JSX.Element;
  label: string;
  activeRoutes: string[];
};
export function SideNav({
  hideDesktopSidebar,
}: {
  hideDesktopSidebar: boolean;
}) {
  const pathname = usePathname();
  const { isOpen } = useSidebarStore();
  const { user } = useAuthStore();

  const { normalizedPath, isSubdomain } = useNavHighlight();

  const getStrippedPathname = (pathname: string) => {
    const segments = pathname.split("/").filter(Boolean);
    if (segments.length > 1) {
      return `/${segments.slice(1).join("/")}`;
    }
    return "/";
  };

  const isActive = (activeRoutes: string[]) => {
    const strippedPath = getStrippedPathname(pathname);

    return activeRoutes.some(
      (route) => strippedPath === route || strippedPath.startsWith(route + "/")
    );
  };

  const navItems: NavItemData[] = [
    {
      href: `${process.env.NEXT_PUBLIC_PROTOCOL}${process.env.NEXT_PUBLIC_BASE_SITE_URL}/`,
      icon:
        !isSubdomain && normalizedPath === "/" ? (
          <ActiveDiscover />
        ) : (
          <Discover className="transition-all duration-200 ease-in-out" />
        ),
      label: "Discover",
      activeRoutes: !isSubdomain ? ["/"] : [],
    },
    {
      href: `${process.env.NEXT_PUBLIC_PROTOCOL}${process.env.NEXT_PUBLIC_BASE_SITE_URL}/hackathons`,
      icon:
        isSubdomain || normalizedPath.startsWith("/hackathons") ? (
          <ActiveStar />
        ) : (
          <Star className="transition-all duration-200 ease-in-out" />
        ),
      label: "Hackathons",
      activeRoutes: isSubdomain
        ? ["/", "/overview", "/details"]
        : ["/hackathons"],
    },
    {
      href: `${process.env.NEXT_PUBLIC_PROTOCOL}${process.env.NEXT_PUBLIC_BASE_SITE_URL}/people`,
      icon: isActive(["/people"]) ? (
        <ActiveAccount />
      ) : (
        <Account className="transition-all duration-200 ease-in-out" />
      ),
      label: "People",
      activeRoutes: ["/people"],
    },
    {
      href: `${process.env.NEXT_PUBLIC_PROTOCOL}${process.env.NEXT_PUBLIC_BASE_SITE_URL}/bounty`,
      icon: isActive(["/bounty"]) ? (
        <ActiveBounty />
      ) : (
        <Bounty className="transition-all duration-200 ease-in-out" />
      ),
      label: "Bounties",
      activeRoutes: ["/bounty"],
    },
    {
      href: `${process.env.NEXT_PUBLIC_PROTOCOL}${process.env.NEXT_PUBLIC_BASE_SITE_URL}/projects`,
      icon: isActive(["/projects"]) ? (
        <ActiveProject />
      ) : (
        <Laptop className="transition-all duration-200 ease-in-out" />
      ),
      label: "Projects",
      activeRoutes: ["/projects"],
    },
    {
      href: `${process.env.NEXT_PUBLIC_PROTOCOL}${process.env.NEXT_PUBLIC_BASE_SITE_URL}/technology-owners`,
      icon: isActive(["/technology-owners"]) ? (
        <ActiveBriefcase />
      ) : (
        <BriefCase className="transition-all duration-200 ease-in-out" />
      ),
      label: "Technology Owners",
      activeRoutes: ["/technology-owners"],
    },
  ];

  // const supportItems: SupportItem[] = [
  //   { label: "Give us feedback", value: "feedback", icon: <FeedbackIcon /> },
  //   { label: "Request feature", value: "request", icon: <RequestIcon /> },
  //   {
  //     label: "Report issue",
  //     value: "report",
  //     icon: <InfoIcon width="20px" height="20px" />,
  //   },
  // ];

  return (
    <aside
      className={`py-3 dark:bg-secondary-bg border-r border-r-[#2B2B31] md:w-20 lg:w-[220px] fixed top-16 bottom-0 z-50 transition-all duration-200 ease-in-out ${cn(
        isOpen ? "w-64" : "w-0",
        hideDesktopSidebar ? "md:hidden" : "block"
      )}`}
    >
      <nav>
        <ul className="flex flex-col gap-5">
          {navItems.map(({ href, icon, label, activeRoutes }) => (
            <NavItem
              key={href}
              href={href}
              icon={icon}
              label={label}
              activeRoutes={activeRoutes}
            />
          ))}
        </ul>
      </nav>
      {/* <section className="absolute bottom-0 px-3 pb-6">
        <SupportModal supportItems={supportItems} />
      </section> */}
    </aside>
  );
}
