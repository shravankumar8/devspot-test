import { format } from "date-fns";

interface DayHeaderProps {
  dayNumber: number;
  date: Date;
  isToday: boolean;
}

export function DayHeader({
  dayNumber,
  date,
  isToday,
}: Readonly<DayHeaderProps>) {
  const isPastEvent = (date: Date) => {
    if (date) {
      const endTime = new Date(date);
      return endTime < new Date();
    }
  };

  return (
    <div className="basis-[30%] relative">
      {isPastEvent(date) && (
        <div className="absolute inset-0 bg-primary-bg bg-opacity-60 rounded-lg flex items-center justify-center"></div>
      )}
      <div className="text-secondary-text font-roboto text-[14px]">
        DAY {dayNumber}
      </div>

      <div className="flex items-center space-x-2 mt-3">
        <h2 className="text-2xl font-bold">{format(date, "EEEE, MMMM d")}</h2>
      </div>
    </div>
  );
}
