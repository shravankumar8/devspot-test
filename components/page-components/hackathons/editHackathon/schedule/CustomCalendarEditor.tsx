import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import { DateTabs } from "./DateTabs";
import { EventEditor } from "./EventEditor";
import { DatePicker } from "@/components/common/DatePicker";
import { addDays, format, parseISO } from "date-fns";
import { TimelineView } from "./TimeLineView";
import { useFormik } from "formik";
import * as Yup from "yup";

// Validation schema for events
const EventSchema = Yup.object().shape({
  id: Yup.string().required(),
  title: Yup.string().required("Title is required"),
  startTime: Yup.string().required("Start time is required"),
  endTime: Yup.string().required("End time is required"),
  date: Yup.string().required("Date is required"),
  type: Yup.string().required("Type is required"),
  locationName: Yup.string(),
  locationAddress: Yup.string(),
  linkName: Yup.string(),
  linkAddress: Yup.string(),
  description: Yup.string(),
  includeRSVP: Yup.boolean(),
});

// Validation schema for the entire schedule
const ScheduleSchema = Yup.object().shape({
  events: Yup.array().of(EventSchema).required(),
});

export interface ScheduleEvent {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  date: string;
  type:
    | "milestone"
    | "webinar"
    | "speaker"
    | "workshop"
    | "virtual"
    | "in-person"
    | "networking";
  locationName?: string;
  locationAddress?: string;
  linkName?: string;
  linkAddress?: string;
  description?: string;
  includeRSVP: boolean;
}

interface CustomCalendarEditorProps {
  hackathonId?: string;
  onSave?: (data: any) => void;
  initialValues?: {
    events: ScheduleEvent[];
  };
}

