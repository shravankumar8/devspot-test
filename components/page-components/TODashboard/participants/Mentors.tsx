import { Button } from "@/components/ui/button";
import { InfoIcon } from "lucide-react";

const Mentors = () => {
  return (
    <div className="p-6 bg-secondary-bg rounded-2xl h-[360px] overflow-y-scroll border border-black-terciary">
      <header className="flex justify-between items-center">
        <p className="text-secondary-text">Mentor</p>
        <p className="text-secondary-text">Calendar Clicks</p>
      </header>

      <div className="mt-4">
        <div className="h-[200px] flex items-center justify-center flex-col">
          <div className="flex gap-3 sm:px-4 md:px-6 lg:px-8">
            <InfoIcon className="stroke-main-primary shrink-0" />
            <p className="text-secondary-text md:text-sm text-base lg:text-base">
              If you add mentors to your hackathon, the number of times users
              click on their calendars will display here.
            </p>
          </div>
          <Button size="sm" className="mt-4" variant={"secondary"}>
            Add mentors
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Mentors;
