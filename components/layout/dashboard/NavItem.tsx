"use client";

import useSideRoute from "@/hooks/useSideRoute";
import { useSidebarStore } from "@/state/sidebar";
import { cn } from "@/utils/tailwind-merge";
import Link from "next/link";

export const NavItem = ({
  icon,
  label,
  href,
  activeRoutes,
}: {
  icon: React.ReactNode;
  label: string;
  href: string;
  activeRoutes: string[];
}) => {
  const { isRouteActive } = useSideRoute();
  const isActive = isRouteActive(activeRoutes);
  const { isOpen, closeSidebar } = useSidebarStore();

  return (
    <Link
      href={href}
      className={cn(
        "transition-all duration-200 pl-5 ease-in-out py-2  flex items-center gap-2",
        isActive ? "" : "hover:border-l-4",
        isOpen ? "flex" : "hidden md:flex"
      )}
      onClick={closeSidebar}
    >
      <div
        className={`h-[28px] left-2 absolute bg-main-primary rounded-tr-lg rounded-br-lg transition-all duration-200 ease-in-out ${
          isActive ? "w-[2px]" : "w-0"
        }`}
      ></div>

      <div className="size-5">{icon}</div>

      <span
        className={`lg:block md:hidden block font-semibold text-secondary-text text-sm ${cn(
          isActive && "!text-white"
        )}`}
      >
        {label}
      </span>
    </Link>
  );
};
