import { UserSvg } from "@/components/icons/Location";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { CalendarIcon, GlobeIcon, MapPinIcon } from "lucide-react";

const ProfileHackathonCardSkeleton = () => {
  return (
    <Card className="flex flex-col rounded-2xl overflow-hidden border-2 border-solid border-[#2b2b31]">
      <CardHeader className="flex flex-row items-end justify-between space-y-0 gap-3 !py-3 !px-4 bg-secondary-bg">
        <div className="flex items-center gap-2">
          <Skeleton className="w-12 h-12 rounded-md" />

          <div className="flex flex-col items-start">
            <Skeleton className="w-16 h-3 mb-1" />
            <Skeleton className="w-24 h-5" />
          </div>
        </div>

        <Skeleton className="h-7 w-16 rounded-2xl" />
      </CardHeader>

      <Separator className="h-0.5 bg-tertiary-bg" />

      <CardContent className="flex flex-col gap-3 !p-3 bg-primary-bg flex-1">
        {/* Skeleton for title */}
        <Skeleton className="h-7 w-40" />

        <div className="flex gap-2 flex-1 mt-2">
          {/* Skeletons for info rows */}
          {[GlobeIcon, MapPinIcon, CalendarIcon].map((Icon, index) => (
            <div key={index} className="flex items-center gap-4">
              <Icon className="w-5 h-5 text-neutral-800" />
              <Skeleton className="h-4 w-32 sm:w-40" />
            </div>
          ))}
          <div className="flex items-center gap-4">
            <UserSvg color="#262626" className="w-5 h-5" />
            <Skeleton className="h-4 w-32 sm:w-40" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileHackathonCardSkeleton;
