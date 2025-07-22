import { Button } from "@/components/ui/button";

const HackathonHeader = () => {
  return (
    <div className="sticky mt-0 px-8 py-2 bg-secondary-bg top-0 flex justify-between items-center z-30">
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 flex-shrink-0 rounded-md overflow-hidden">
          <img
            src="https://dbaimdvhgbmmxfjaszcp.supabase.co/storage/v1/object/public/hackathon-images/logos/PLLogoBrightGreen.svg"
            alt=""
            className="w-full h-full"
          />
        </div>
        <p className="text-xl font-roboto font-semibold">
          PL_Genesis: Modular Worlds Hackathon
        </p>
        <div>
          <span className="flex items-center bg-[#263513] px-3 py-1 rounded-full h-[26px] font-[500] font-roboto text-[#91C152] text-[12px]">
            Registrations live
          </span>
        </div>
      </div>
      <div>
        <Button size="sm">Share</Button>
      </div>
    </div>
  );
};

export default HackathonHeader;
