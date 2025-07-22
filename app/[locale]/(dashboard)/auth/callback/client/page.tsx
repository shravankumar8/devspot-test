"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const hash = window.location.hash;

    if (!hash) {
      console.log("No hash found in URL");
      return router.replace("/auth/auth-code-error");
    }

    if (hash) {
      console.log("Hash found in URL:", hash);
      const params = new URLSearchParams(hash.slice(1));
      const accessToken = params.get("access_token");
      const refreshToken = params.get("refresh_token");

      if (!accessToken || !refreshToken)
        return router.replace("/auth/auth-code-error");

      const authUrl = new URL(
        `${process.env.NEXT_PUBLIC_BASE_SITE_URL}/api/auth/callback`
      );

      authUrl.searchParams.append("access_token", accessToken);
      authUrl.searchParams.append("refresh_token", refreshToken);

      router.replace(authUrl.toString());
    }
  }, [router]);

  return null;
}
