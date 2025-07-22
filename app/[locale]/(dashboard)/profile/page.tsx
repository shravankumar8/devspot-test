"use client";

import { PrivateRoute } from "@/components/page-components/auth/protected-route/page";
import Profile from "@/components/page-components/profile";
import { UserProfile } from "@/types/profile";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef } from "react";
import { toast } from "sonner";
import useSWR from "swr";

export default function ProfilePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const hasShownRoleToast = useRef(false);

  const fetchProfile = async (url: string) => {
    const resp = await axios.get(url);
    return resp.data as UserProfile;
  };

  const { data: profileData, isLoading: isProfileDataLoading } =
    useSWR<UserProfile>(`/api/profile`, fetchProfile);

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

  const baseUrl = useMemo(
    () =>
      `${process.env.NEXT_PUBLIC_PROTOCOL}${process.env.NEXT_PUBLIC_BASE_SITE_URL}`,
    []
  );

  useEffect(() => {
    if (!profileData) return;

    const { roles } = profileData;

    const primaryRoleName = roles.find((r) => r.is_primary)?.participant_roles
      ?.name;

    if (
      (roles.length === 0 || !primaryRoleName) &&
      !hasShownRoleToast.current
    ) {
      hasShownRoleToast.current = true;
      toast.error("Please add a role to your profile", {
        position: "top-right",
      });

      return router.push(`${baseUrl}/profile?selectedModal=edit-about`);
    }
  }, [profileData, router, baseUrl]);

  const linkedError = new URLSearchParams(window.location.search).get(
    "linkedError"
  );

  useEffect(() => {
    if (linkedError === "identity_already_exists") {
      toast.error(
        "The selected identity is already linked to another account."
      );

      // remove just the linkedError param from the URL
      const params = new URLSearchParams(window.location.search);
      params.delete("linkedError");
      const newQuery = params.toString();
      const newUrl =
        window.location.pathname + (newQuery ? `?${newQuery}` : "");
      window.history.replaceState({}, "", newUrl);
    }
  }, [linkedError]);

  return (
    <PrivateRoute>
      <Profile
        isOwner
        isProfileDataLoading={isProfileDataLoading}
        profileData={profileData! ?? {}}
      />
    </PrivateRoute>
  );
}
