import { CalendarSvg } from "@/components/icons/Calendar";
import { Badge } from "@/components/ui/badge";

const HackathonCard = () => {
  return (
    <div className="flex flex-col bg-secondary-bg px-5 py-4 rounded-xl">
      <div>
        <h5 className="font-semibold text-base mb-1">Hackathon</h5>
        <Badge variant={"default"}>Quantum Shift</Badge>
      </div>

      <div className="mt-4">
        <h5 className="font-semibold text-base mb-1">Challenge(s)</h5>
        <Badge variant={"default"}>Open & Sovereign Systems</Badge>
      </div>

      <div className="bg-black-terciary my-4 w-full h-[2px]" />

      <div className="flex items-center gap-1">
        <CalendarSvg />
        <p className="font-normal text-secondary-text text-xs">
          Created May 9, 2025
        </p>
      </div>
    </div>
  );
};

export default HackathonCard;
