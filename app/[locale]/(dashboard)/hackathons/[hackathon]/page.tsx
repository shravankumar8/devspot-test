"use client";

import HackathonPage from "@/components/page-components/hackathons";
import HackathonSkeleton from "@/components/page-components/hackathons/header-skeleton";
import { useHackathonStore } from "@/state/hackathon";
import { Hackathons } from "@/types/entities";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";
import { toast } from "sonner";
import useSWR from "swr";

export type ActionTypes =
  | "join"
  | "stake"
  | "apply"
  | "apply_additional"
  | "apply_stake"
  | "apply_additional_stake";

export default function HackathonDetails({
  params,
}: Readonly<{
  params: { locale: string; hackathon: string };
}>) {
  const router = useRouter();
  const id = params.hackathon;
  const { selectedHackathon, setSelectedHackathon } = useHackathonStore();


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

  if (fetchHackathonError || !id) {
    toast.error("Invalid Hackathon");
    router.push("/hackathons");
  }

  const hackathonInformation: Hackathons = useMemo(() => {
    return fetchedHackathon;
  }, [fetchedHackathon]);

  useEffect(() => {
    if (fetchedHackathon) {
      setSelectedHackathon(fetchedHackathon);
    }
  }, [fetchedHackathon]);




  if (isLoading) {
    return <HackathonSkeleton />;
  }

  return (
    <HackathonPage
      isOwner={false}
      hackathonData={hackathonInformation}
      isHackathonDataLoading={isLoading}
    />
  );
}
