"use client";

import Profile from "@/components/page-components/profile";
import { UserProfile } from "@/types/profile";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";
import useSWR from "swr";

export default function PersonPage({
  params,
}: {
  params: { locale: string; id: string };
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const { data: profileData, isLoading: isProfileDataLoading } =
    useSWR<UserProfile>(`/api/profile/${params.id}`, fetchPersonalInfo);

  async function fetchPersonalInfo(url: string) {
    try {
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    const success = searchParams.get("success");
    const provider = searchParams.get("provider");

    if (success && provider) {
      setTimeout(() => {
        success == "true"
          ? toast.success(`${provider} account successfully connected`)
          : toast.error(`${provider} account failed to connect`);
        router.replace(`/profile`);
      }, 2000);
    }
  }, []);

  return (
    <Profile
      isOwner={false}
      isProfileDataLoading={isProfileDataLoading}
      profileData={profileData! ?? {}}
    />
  );
}
