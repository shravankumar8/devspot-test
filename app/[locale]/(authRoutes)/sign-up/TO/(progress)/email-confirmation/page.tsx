"use client";

import { Button } from "@/components/ui/button";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function ConnectAccountSuccess() {
  const router = useRouter();

  async function fetchPersonalInfo(url: string) {
    try {
      const response = await axios.get(url);
      console.log(response);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }

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
            We’ll be in touch soon!
          </h4>

          <p className="text-secondary-text text-base font-medium font-roboto">
            We're reviewing your information and will send you an email with
            access to DevSpot soon!
          </p>
        </div>
      </div>

      <div className="w-full flex flex-wrap justify-between md:justify-end gap-3 md:gap-5">
        <Button
          onClick={() => {
            router.push("/TO/chat-with-spot");
          }}
          type="submit"
          size="lg"
          variant="ghost"
          className="w-full md:w-auto"
        >
          Browse DevSpot
        </Button>
      </div>
    </div>
  );
}