export const CustomCalendarEditor = ({
  hackathonId,
  onSave,
  initialValues,
}: CustomCalendarEditorProps) => {
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  });

  const [selectedEvent, setSelectedEvent] = useState<ScheduleEvent | null>(
    null
  );

  // Default initial values
  const defaultInitialValues = {
    events: [
      {
        id: "1",
        title: "Registrations Open",
        startTime: "00:00",
        endTime: "00:30",
        date: selectedDate,
        type: "milestone",
        includeRSVP: false,
        description: "",
      },
      {
        id: "2",
        title: "The Future of Web3",
        startTime: "02:00",
        endTime: "02:30",
        date: selectedDate,
        type: "webinar",
        includeRSVP: true,
        description:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      },
      {
        id: "3",
        title: "University Summit Kickoff - BAF x Protocol jusry",
        startTime: "07:00",
        endTime: "08:00",
        date: selectedDate,
        type: "workshop",
        includeRSVP: false,
        description: "",
      },
    ] as ScheduleEvent[],
  };

  const formik = useFormik({
    initialValues: initialValues || defaultInitialValues,
    validationSchema: ScheduleSchema,
    onSubmit: (values) => {
      onSave?.({ type: "manual", events: values.events });
    },
  });

  const getEventDuration = (start: string, end: string) => {
    const [startHour, startMinute] = start.split(":").map(Number);
    const [endHour, endMinute] = end.split(":").map(Number);
    return endHour * 60 + endMinute - (startHour * 60 + startMinute);
  };

  const handleEventDrag = (eventId: string, newStartTime: string) => {
    const event = formik.values.events.find(
      (e: ScheduleEvent) => e.id === eventId
    );
    if (!event) return;

    const startHour = parseInt(newStartTime.split(":")[0]);
    const startMinute = parseInt(newStartTime.split(":")[1]);
    const eventDuration = getEventDuration(event.startTime, event.endTime);

    const endHour = startHour + Math.floor((startMinute + eventDuration) / 60);
    const endMinute = (startMinute + eventDuration) % 60;

    const updatedEvent = {
      ...event,
      startTime: newStartTime,
      endTime: `${endHour.toString().padStart(2, "0")}:${endMinute
        .toString()
        .padStart(2, "0")}`,
    };

    formik.setValues({
      events: formik.values.events.map((e: ScheduleEvent) =>
        e.id === updatedEvent.id ? updatedEvent : e
      ),
    });
  };

  const addNewDay = () => {
    const eventDates = Array.from(
      new Set(formik.values.events.map((event) => event.date))
    )
      .map((date) => parseISO(date))
      .sort((a, b) => a.getTime() - b.getTime());

    const latestDate =
      eventDates.length > 0
        ? eventDates[eventDates.length - 1]
        : parseISO(selectedDate);

    let newDate = addDays(latestDate, 2);
    let newDateString = newDate.toISOString().split("T")[0];

    const newEvent: ScheduleEvent = {
      id: Date.now().toString(),
      title: "New Day Event",
      startTime: "12:00",
      endTime: "13:00",
      date: newDateString,
      type: "milestone",
      includeRSVP: false,
      description: "",
    };

    formik.setValues({
      events: [...formik.values.events, newEvent],
    });
    setSelectedDate(newDateString);
  };

  const getUniqueDates = (events: ScheduleEvent[]) => {
    const uniqueDates = Array.from(new Set(events.map((event) => event.date)));
    return uniqueDates
      .map((date) => {
        const dateObj = parseISO(date);
        return {
          date,
          label: format(dateObj, "EEEE, MMMM d"),
        };
      })
      .sort((a, b) => a.date.localeCompare(b.date));
  };

  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      const newDate = date.toISOString().split("T")[0];
      setSelectedDate(newDate);

      if (!formik.values.events.some((event) => event.date === newDate)) {
        const newEvent: ScheduleEvent = {
          id: Date.now().toString(),
          title: "New Event",
          startTime: "12:00",
          endTime: "13:00",
          date: newDate,
          type: "webinar",
          includeRSVP: false,
          description: "",
        };
        formik.setValues({
          events: [...formik.values.events, newEvent],
        });
        setSelectedEvent(newEvent);
      }
    }
  };

  const currentDateEvents = formik.values.events.filter(
    (event) => event.date === selectedDate
  );

  return (
    <form onSubmit={formik.handleSubmit} className="h-full">
      {/* Left Panel - Calendar Timeline */}
      <div className="flex gap-2 h-full">
        <div className="basis-[50%] overflow-hidden">
          <DateTabs
            dates={getUniqueDates(formik.values.events)}
            selectedDate={selectedDate}
            onDateSelect={setSelectedDate}
          />
          <DatePicker
            value={parseISO(selectedDate)}
            onChange={handleDateChange}
            placeholder="Select date"
            className="w-full rounded-md h-10 text-sm"
          />
          <div className="flex-1 overflow-hidden mt-2">
            <TimelineView
              events={currentDateEvents}
              onEventClick={setSelectedEvent}
              onEventDrag={handleEventDrag}
              selectedDate={selectedDate}
            />
          </div>
        </div>

        {/* Right Panel - Event Editor */}
        <div className="flex flex-col basis-[50%] flex-shrink-0 overflow-hidden">
          {selectedEvent ? (
            <EventEditor
              event={selectedEvent}
              onUpdate={(updatedEvent) => {
                formik.setValues({
                  events: formik.values.events.map((e) =>
                    e.id === updatedEvent.id ? updatedEvent : e
                  ),
                });
                setSelectedEvent(null);
              }}
              onDelete={(eventId) => {
                formik.setValues({
                  events: formik.values.events.filter((e) => e.id !== eventId),
                });
                setSelectedEvent(null);
              }}
              onClose={() => setSelectedEvent(null)}
            />
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <Button
                size="md"
                onClick={() => {
                  const newEvent: ScheduleEvent = {
                    id: Date.now().toString(),
                    title: "New Event",
                    startTime: "12:00",
                    endTime: "13:00",
                    date: selectedDate,
                    type: "webinar",
                    includeRSVP: false,
                    description: "",
                  };
                  formik.setValues({
                    events: [...formik.values.events, newEvent],
                  });
                  setSelectedEvent(newEvent);
                }}
                className="bg-primary hover:bg-primary/90"
                type="button"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add New Event
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="mt-6">
        <div className="flex gap-3 w-full justify-between">
          <Button
            size="md"
            onClick={addNewDay}
            variant="secondary"
            className="border-schedule-border bg-schedule-timeline text-schedule-text hover:bg-schedule-sidebar"
            type="button"
          >
            <Plus className="w-4 h-4 mr-2" />
            New day
          </Button>

          <Button
            size="md"
            type="submit"
            className="bg-primary hover:bg-primary/90 ml-auto"
          >
            Save
          </Button>
        </div>
      </div>
    </form>
  );
};
