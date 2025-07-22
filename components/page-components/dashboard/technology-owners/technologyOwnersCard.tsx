import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { TechnologyOwners } from "@/types/entities";
import { cn } from "@/utils/tailwind-merge";
import { getInitials } from "@/utils/url-validator";

const TechnologyOwnersCard = ({
  techOwners,
}: {
  techOwners: TechnologyOwners;
}): JSX.Element => {
  return (
    <Card
      className={cn(
        "flex relative font-roboto flex-col rounded-xl overflow-hidden border-2 border-solid border-[#2b2b31] ",
        techOwners?.id !== 1 ? "cursor-auto" : "cursor-pointer"
      )}
    >
      {techOwners.id !== 1 && (
        <div className="absolute inset-0 bg-[#13131A] bg-opacity-60 rounded-xl pointer-events-none" />
      )}
      <div className="flex items-center gap-3 px-4 py-3 bg-secondary-bg">
        <Avatar className="w-[124px] h-[124px] border-2 border-tertiary-bg rounded-[12px]">
          <AvatarImage
            src={techOwners?.logo ?? ""}
            alt={techOwners?.name}
            className="z-0 object-contain"
          />
          <AvatarFallback className="!rounded-none !bg-transparent">
            {getInitials(techOwners?.name)}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col justify-between h-[124px] items-start">
          <div>
            {techOwners?.no_of_upcoming_hackathons !== null &&
              techOwners?.no_of_upcoming_hackathons > 0 && (
                <p className="text-[#91C152] bg-[#263513] px-3 py-1 rounded-[16px] text-xs">
                  {techOwners.no_of_upcoming_hackathons} Upcoming hackathons
                </p>
              )}
          </div>

          <div className="flex flex-col items-start gap-0.5 ">
            <p className="text-white text-xl font-medium">{techOwners?.name}</p>

            <p className="text-secondary-text text-base font-medium">
              {techOwners?.domain}
            </p>
          </div>
        </div>
      </div>

      <Separator className="h-0.5 bg-tertiary-bg" />

      <CardContent className="flex flex-col items-start gap-3 !px-4 !py-3 bg-primary-bg">
        <div>
          <p className="text-secondary-text text-sm font-roboto font-medium">
            {techOwners.tagline}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default TechnologyOwnersCard;
