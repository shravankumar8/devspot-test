import { UserSvg } from "@/components/icons/Location";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { HackathonCardProps } from "@/types/hackathons";
import { cn } from "@/utils/tailwind-merge";
import { CalendarIcon, MapPinIcon } from "lucide-react";
import Image from "next/image";

const HackathonCard = ({ props }: { props: HackathonCardProps }) => {
  const getHackathonLocation = () => {
    if (props.location == "null" || !props.location) return "Virtual";
    return props.location;
  };

  const getStatusBadge = () => {
    const now = new Date();

    const submissionStart = props.deadline_to_join
      ? new Date(props.deadline_to_join)
      : null;
    const submissionEnd = props.deadline_to_join
      ? new Date(props.deadline_to_join)
      : null;
    const registrationStart = props.registration_start_date
      ? new Date(props.registration_start_date)
      : null;
    const registrationEnd = props.deadline_to_join
      ? new Date(props.deadline_to_join)
      : null;

    // Submissions Open overrides everything else
    if (
      submissionStart &&
      submissionEnd &&
      now >= submissionStart &&
      now < submissionEnd
    ) {
      return (
        <Badge className="bg-gradient-to-r from-[#9667FA] to-[#4075FF] !text-white h-[28px] px-2 py-0 rounded-2xl flex items-center gap-1 whitespace-nowrap">
          <span className="text-sm !font-[500] font-roboto">
            Submissions Open
          </span>
        </Badge>
      );
    }

    // Completed: DONE TESTIING
    if (submissionEnd && now >= submissionEnd) {
      return (
        <span className="flex items-center !font-[500] h-[28px] px-2 font-roboto rounded-full text-[#E7E7E8] bg-[#2B2B31] text-sm">
          Completed
        </span>
      );
    }

    // Register Now
    if (
      registrationStart &&
      registrationEnd &&
      now >= registrationStart &&
      now < registrationEnd
    ) {
      return (
        <Badge className="dark:bg-[#263513] hover:dark:bg-[#263513] hover:text-[#91C152] h-[28px] px-2 py-0 rounded-2xl flex items-center gap-1 whitespace-nowrap">
          <span className="text-sm !font-[500] text-[#91C152] font-roboto">
            Register Now
          </span>
        </Badge>
      );
    }

    // Upcoming
    if (registrationStart && now < registrationStart) {
      return (
        <Badge className="h-[28px] px-2 py-0 rounded-2xl flex items-center gap-1">
          <span className="text-sm !font-[500]  font-roboto">Upcoming</span>
        </Badge>
      );
    }

    // Default fallback
    return null;
  };

  return (
    <Card
      className={cn(
        "flex min-w-[286px] flex-col relative rounded-2xl overflow-hidden border-2 border-solid border-[#2b2b31] cursor-pointer"
      )}
    >
      {/* {props.id !== 1 && (
        <div className="absolute inset-0 bg-[#13131A] bg-opacity-60 rounded-xl pointer-events-none" />
      )} */}
      <CardHeader className="flex flex-row items-end justify-between space-y-0 gap-3 !py-3 !px-4 bg-secondary-bg">
        <div className="flex items-center gap-2">
          {props.organizer_logo && (
            <Image
              width={48}
              height={48}
              alt={props.organizer_name}
              src={props.organizer_logo}
              className="rounded-md"
            />
          )}

          <div className="flex flex-col items-start">
            <span className="text-xs font-medium text-secondary-text font-roboto uppercase">
              ORGANIZER
            </span>
            <span className="text-sm font-medium text-white font-roboto capitalize">
              {props.organizer_name}
            </span>
          </div>
        </div>

        {getStatusBadge()}
      </CardHeader>

      <Separator className="h-0.5 bg-tertiary-bg" />

      <CardContent className="flex flex-col gap-3 !py-3 !px-4 bg-primary-bg flex-1">
        <h2 className="text-white text-base font-roboto font-semibold truncate">
          {props.hackathon_name}
        </h2>

        <div className="flex flex-col gap-2 flex-1 text-secondary-text font-medium text-xs font-roboto">
          <div className="flex items-center gap-2">
            <MapPinIcon className="w-5 h-5 text-main-primary" />
            <span className="capitalize">{getHackathonLocation()}</span>
          </div>

          <div className="flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-main-primary" />
            <span className="capitalize">{props.start_date}</span>
          </div>

          <div className="flex items-center gap-2">
            <UserSvg
              width="20px"
              height="20px"
              className="w-5 text-main-primary h-5"
            />
            <span className="capitalize">
              {props.number_of_participant} Participants
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default HackathonCard;
