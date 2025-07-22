import React from "react";

interface ScheduleItemProps {
  time: string;
  event: string;
}

const ScheduleItem = ({ time, event }: ScheduleItemProps) => {
  return (
    <div className="flex border-2 border-white rounded-[12px] p-4 overflow-hidden mb-2 font-roboto">
      <div className="flex items-center basis-[40%]  sm:basis-[20%] text-lg sm:text-xl font-medium border-r-2 border-r-white">
        <span className="text-white text-sm">{time}</span>
      </div>
      <div className="flex-1 flex items-center basis-[60%] sm:basis-[80%] text-base sm:text-lg font-medium pl-4">
        <span className="text-white text-sm">{event}</span>
      </div>
    </div>
  );
};

export default ScheduleItem;
