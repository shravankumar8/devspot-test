import { Calendar } from "lucide-react";

interface DateTabsProps {
  dates: { date: string; label: string }[];
  selectedDate: string;
  onDateSelect: (date: string) => void;
}

export const DateTabs = ({
  dates,
  selectedDate,
  onDateSelect,
}: DateTabsProps) => {
  const formatTabDate = (dateString: string, label: string) => {
    const date = new Date(dateString + "T00:00:00");
    const month = date.toLocaleDateString("en-US", { month: "long" });
    const day = date.getDate();
    return `${month} ${day}`;
  };

  return (
    <div className="  w-full overflow-x-auto">
      <div className="w-full overflow-x-auto">
        <div className="flex items-center p-4 gap-3 font-roboto">
          <Calendar className="w-5 h-5 text-main-primary mr-2 flex-shrink-0" />
          {dates.map((dateObj) => (
            <button
              type="button"
              key={dateObj.date}
              onClick={() => onDateSelect(dateObj.date)}
              className={
                selectedDate === dateObj.date
                  ? "bg-primary text-white whitespace-nowrap border-b border-b-main-primary"
                  : "text-[#B8B8BA] hover:text-schedule-text hover:bg-schedule-timeline whitespace-nowrap"
              }
            >
              {formatTabDate(dateObj.date, dateObj.label)}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
