"use client";

import { ProgressStep } from "@/components/page-components/auth/ProgressStep";
import { useSignupStore } from "@/state";
import { usePathname } from "next/navigation";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { ActiveStep } = useSignupStore();
  const pathname = usePathname();
  const hideSidebar = pathname.includes("/sign-up/verify-email");

  return (
    <div className="relative">
      {!hideSidebar && (
        <div className="absolute md:-left-12 lg:-left-28 xl:-left-48 md:top-1/3 top-4 left-1/2 -translate-x-1/2 transition-all duration-200 ease-in-out">
          <ProgressStep activeStep={ActiveStep} stepsNumber={5} />
        </div>
      )}

      <main className="min-h-[calc(100vh-40px)] flex justify-center w-full items-start">
        {children}
      </main>
    </div>
  );
}
