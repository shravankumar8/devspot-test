"use client";

import DevspotLoader from "@/components/common/DevspotLoader";
import { AppHeader } from "@/components/layout/dashboard/AppHeader";
import { usePathname } from "next/navigation";
import { useMemo } from "react";
import "../../globals.css";

export default function Loading() {
  const pathname = usePathname();

  const getStrippedPathname = (pathname: string) => {
    const segments = pathname.split("/").filter(Boolean);
    if (segments.length > 1) {
      return `/${segments.slice(1).join("/")}`;
    }
    return "/";
  };

  const noDesktopSidebarRoutes = [
    "/application",
    "/about",
    "/privacy-policy",
    "/press-and-media",
    "/contact",
    "/terms-and-condition",
    "/terms-of-service",
    "/code-of-conduct",
  ];

  const hideDesktopSidebar = useMemo(() => {
    const strippedPath = getStrippedPathname(pathname);

    // Match static paths
    const matchesStaticPath = noDesktopSidebarRoutes.some((route) =>
      strippedPath.startsWith(route)
    );

    // Match /judging/:hackathonId/:projectId
    const matchesJudgingProjectPath = /^\/judging\/[^/]+\/[^/]+$/.test(
      strippedPath
    );

    return matchesStaticPath || matchesJudgingProjectPath;
  }, [pathname]);

  return (
    <div className="relative">
      <AppHeader />
      <div className="mt-16">
        <div className="flex justify-center items-center h-[calc(100vh-192px)] w-full">
          <DevspotLoader />
        </div>
      </div>
    </div>
  );
}
