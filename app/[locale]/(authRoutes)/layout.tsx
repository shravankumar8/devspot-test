"use client";
import DevspotLoader from "@/components/common/DevspotLoader";
import { useAuthStore } from "@/state";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

const exemptRoutes = [
  "/en/sign-up/participants/describe",
  "/en/sign-up/TO/verify-email",
  "/en/sign-up/TO/email-confirmation",
  "/en/sign-up/participants/select-avatar",
  "/en/sign-up/participants/select-location",
  "/en/sign-up/participants/select-skills",
  "/en/sign-up/participants/connect-account",
  "/en/sign-up/participants/connect-account/success",
  "/en/sign-up/participants/verify-email",
];

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { fetchSession, isLoading, session } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const isExempt = exemptRoutes.includes(pathname);

  useEffect(() => {
    if (!isExempt) {
      fetchSession();
    }
  }, [fetchSession]);

  useEffect(() => {
    if (!isExempt && session) {
      router.push("/");
    }
  }, [session, router]);

  if (isExempt) {
    return (
      <div>
        <Link href="/" className="sm:fixed sm:p-0 p-3 flex top-7 left-7">
          <Image
            src="/devspot_logo.png"
            alt="logo"
            width={130}
            height={32}
            quality={100}
            priority
            className="max-w-fit"
          />
        </Link>
        <main className="px-5 min-h-screen grid place-content-center">
          {children}
        </main>
      </div>
    );
  }

  return (
    <div className="">
      <Link href="/" className="sm:fixed sm:p-0 p-3 flex top-7 left-7">
        <Image
          src="/devspot_logo.png"
          alt="logo"
          width={130}
          height={32}
          quality={100}
          priority
          className="max-w-fit"
        />
      </Link>

      {(isLoading || session) && (
        <div className="flex justify-center items-center h-screen w-full">
          <DevspotLoader />
        </div>
      )}

      {!session && !isLoading && (
        <main className="px-5 min-h-screen grid place-content-center">
          {children}
        </main>
      )}
    </div>
  );
}
