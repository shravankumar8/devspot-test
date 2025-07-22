"use client";

import DevspotLoader from "@/components/common/DevspotLoader";
import HackathonPage from "@/components/page-components/hackathons";
import HackathonSkeleton from "@/components/page-components/hackathons/header-skeleton";
import { Button } from "@/components/ui/button";
import { Hackathons } from "@/types/entities";
import axios from "axios";
import { PencilIcon } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import useSWR from "swr";
import { EditHackathonFooter } from "./components/EditHackathonFooter";

export type ActionTypes =
  | "join"
  | "stake"
  | "apply"
  | "apply_additional"
  | "apply_stake"
  | "apply_additional_stake";

export default function TOHackathonDetails({
  params,
}: Readonly<{
  params: { id: string };
}>) {
  const searchParams = useSearchParams();
  const id = params.id;
  const router = useRouter();
  
  // const [scheduleLoading, setScheduleLoading] = useState(false);
  // useEffect(() => {
  //   setScheduleLoading(true);
  //   const code = searchParams.get("code");
  //   const state = searchParams.get("state");

  //   if (!code || !state) {
  //     setScheduleLoading(false);
  //     return;
  //   }

  //   const newUrl = `/en/TO/hackathons/${state}/analytics/hackathons?activeTab=schedule&selectedModal=edit-schedule&code=${code}`;
  //   router.push(newUrl);
  // }, [searchParams, router]);

  const fetchHackathonInformation = async (url: string) => {
    try {
      const response = await axios.get(url);
      return response.data?.data;
    } catch (error) {
      console.log(error);
    }
  };

  const {
    data: fetchedHackathon,
    error: fetchHackathonError,
    isLoading,
    // mutate,
  } = useSWR(`/api/hackathons/${id}`, fetchHackathonInformation);

  const hackathonInformation: Hackathons = useMemo(() => {
    return fetchedHackathon;
  }, [fetchedHackathon]);

  if (fetchHackathonError || !id) {
    toast.error("Invalid Hackathon");
    router.push("/hackathons");
  }
  if (isLoading) {
    return (
      <div className="p-4">
        <HackathonSkeleton />
      </div>
    );
  }
  // if (scheduleLoading) {
  //   return (
  //     <div className="mt-16">
  //       <div className="flex justify-center items-center h-[calc(100vh-192px)] w-full">
  //         <DevspotLoader />
  //       </div>
  //     </div>
  //   );
  // }
  const handleEdit = () => {
    const current = new URLSearchParams(searchParams);
    current.set("view", "edit");

    router.push(`?${current.toString()}`);
  };

  const view = searchParams.get("view");

  if (view == "preview") {
    return (
      <div className="p-4 hackathon-container">
        <HackathonPage
          isOwner={false}
          hackathonData={hackathonInformation}
          isHackathonDataLoading={isLoading}
        />

        <Button
          onClick={handleEdit}
          size="sm"
          className="gap-2 flex items-center fixed bottom-4 right-4 z-20"
        >
          <PencilIcon size={16} />
          Edit Mode
        </Button>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="p-4 hackathon-container">
        <HackathonPage
          isOwner={true}
          hackathonData={hackathonInformation}
          isHackathonDataLoading={isLoading}
        />
        <EditHackathonFooter hackathon={hackathonInformation} />
      </div>
    </div>
  );
}
