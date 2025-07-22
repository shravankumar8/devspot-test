// components/PrivateRoute.tsx
"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../../../../state";
import DevspotLoader from "@/components/common/DevspotLoader";

interface PrivateRouteProps {
  children: ReactNode;
}

export function PrivateRoute({ children }: Readonly<PrivateRouteProps>) {
  const { session, fetchSession, isLoading } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      if (!session && !isLoading) {
        await fetchSession();
        if (!session && !isLoading) {
          router.push("/login");
        }
      }
    };

    checkSession();
  }, [session, fetchSession, router]);

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-screen w-full">
        <DevspotLoader />
      </div>
    );
  if (!session) return null; // Render nothing while checking auth state

  return <>{children}</>;
}
