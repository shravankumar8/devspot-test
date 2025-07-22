import React, { useState, useEffect, useMemo } from "react";
import { DayPicker, DateRange } from "react-day-picker";
import { format, isToday, isSameDay, parseISO, isValid } from "date-fns";
import "react-day-picker/style.css";
import { EventType } from "@/types/hackathons";
import { cn } from "@/utils/tailwind-merge";
import { HackathonSessions } from "@/types/entities";

type CustomCalendarProps = {
  className?: string;
  mode?: "default" | "range";
  selectedDate?: Date;
  selectedRange?: DateRange;
  onSelect?: (date: Date | undefined) => void;
  onRangeSelect?: (range: DateRange | undefined) => void;
  events?: HackathonSessions[];
};

export function CustomCalendar({
  className,
  mode = "default",
  selectedDate,
  selectedRange,
  onSelect,
  onRangeSelect,
  events = [],
}: Readonly<CustomCalendarProps>) {
  const [date, setDate] = useState<Date | undefined>(selectedDate);
  const [range, setRange] = useState<DateRange | undefined>(selectedRange);
  const [rangeText, setRangeText] = useState<string>("");

  // Convert event startTime strings to Date objects
  const eventDates = useMemo(() => {
    return events
      .map((event) => {
        const date = parseISO(event.start_time!);
        return isValid(date) ? date : null;
      })
      .filter((date): date is Date => date !== null);
  }, [events]);

  // Handle date selection based on mode
  const handleSelect = (selected: Date | undefined) => {
    setDate(selected);
    if (onSelect) onSelect(selected);
  };

  // Handle range selection
  const handleRangeSelect = (selectedRange: DateRange | undefined) => {
    setRange(selectedRange);
    if (onRangeSelect) onRangeSelect(selectedRange);
  };

  // Format range for display
  useEffect(() => {
    if (range?.from && range?.to) {
      if (isSameDay(range.from, range.to)) {
        setRangeText(format(range.from, "EEEE, MMMM d"));
      } else {
        setRangeText(
          `${format(range.from, "EEEE, MMMM d")} — ${format(
            range.to,
            "EEEE, MMMM d"
          )}`
        );
      }
    } else if (range?.from) {
      setRangeText(format(range.from, "EEEE, MMMM d"));
    } else {
      setRangeText("");
    }
  }, [range]);


  // Custom modifiers for styling
  const modifiers = useMemo(
    () => ({
      eventDay: (day: Date) =>
        eventDates.some((eventDate) => isSameDay(eventDate, day)),
      today: (date: Date) => isToday(date),
      eventToday: (day: Date) =>
        eventDates.some((eventDate) => isSameDay(eventDate, day)) &&
        isToday(day),
    }),
    [eventDates]
  );


  const modifiersClassNames = {
    eventDay: "calendar-event-day",
    today: "calendar-today",
    eventToday: "calendar-event-today",
  };

  // Custom day component to add dot indicator for event days
  const DayContent = (props: { date: Date; displayMonth: Date }) => {
    const { date } = props;
    const isEvent = eventDates.some((eventDate) => isSameDay(eventDate, date));
    console.log(isEvent, modifiers.eventDay);

    return (
      <div className="relative">
        <span>{date.getDate()}</span>
        {isEvent && (
          <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 -translate-y-1 w-1.5 h-1.5 bg-calendar-dot rounded-full" />
        )}
      </div>
    );
  };
  return (
    <div className="space-y-4 w-full h-full">
      {mode === "range" && rangeText && (
        <div className="selected-range-display animate-fade-in">
          {rangeText}
        </div>
      )}
      <DayPicker
        className={cn(
          "custom-calendar p-3 pointer-events-auto animate-scale-in w-full",
          className
        )}
        mode={mode === "range" ? "range" : "single"}
        // selected={mode === "range" ? range : date}
        // onSelect={mode === "range" ? handleRangeSelect : handleSelect}
        showOutsideDays
        components={{
          // @ts-ignore
          DayContent,
        }}
        modifiers={modifiers}
        modifiersClassNames={modifiersClassNames}
      />
    </div>
  );
}
