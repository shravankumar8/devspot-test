"use client";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useSignupStore } from "@/state";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import useSWR from "swr";

export default function ConnectAccountSuccess() {
  const { setActiveStep } = useSignupStore();
  const router = useRouter();

  const { data: profileData, isLoading: isProfileDataLoading } = useSWR(
    "/api/profile",
    fetchPersonalInfo
  );

  async function fetchPersonalInfo(url: string) {
    try {
      const response = await axios.get(url);
      console.log(response);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    setActiveStep(5);
  }, []);

  return (
    <div className="md:w-[500px] w-full mt-[100px] md:mt-[135px] gap-20 flex flex-col">
      <div className="flex flex-col gap-8 md:gap-10">
        <Image
          src="/rocket.png"
          width={233}
          height={234}
          alt="Rocket image"
          className="sm:w-[233px] sm:h-[234px] self-center "
        />

        <div className="gap-5 flex flex-col">
          <h4 className="sm:text-[32px] text-[28px] font-bold sm:leading-[32px] leading-[100%]">
            Your account was successfully created!
          </h4>

          <p className="text-secondary-text text-base font-medium font-roboto">
            You earned 100 dev tokens for creating your profile.
          </p>
        </div>
      </div>

      <div className="w-full flex flex-wrap justify-between md:justify-end gap-3 md:gap-5">
        <Button
          onClick={() => {
            router.push("/hackathons");
            setActiveStep(5);
          }}
          type="submit"
          size="lg"
          variant="ghost"
          className="w-full md:w-auto"
        >
          Browse DevSpot
        </Button>

        <Button
          onClick={() => {
            router.push(`/profile`);
          }}
          disabled={isProfileDataLoading}
          type="button"
          size="lg"
          className="w-full md:w-auto flex items-center gap-2"
        >
          {isProfileDataLoading && <Spinner size="small" />} Edit my profile
        </Button>
      </div>
    </div>
  );
}
