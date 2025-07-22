import Clipboard from "@/components/icons/Clipboard";
import { UserSvg } from "@/components/icons/Location";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatDate } from "@/utils/date";
import { CalendarIcon, MapPinIcon } from "lucide-react";
import Image from "next/image";

// Todo: Add prop types for the ProfileJudgingHackathonCard component
const ProfileJudgingHackathonCard = ({
  userHackathon,
  judgingId,
}: {
  userHackathon: any;
  judgingId: number;
}) => {
  console.log(`ProfileJudgingHackathonCard /judging/${userHackathon.id}`);
  return (
    <Card className="flex flex-col border-[#2b2b31] border-2 border-solid rounded-2xl min-h-[140px] overflow-hidden">
      <CardHeader className="flex flex-row justify-between items-center gap-3 space-y-0 bg-secondary-bg !px-4 !py-3">
        <div className="flex md:flex-row flex-col md:items-center gap-2">
          <Image
            width={48}
            height={48}
            alt="Organizer logo"
            // Todo: add proper logo
            src={userHackathon?.organizer?.logo}
            className="rounded-md overflow-hidden"
          />

          <div className="flex flex-col items-start">
            <span className="font-roboto font-medium text-secondary-text text-xs">
              ORGANIZER
            </span>
            <span className="font-roboto font-medium text-white text-sm capitalize">
              {userHackathon?.organizer?.name}
            </span>
          </div>
        </div>

        <div className="flex md:flex-row flex-col items-end gap-3">
          {userHackathon.status === "live" ? (
            <Badge className="flex items-center gap-1 hover:dark:bg-[#263513] dark:bg-[#263513] px-2 py-0 rounded-2xl h-7 hover:text-[#91C152]">
              <div className="flex justify-center items-center w-6 h-6">
                <div className="bg-[#91C152] rounded-md w-3 h-3" />
              </div>
              <span className="font-roboto font-medium text-[#91C152] text-xs">
                Live
              </span>
            </Badge>
          ) : userHackathon.status === "upcoming" ? (
            <span className="flex items-center bg-[#2B2B31] px-3 py-2 rounded-full font-[500] font-roboto text-[#E7E7E8] text-[12px]">
              Upcoming
            </span>
          ) : (
            <span className="flex items-center bg-[#2B2B31] px-3 py-2 rounded-full font-[500] font-roboto text-[#E7E7E8] text-[12px]">
              Ended
            </span>
          )}
        </div>
      </CardHeader>

      <Separator className="bg-tertiary-bg h-0.5" />

      <CardContent className="flex flex-col flex-1 gap-3 bg-primary-bg !p-3">
        <h2 className="font-roboto font-bold text-white text-base capitalize">
          {userHackathon?.name}
        </h2>

        <div className="flex flex-col flex-1 justify-between gap-3 font-roboto font-normal text-secondary-text text-xs">
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
              className="w-5 h-5 text-main-primary"
            />
            <span>{userHackathon?.number_of_participants} Participants</span>
          </div>

          <Button
            size={"md"}
            // Todo: implement proper link
            onClick={() => (window.location.href = `/judging/${judgingId}`)}
          >
            <Clipboard /> <span className="ml-2">My judging dashboard</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileJudgingHackathonCard;
