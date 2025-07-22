import { ScrollArea } from "@/components/ui/scroll-area";
import { useRef, useState } from "react";
import { ScheduleEvent } from "./CustomCalendarEditor";

interface TimelineViewProps {
  events: ScheduleEvent[];
  onEventClick: (event: ScheduleEvent) => void;
  onEventDrag: (eventId: string, newStartTime: string) => void;
  selectedDate: string;
}

export const TimelineView = ({
  events,
  onEventClick,
  onEventDrag,
  selectedDate,
}: TimelineViewProps) => {
  const [draggedEvent, setDraggedEvent] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const hours = Array.from({ length: 24 }, (_, i) => i);

  const getEventPosition = (startTime: string, endTime: string) => {
    const [startHour, startMinute] = startTime.split(":").map(Number);
    const [endHour, endMinute] = endTime.split(":").map(Number);

    const startPosition = (startHour * 60 + startMinute) * (80 / 60); // 80px per hour
    const duration = endHour * 60 + endMinute - (startHour * 60 + startMinute);
    const height = Math.max(duration * (80 / 60), 20); // Minimum 20px height

    return { top: startPosition, height };
  };

  const handleMouseDown = (e: React.MouseEvent, eventId: string) => {
    setDraggedEvent(eventId);

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const y = e.clientY - rect.top;
      const hourHeight = 80; // Height per hour in pixels

      // Calculate new time based on mouse position
      const totalMinutes = Math.round((y / hourHeight) * 60);
      const hours = Math.floor(totalMinutes / 60);
      const minutes = totalMinutes % 60;

      // Constrain within 24 hours
      const constrainedHours = Math.max(0, Math.min(23, hours));
      const constrainedMinutes = Math.max(0, Math.min(59, minutes));

      const newStartTime = `${constrainedHours
        .toString()
        .padStart(2, "0")}:${constrainedMinutes.toString().padStart(2, "0")}`;
      onEventDrag(eventId, newStartTime);
    };

    const handleMouseUp = () => {
      setDraggedEvent(null);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const formatTime = (hour: number) => {
    if (hour === 0) return "12 AM";
    if (hour === 12) return "12 PM";
    if (hour < 12) return `${hour} AM`;
    return `${hour - 12} PM`;
  };

  return (
    <div className="flex h-[430px] overflow-y-auto bg-primary-bg rounded-lg">
      {/* Time labels */}
      <div className="w-16 border-r border-schedule-border h-full">
        <div className="h-full">
          <div className="py-4">
            {hours.map((hour) => (
              <div
                key={hour}
                className="h-20 flex items-start justify-center text-xs text-schedule-text-muted pt-1"
              >
                {formatTime(hour)}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Timeline grid */}
      <div className="flex-1 relative h-auto">
        <ScrollArea className="h-full">
          <div
            ref={containerRef}
            className="relative"
            style={{ height: `${24 * 80}px` }}
          >
            {/* Hour lines */}
            {hours.map((hour) => (
              <div
                key={hour}
                className="absolute left-0 right-0 border-b border-schedule-border"
                style={{ top: `${hour * 80}px` }}
              />
            ))}

            {/* Events */}
            {events.map((event) => {
              const { top, height } = getEventPosition(
                event.startTime,
                event.endTime
              );
              return (
                <div
                  key={event.id}
                  className={`absolute left-2 right-2 rounded-md py-1 px-2 cursor-pointer transition-all duration-200 border border-white/20 bg-main-primary ${
                    draggedEvent === event.id
                      ? "z-50 shadow-lg"
                      : "hover:shadow-md"
                  }`}
                  style={{ top: `${top}px`, height: `${height}px` }}
                  onMouseDown={(e) => handleMouseDown(e, event.id)}
                  onClick={() => onEventClick(event)}
                >
                  <div className="text-white text-sm font-medium truncate">
                    {event.title}
                  </div>
                  <div className="text-white/80 text-xs mt-1">
                    {event.startTime} – {event.endTime}
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};
