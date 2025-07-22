import {
  LOGO_TEMPLATES,
  LogoPlaceholder,
} from "@/components/page-components/projects/constants/bacakground";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Projects } from "@/types/entities";
import { cn } from "@/utils/tailwind-merge";
import { getInitials } from "@/utils/url-validator";
import Image from "next/image";
import { useMemo } from "react";

const ProfileProjectCard = ({ props }: { props: Projects }) => {
  const getLogoSource = () => {
    if (!props?.logo_url) return null;

    let selectedLogoIndex = LOGO_TEMPLATES.indexOf(props.logo_url);

    if (selectedLogoIndex >= 0) {
      return (
        <div
          className={`${cn(
            selectedLogoIndex % 2 == 0 ? "bg-[#13131a] " : "bg-[#E7E7E8]",
            "w-full h-full flex justify-center items-center"
          )}`}
        >
          <LogoPlaceholder index={selectedLogoIndex} />
        </div>
      );
    }

    return props.logo_url;
  };

  const logoSource = useMemo(getLogoSource, [getLogoSource]);

  return (
    <Card className="rounded-xl overflow-hidden border-2 border-solid border-[#2b2b31] font-roboto flex flex-col cursor-pointer">
      <CardHeader className="flex flex-col items-end justify-between space-y-0 gap-3 !py-3 !px-4 bg-secondary-bg">
        <div className="flex items-end gap-3 w-full">
          <div className="min-w-[72px] w-[72px] h-[72px] rounded-[12px] bg-primary-bg overflow-hidden border-2 border-tertiary-bg flex-shrink-0">
            {logoSource &&
              (typeof logoSource === "string" ? (
                <Image
                  className="rounded-xl w-full h-full object-cover"
                  src={logoSource || "/placeholder.svg"}
                  alt="Project logo"
                  width={72}
                  height={72}
                />
              ) : (
                logoSource
              ))}
          </div>

          <div className="flex flex-col items-start gap-0.5 overflow-hidden w-full">
            <p className="text-white text-base font-medium capitalize truncate w-full">
              {props?.name}
            </p>

            <p className="text-secondary-text text-sm font-medium truncate w-full">
              {props?.hackathons?.name}
            </p>

            <p className="text-secondary-text text-sm font-medium truncate w-full">
              By {props?.hackathons?.organizer?.name}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full">
          <div className="flex items-center flex-1">
            {props.project_team_members.slice(0, 3).map((member, index) => (
              <div
                key={index}
                style={{ zIndex: 3 - index }}
                className={`relative w-[40px] h-[40px] ${
                  index > 0 ? "-ml-2" : "ml-[-1.00px]"
                } border-0 border-none flex-shrink-0`}
              >
                <Avatar className="absolute w-[40px] h-[40px] -top-0.5 -left-0.5">
                  <AvatarImage
                    src={member?.users?.avatar_url ?? ""}
                    alt={member?.users?.full_name ?? ""}
                    className="object-cover"
                  />
                  <AvatarFallback>
                    {getInitials(member?.users?.full_name ?? "")}
                  </AvatarFallback>
                </Avatar>
              </div>
            ))}

            {props?.project_team_members?.length > 3 && (
              <div className="flex-col w-[40px] h-[40px] items-center justify-center p-2.5 -ml-2 z-0 bg-primary-bg rounded-full border-[2.5px] border-solid border-[#13131a] flex flex-shrink-0">
                <div className="text-secondary-text text-lg font-semibold">
                  +{props?.project_team_members?.length - 3}
                </div>
              </div>
            )}
          </div>

          {/* <TrophyIcon /> */}
        </div>
      </CardHeader>

      <Separator className="h-0.5 bg-tertiary-bg" />

      <CardContent className="flex flex-col items-start justify-between !p-4 bg-primary-bg h-full gap-3">
        <div className="text-secondary-text text-xs font-meduim leading-6 line-clamp-[8] whitespace-normal break-words">
          {props?.description}
        </div>

        <div className="flex items-center gap-4 flex-wrap w-full">
          {props?.technologies?.slice(0, 3).map((tech, index) => (
            <Badge
              key={index}
              className="h-7 px-2 py-0 !bg-[#2B2B31] rounded-2xl"
            >
              <span className="font-normal text-sm text-neutral-100">
                {tech}
              </span>
            </Badge>
          ))}

          {props?.technologies && props?.technologies?.length > 3 && (
            <Badge className="h-7 px-2 py-0 !bg-[#2B2B31] rounded-2xl">
              <span className="font-normal text-sm text-neutral-100">
                +{props?.technologies?.length - 3} more
              </span>
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileProjectCard;
