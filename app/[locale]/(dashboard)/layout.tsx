"use client";

import DevspotLoader from "@/components/common/DevspotLoader";
import { AppHeader } from "@/components/layout/dashboard/AppHeader";
import { DashboardFooter } from "@/components/layout/dashboard/DashboardFooter";
import { SideNav } from "@/components/layout/dashboard/SideNav";
import SpotCreationWidget from "@/components/page-components/projects/SpotCreationWidget";
import { useAuthStore } from "@/state";
import { cn } from "@/utils/tailwind-merge";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import "../../globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const router = useRouter();

  const [hostname, setHostname] = useState("");

  const { fetchSession, isLoading } = useAuthStore();

  const isCallbackPage = useMemo(() => {
    const pathArr = pathname.split("/");

    return pathArr.includes("callback") && pathArr.includes("client");
  }, [pathname]);

  useEffect(() => {
    fetchSession();

    if (typeof window !== "undefined") {
      setHostname(window.location.hostname);
    }
  }, []);

  const getStrippedPathname = (pathname: string) => {
    const segments = pathname.split("/").filter(Boolean);
    if (segments.length > 1) {
      return `/${segments.slice(1).join("/")}`;
    }
    return "/";
  };

  const noDesktopSidebarRoutes = [
    "/application",
    "/manifesto",
    "/pricing-model",
    "/privacy-policy",
    "/press-and-media",
    "/contact",
    "/terms-and-condition",
    "/terms-of-service",
    "/code-of-conduct",
    "/project-submission-guide"
  ];

  const hideDesktopSidebar = useMemo(() => {
    const strippedPath = getStrippedPathname(pathname);

    // Match static paths
    const matchesStaticPath = noDesktopSidebarRoutes.some((route) =>
      strippedPath.startsWith(route)
    );

    // Match /judging/:hackathonId/:projectId
    const matchesJudgingProjectPath = /^\/judging\/[^/]+\/[^/]+\/[^/]+$/.test(
      strippedPath
    );

    return matchesStaticPath || matchesJudgingProjectPath;
  }, [pathname]);

  if (isCallbackPage) return <>{children}</>;

  if (isLoading)
    return (
      <div className="flex justify-center items-center w-full h-screen">
        <DevspotLoader />
      </div>
    );

  return (
    <div className="relative">
      <AppHeader />
      <div className="mt-16">
        <SideNav hideDesktopSidebar={hideDesktopSidebar} />

        <main
          className={`h-screen overflow-y-scroll transition-all duration-200 ease-in-out bg-primary-bg relative`}
        >
          <div
            className={`min-h-screen  ${cn(
              hideDesktopSidebar
                ? ""
                : "pt-5 sm:p-5 p-4 md:ml-[100px] md:pl-0 lg:ml-[240px]"
            )} `}
          >
            {children}
          </div>
          <div
            className={`${cn(
              hideDesktopSidebar ? "" : "md:ml-[80px] md:pl-0 lg:ml-[220px]"
            )}`}
          >
            <DashboardFooter />
          </div>
          <div className="fixed right-2 bottom-2 z-50">
            <SpotCreationWidget />
          </div>
        </main>
      </div>
    </div>
  );
}
