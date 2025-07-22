import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { useState } from "react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/utils/tailwind-merge";
import { Calendar } from "../ui/calendar";

interface DatePickerProps {
  value?: Date | null;
  onChange: (date: Date | undefined) => void;
  placeholder?: string;
  className?: string;
}

export const DatePicker = ({
  value,
  onChange,
  placeholder,
  className,
}: DatePickerProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          className={cn(
            "justify-between text-left font-normal text-white hover:bg-gray-700 hover:border-gray-500",
            !value && "text-gray-400",
            className
          )}
        >
          <span>{value ? format(value, "MMM dd, yyyy") : placeholder}</span>
          <CalendarIcon className="h-4 w-4 text-main-primary" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-auto p-0 bg-secondary-bg border-tertiary-bg rounded-md"
        align="center"
        side="bottom"
      >
        <Calendar
          mode="single"
          selected={value as Date}
          onSelect={(date) => {
            onChange(date);
            setIsOpen(false);
          }}
          className={cn("p-3 pointer-events-auto bg-secondary-bg font-roboto")}
          classNames={{
            months:
              "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
            month: "space-y-4",
            caption: "flex justify-center pt-1 relative items-center",
            caption_label: "text-sm font-medium text-white",
            nav: "space-x-1 flex items-center",
            nav_button: cn(
              "h-7 w-7 bg-transparent p-0 text-white hover:bg-gray-700 rounded border border-gray-600"
            ),
            nav_button_previous: "absolute left-1",
            nav_button_next: "absolute right-1",
            table: "w-full border-collapse space-y-1",
            head_row: "flex",
            head_cell:
              "text-gray-400 rounded-md w-9 font-normal text-[0.8rem] text-center",
            row: "flex w-full mt-2",
            cell: "h-9 w-9 text-center text-sm p-0 relative focus-within:relative focus-within:z-20",
            day: cn(
              "h-9 w-9 p-0 font-normal text-white hover:bg-gray-700 rounded transition-colors",
              "focus:bg-gray-700 focus:text-white"
            ),
            day_selected:
              "bg-main-primary text-white hover:bg-blue-700 focus:bg-blue-700",
            day_today:
              "relative after:absolute after:bottom-1 after:left-1/2 after:transform after:-translate-x-1/2 after:w-4 after:h-0.5 after:bg-[#4E52F5] after:rounded",
            day_outside: "text-secondary-text opacity-50",
            day_disabled: "text-gray-600 opacity-50",
            day_range_middle:
              "aria-selected:bg-gray-700 aria-selected:text-white",
            day_hidden: "invisible",
          }}
        />
      </PopoverContent>
    </Popover>
  );
};
