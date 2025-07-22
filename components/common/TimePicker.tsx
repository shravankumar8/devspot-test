import { cn } from "@/utils/tailwind-merge";
import { Clock } from "lucide-react";
import { useMemo } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

export interface DateTimePickerProps {
  time: string | null;
  setTime: (time: string) => void;
  label?: string;
  className?: string;
}

export function DateTimePicker({
  time,
  setTime,
  className,
  label = "Start time",
}: Readonly<DateTimePickerProps>) {
  const timeOptions = useMemo(() => {
    const options = [];
    for (let hour = 0; hour < 24; hour++) {
      for (const minute of [0, 30]) {
        const formattedHour = hour.toString().padStart(2, "0");
        const formattedMinute = minute.toString().padStart(2, "0");
        options.push(`${formattedHour}:${formattedMinute}`);
      }
    }
    return options;
  }, []);

  return (
    <div className={cn(className, "")}>
      <Select value={time ?? undefined} onValueChange={setTime}>
        <SelectTrigger className="w-full p-3 h-11 bg-tertiary-bg border-none">
          <SelectValue placeholder="Select time">
            <div className="flex items-center text-secondary-text">
              <Clock className="mr-2 h-4 w-4" />
              {time || "Select time"}
            </div>
          </SelectValue>
        </SelectTrigger>
        <SelectContent className="bg-tertiary-bg border-tertiary-text font-roboto">
          {timeOptions.map((time) => (
            <SelectItem key={time} value={time} className="border-b border-b-tertiary-text rounded-none">
              {time}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
