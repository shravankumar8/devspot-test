"use client";

import DevspotLoader from "@/components/common/DevspotLoader";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import HackathonsManager from "./hackathonsManager";

const TOHackathon = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [scheduleLoading, setScheduleLoading] = useState(false);

  useEffect(() => {
    setScheduleLoading(true);
    const code = searchParams.get("code");
    const state = searchParams.get("state");

    if (!code || !state) {
      setScheduleLoading(false);
      return;
    }

    const newUrl = `/en/TO/hackathons/${state}/analytics/hackathons?activeTab=schedule&selectedModal=edit-schedule&code=${code}`;
    router.push(newUrl);
  }, [searchParams, router]);

  if (scheduleLoading) {
    return (
      <div className="mt-16">
        <div className="flex justify-center items-center h-[calc(100vh-192px)] w-full">
          <DevspotLoader />
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <HackathonsManager />
    </div>
  );
};

export default TOHackathon;
