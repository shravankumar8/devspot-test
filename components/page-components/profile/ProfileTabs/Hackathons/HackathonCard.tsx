import { UserSvg } from "@/components/icons/Location";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Hackathons } from "@/types/entities";
import { formatDate } from "@/utils/date";
import { CalendarIcon, MapPinIcon } from "lucide-react";
import Image from "next/image";

const HackathonCard = ({ userHackathon }: { userHackathon: Hackathons }) => {
  const getStatusBadge = () => {
    const now = new Date();

    const submissionStart = userHackathon.deadline_to_join
      ? new Date(userHackathon.deadline_to_join)
      : null;
    const submissionEnd = userHackathon.deadline_to_join
      ? new Date(userHackathon.deadline_to_join)
      : null;
    const registrationStart = userHackathon.registration_start_date
      ? new Date(userHackathon.registration_start_date)
      : null;
    const registrationEnd = userHackathon.deadline_to_join
      ? new Date(userHackathon.deadline_to_join)
      : null;

    // Submissions Open overrides everything else
    if (
      submissionStart &&
      submissionEnd &&
      now >= submissionStart &&
      now < submissionEnd
    ) {
      return (
        <Badge className="bg-gradient-to-r from-[#9667FA] to-[#4075FF] !text-white h-[28px] px-2 py-0 rounded-2xl flex items-center gap-1">
          <span className="text-sm !font-[500] font-roboto">
            Submissions Open
          </span>
        </Badge>
      );
    }

    // Completed
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
        <Badge className="dark:bg-[#263513] hover:dark:bg-[#263513] hover:text-[#91C152] h-[28px] px-2 py-0 rounded-2xl flex items-center gap-1">
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
    <Card className="flex flex-col min-h-[140px] rounded-2xl overflow-hidden border-2 border-solid border-[#2b2b31] cursor-pointer">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 gap-3 !py-3 !px-4 bg-secondary-bg">
        <div className="flex items-center gap-2">
          <Image
            width={48}
            height={48}
            alt="Organizer logo"
            src={userHackathon?.avatar_url}
            className="rounded-md overflow-hidden"
          />

          <div className="flex flex-col items-start">
            <span className="text-xs font-medium text-secondary-text font-roboto">
              ORGANIZER
            </span>
            <span className="text-sm font-medium text-white font-roboto capitalize">
              {userHackathon?.organizer?.name}
            </span>
          </div>
        </div>

        {getStatusBadge()}
      </CardHeader>

      <Separator className="h-0.5 bg-tertiary-bg" />

      <CardContent className="flex flex-col gap-3 !p-3 bg-primary-bg flex-1">
        <h2 className="text-white text-base font-roboto font-bold capitalize">
          {userHackathon?.name}
        </h2>

        <div className="flex flex-col justify-between gap-3 flex-1 text-secondary-text font-normal text-xs font-roboto">
          <div className="flex items-center gap-4">
            <MapPinIcon className="w-5 h-5 text-main-primary" />
            <span className="capitalize">
              {userHackathon?.location ?? `${userHackathon?.type} hackathon`}{" "}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <CalendarIcon className="w-5 h-5 text-main-primary" />
            <span>{formatDate(userHackathon.start_date, false)}</span>
          </div>

          <div className="flex items-center gap-4">
            <UserSvg
              width={20}
              height={20}
              className="w-5 text-main-primary h-5"
            />
            <span>{userHackathon?.number_of_participants} Participants</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default HackathonCard;
