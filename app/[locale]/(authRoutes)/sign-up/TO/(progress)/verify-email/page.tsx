"use client";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useSignupStore } from "@/state";
import { useEffect, useState } from "react";
import { getSupabaseAuthUser, resendVerificationEmail } from "../../../actions";

export default function VerifyEmail() {
  const { personalInfo, setActiveStep, setPersonalInfo } = useSignupStore();
  const [isResending, setIsResending] = useState(false);
  const [isFetchingUser, setIsFetchingUser] = useState(!personalInfo.email); // Only fetch if we don't have email

  useEffect(() => {
    const fetchUserData = async () => {
      if (personalInfo.email) return; // already have it, skip fetch
      try {
        const { data: user } = await getSupabaseAuthUser();
        if (user) {
          setPersonalInfo({
            email: user.email ?? personalInfo.email,
            name: user.user_metadata?.full_name ?? personalInfo.name,
          });
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setIsFetchingUser(false);
      }
    };

    fetchUserData();
  }, [personalInfo.email, personalInfo.name, setPersonalInfo]);

  const handleResend = async () => {
    setIsResending(true);
    const { success, message } = await resendVerificationEmail(
      personalInfo.email
    );
    alert(message);
    setIsResending(false);
  };

  const displayEmail = isFetchingUser ? (
    <span className="bg-gray-200 h-[1ch] animate-pulse">...</span>
  ) : (
    personalInfo.email
  );

  return (
    <div className="flex flex-col gap-7 mt-[100px] md:mt-0 w-full sm:w-[500px]">
      <h4 className="font-bold text-[28px] sm:text-[32px] leading-[100%] sm:leading-[32px]">
        Check your email
      </h4>

      <div className="flex flex-col gap-3">
        <p className="font-roboto font-medium text-[#89898C] text-[16px]">
          Click the link we sent to{" "}
          <strong className="text-[#ffffff]">{displayEmail}</strong> to verify
          your account and continue.
        </p>

        {/* <p className="font-roboto font-medium text-[#89898C] text-[16px] leading-[1.5]">
          <HelpCircle className="inline-block -top-[2px] relative mr-2 w-5 h-5 text-[#4E52F5]" />
          Having trouble? Make sure you check your email in the same browser you
          have DevSpot open.
        </p> */}
      </div>

      <div className="flex justify-center w-full">
        <Button
          onClick={handleResend}
          disabled={isResending || !personalInfo.email}
          variant="tertiary"
          type="button"
          size="lg"
          className="flex items-center gap-2 !pb-[2px] font-roboto text-white !text-base"
        >
          {isResending && <Spinner size="small" />} Resend email
        </Button>
      </div>
    </div>
  );
}
