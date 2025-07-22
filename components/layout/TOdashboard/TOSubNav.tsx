import { ActiveChatWithSpot, AnalyticsIcon } from "@/components/icons/technoogyowner";
import useSideRoute from "@/hooks/useSideRoute";
import { useSidebarStore } from "@/state/sidebar";
import { cn } from "@/utils/tailwind-merge";
import Link from "next/link";
import { NavItemData, SubNavItemData } from "./TOSideNav";
import { useRouter } from "next/navigation";
import SlidingNavigation from "./sliding-navigation-animation";

export const SubNav = ({
  mainNav,
  subNav,
}: {
  mainNav: NavItemData[];
  subNav: SubNavItemData[];
}) => {
  const { isRouteActive } = useSideRoute();

  const { isOpen, closeSidebar } = useSidebarStore();
  const router = useRouter()
  return (
    <div className="h-screen flex">
      <div
        className={cn(
          `h-full p-4 border-r border-r-[#2B2B31] w-fit`,
          isOpen ? "block" : "hidden md:block"
        )}
      >
        {mainNav?.map((nav) => {
          const isActive = isRouteActive(nav.activeRoutes);
          return (
            <Link
              key={nav.label}
              href={nav.href}
              className={cn(
                "transition-all duration-200 ease-in-out flex items-center py-2 gap-2 w-fit",
                nav.activeRoutes ? "" : "hover:border-l-4"
              )}
              onClick={closeSidebar}
            >
              <div
                className={`h-[28px] left-2 absolute bg-main-primary rounded-tr-lg rounded-br-lg transition-all duration-200 ease-in-out ${
                  isActive ? "w-[2px]" : "w-0"
                }`}
              ></div>

              <div className="size-5 ">{nav.icon}</div>
            </Link>
          );
        })}
      </div>
      <div className="py-4 w-full">
        <div
          className={cn(
            "transition-all duration-200 ease-in-out flex items-center py-2 gap-2 pl-5 relative w-fit",

            isOpen ? "flex" : "hidden md:flex"
          )}
        >
          <div
            className={`h-[28px] left-3 absolute bg-main-primary rounded-tr-lg rounded-br-lg transition-all duration-200 ease-in-out w-[2px]`}
          ></div>

          <div className="size-5 ">
            <AnalyticsIcon />
          </div>
          <span
            className={`lg:block md:hidden block font-semibold text-sm text-white 
            )}`}
          >
            Analytics
          </span>
        </div>
        <div
          className={cn(
            `flex flex-col w-full`,
            isOpen ? "flex" : "hidden md:flex"
          )}
        >
          {/* {subNav.map((nav) => {
            const isActive = isRouteActive(nav.activeRoutes);
            return (
              <div
                key={nav.label}
                // href={nav.href}
                onClick={() => router.push(nav.href)}
                className={cn(
                  "py-1.5 text-sm cursor-pointer pl-5 flex gap-2 items-center font-semibold hover:bg-primary-bg/35 transition-all duration-200 ease-in-out",
                  isActive
                    ? "bg-primary-bg text-white w-[120%]"
                    : "bg-transparent text-secondary-text",
                  nav.icon ? "border-t border-t-[#2B2B31] py-2" : "mb-2"
                )}
              >
                {nav.icon && <div className="size-5 ">{nav.icon}</div>}
                {nav.label}
              </div>
            );
          })} */}
          <SlidingNavigation subNav={subNav} />
        </div>
      </div>
    </div>
  );
};
