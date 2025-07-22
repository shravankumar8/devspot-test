import { Avatar } from "@/components/ui/avatar";
import { AvatarImage } from "@radix-ui/react-avatar";
import React from "react";

const TeamMembers = () => {
  return (
    <div className="flex flex-col bg-secondary-bg px-5 py-4 rounded-xl">
      <h5 className="font-semibold text-base">Team members</h5>
      <div className="bg-black-terciary my-4 w-full h-[2px]" />
      <ul className="flex flex-col gap-4">
        <li>
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage
                src="/microsoft-placeholder.jpg"
                alt="Team member 1"
              />
            </Avatar>

            <div className="flex flex-col gap-1">
              <h4 className="font-semibold text-white text-lg">
                Russel French
              </h4>
              <p className="font-normal text-secondary-text text-sm">
                Developer
              </p>
            </div>
          </div>
        </li>

        <li>
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage
                src="/microsoft-placeholder.jpg"
                alt="Team member 1"
              />
            </Avatar>

            <div className="flex flex-col gap-1">
              <h4 className="font-semibold text-white text-lg">
                Russel French
              </h4>
              <p className="font-normal text-secondary-text text-sm">
                Developer
              </p>
            </div>
          </div>
        </li>

        <li>
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage
                src="/microsoft-placeholder.jpg"
                alt="Team member 1"
              />
            </Avatar>

            <div className="flex flex-col gap-1">
              <h4 className="font-semibold text-white text-lg">
                Russel French
              </h4>
              <p className="font-normal text-secondary-text text-sm">
                Developer
              </p>
            </div>
          </div>
        </li>
      </ul>
    </div>
  );
};

export default TeamMembers;
