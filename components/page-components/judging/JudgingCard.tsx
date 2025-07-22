"use client";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import AvatarGroup from "@/components/ui/avatar-group";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { useRouter } from "next/navigation";

// Todo: Mock the proper data for the hackathon and project
export type JudgingCardProps = {
  title: string;
  status: "Needs Review" | "Judged" | "Flagged";
  hackathonId: string;
  projectId: string;
};

const JudgingCard = ({
  title,
  status,
  hackathonId,
  projectId,
}: JudgingCardProps) => {
  const router = useRouter();

  const handleCardClick = () => {
    router.push(`/judging/${hackathonId}/${projectId}`);
  };

  return (
    <article
      onClick={handleCardClick}
      className="bg-primary-bg border-2 hover:border-secondary-900 border-tertiary-bg rounded-xl transition-all duration-200 ease-in-out hover:cursor-pointer"
    >
      <header className="flex flex-col gap-4 bg-secondary-bg px-4 py-3 rounded-t-xl">
        <div className="flex justify-between gap-2">
          <div className="flex items-end gap-3 overflow-hidden">
            <Image
              width={76}
              height={76}
              src="/microsoft-placeholder.jpg"
              alt="Project Logo"
              className="rounded-xl object-cover shrink-0"
            />
            <div className="flex flex-col gap-1 min-w-0">
              <h1 className="font-semibold text-white truncate">{title}</h1>
              <h2 className="font-normal text-secondary-text text-xs truncate">
                Open & Sovereign Systems
              </h2>
            </div>
          </div>
          <Badge className="flex items-center gap-1 !bg-[#6E5B1B] px-2 py-0 rounded-2xl h-7">
            <span className="font-roboto font-medium text-[#EFC210] text-xs truncate whitespace-nowrap overflow-hidden">
               {status}
            </span>
          </Badge>
        </div>

        <div className="flex items-center">
          <AvatarGroup limit={3}>
            <Avatar>
              <AvatarImage src="/microsoft-placeholder.jpg" alt="User 1" />
            </Avatar>
            <Avatar>
              <AvatarImage src="/microsoft-placeholder.jpg" alt="User 2" />
            </Avatar>
            <Avatar>
              <AvatarImage src="/microsoft-placeholder.jpg" alt="User 3" />
            </Avatar>
            <Avatar>
              <AvatarImage src="/microsoft-placeholder.jpg" alt="User 4" />
            </Avatar>
            <Avatar>
              <AvatarImage src="/microsoft-placeholder.jpg" alt="User 5" />
            </Avatar>
          </AvatarGroup>
        </div>
      </header>
      <div className="px-4 py-3 border-t-2 border-tertiary-bg">
        <p className="text-secondary-text text-sm">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur.
        </p>
      </div>
      <footer className="flex flex-wrap gap-2 px-4 py-3">
        <Badge variant={"secondary"}>React</Badge>
        <Badge variant={"secondary"}>C++</Badge>
        <Badge variant={"secondary"}>Java</Badge>
        <Badge variant={"secondary"}>Machine Learning</Badge>
      </footer>
    </article>
  );
};

export default JudgingCard;
