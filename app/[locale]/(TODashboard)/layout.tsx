"use client";

import DevspotLoader from "@/components/common/DevspotLoader";
import { AppHeader } from "@/components/layout/dashboard/AppHeader";
import { DashboardFooter } from "@/components/layout/dashboard/DashboardFooter";
import { TOSideNav } from "@/components/layout/TOdashboard/TOSideNav";
import { useAuthStore } from "@/state";
import { UserProfile } from "@/types/profile";
import { cn } from "@/utils/tailwind-merge";
import axios from "axios";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import useSWR from "swr";
import "../../globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const router = useRouter();
  const [hostname, setHostname] = useState("");
  const [redirected, setRedirected] = useState(false);

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

  const { data: userProfile, isLoading: isFetchingUserProfile } =
    useSWR<UserProfile>("/api/profile", fetchUserProfile, {});

  async function fetchUserProfile(url: string) {
    try {
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }

  // Check if user is a technology owner
  useEffect(() => {
    if (userProfile && !redirected) {
      const isTechnologyOwner =
        userProfile.technology_organizations?.length > 0;
      if (!isTechnologyOwner) {
        setRedirected(true);
        router.push("/");
      }
    }
  }, [userProfile, redirected, router]);

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

  if (isCallbackPage) return <>{children}</>;

  if (
    isLoading ||
    isFetchingUserProfile ||
    (userProfile &&
      !userProfile.technology_organizations?.length &&
      !redirected)
  )
    return (
      <div className="flex justify-center items-center w-full h-screen">
        <DevspotLoader />
      </div>
    );

  return (
    <div className="relative">
      <AppHeader />
      <div className="mt-16">
        <TOSideNav hideDesktopSidebar={hideDesktopSidebar} technologyOrganizations={userProfile?.technology_organizations ?? []}/>

        <main
          className={`h-screen overflow-y-scroll transition-all duration-200 ease-in-out bg-primary-bg`}
        >
          <div
            className={`min-h-screen  ${cn(
              hideDesktopSidebar ? "" : " md:ml-[100px] md:pl-0 lg:ml-[220px]"
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
        </main>
      </div>
    </div>
  );
}
