import { WebsiteLink } from "@/components/icons/Location";
import { HackathonSessions } from "@/types/entities";
import { formatDate } from "@/utils/date";
import axios from "axios";
import { format, isSameDay, parseISO } from "date-fns";
import { useMemo } from "react";
import useSWR from "swr";
import { EditHackathonSchedule } from "../editHackathon/schedule/index";
import { DayHeader } from "./day-header";
import { EventCard } from "./event-card";
import { HackathonScheduleSkeleton } from "./skeleton-loader";

type GroupedSessions = Record<string, HackathonSessions[]>;

export const HackathonSchedule = ({
  hackathonId,
  isOwner,
}: {
  hackathonId: string;
  isOwner: boolean;
}) => {
  const fetchHackathonInformation = async (url: string) => {
    try {
      const response = await axios.get(url);
      return response.data?.data;
    } catch (error) {
      console.log(error);
    }
  };

  const { data: sessions, isLoading } = useSWR<HackathonSessions[]>(
    `/api/hackathons/${hackathonId}/schedule`,
    fetchHackathonInformation
  );

  const upcomingSession = useMemo(() => {
    if (sessions) {
      return sessions?.find((item) => item?.upcoming);
    }
  }, [sessions]);

  if (isLoading) {
    return <HackathonScheduleSkeleton />;
  }

  if (!sessions) {
    return null;
  }
  const isMilestone = upcomingSession?.tags.includes("Milestone");
  const now = new Date();

  const currentEvent = sessions?.find((event) => {
    const { start_time, end_time } = event;
    if (!start_time || !end_time) {
      return false;
    }
    const start = new Date(start_time);
    const end = new Date(end_time);
    return start <= now && now <= end;
  });

  const HappeningNowEvent = currentEvent || null;

  function groupEventsByDay(events: HackathonSessions[]) {
    const grouped: GroupedSessions = {};
    const filteredEvents = events.filter((event) => event.start_time);

    filteredEvents.forEach((event) => {
      const startTime = event?.start_time;
      const dateKey = format(parseISO(startTime), "yyyy-MM-dd");

      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }

      grouped[dateKey].push(event);
    });

    return grouped;
  }

  const isPastEvent = (event: HackathonSessions) => {
    if (event.end_time) {
      const endTime = new Date(event.end_time);
      return endTime < new Date();
    } else {
      const startTime = new Date(event.start_time);
      return startTime < new Date();
    }
  };
  const eventsByDay = groupEventsByDay(sessions);

  const days = Object.keys(eventsByDay).sort();

  return (
    <div className="">
      <div className="mb-4 md:flex-row flex-col flex gap-4 w-full overflow-x-scroll">
        {/* <CustomCalendar
          mode="default"
          selectedDate={selectedDate}
          onSelect={setSelectedDate}
          events={sessions}
        /> */}
        <div className="w-full h-[90px] flex gap-3  min-w-[900px]">
          <div className="flex w-full h-full gap-3">
            {HappeningNowEvent && (
              <div className="bg-secondary-bg p-4 rounded-[12px] h-full border border-tertiary-bg">
                <div className="flex gap-2 items-start">
                  <div className="w-fit h-6 text-[12px] px-2 text-[#91C152] bg-[#263513] font-medium  rounded-[16px] mb-2 flex justify-center items-center">
                    HAPPENING NOW
                  </div>
                  <p className="text-xs uppercase  font-roboto text-secondary-text">
                    {formatDate(HappeningNowEvent?.start_time)}
                  </p>
                </div>
                <div className="flex gap-2">
                  <p className="font-semibold text-[18px] mb-3 truncate">
                    {HappeningNowEvent?.title}
                  </p>
                  {!isMilestone && (
                    <div className="h-7 px-2 flex justify-center items-center bg-[#3400A8] rounded-2xl w-fit">
                      <a
                        href={HappeningNowEvent.virtual_link ?? ""}
                        className="text-[#C3A8FF]"
                      >
                        <WebsiteLink
                          color="#C3A8FF"
                          width="24px"
                          height="24px"
                        />
                      </a>
                    </div>
                  )}
                </div>
              </div>
            )}
            {upcomingSession && (
              <div className="bg-secondary-bg p-4 rounded-[12px] w-full h-full border border-tertiary-bg">
                <div className="flex gap-2 items-center mb-1">
                  <div className="w-fit h-6 text-[12px] px-2 text-[#EFC210] bg-[#6E5B1B] font-medium  rounded-[16px] flex justify-center items-center">
                    UP NEXT
                  </div>

                  <p className="text-xs uppercase  font-roboto text-secondary-text">
                    {formatDate(upcomingSession?.start_time)}
                  </p>
                </div>
                <div className="flex gap-2">
                  <p className="font-semibold text-[18px] mb-3 truncate">
                    {upcomingSession?.title}
                  </p>
                  {!isMilestone && (
                    <div className="h-7 px-2 flex justify-center items-center bg-[#3400A8] rounded-2xl w-fit">
                      <a
                        target="_blank"
                        rel="noreferrer"
                        href={upcomingSession.event_link ?? "#"}
                        className="text-[#C3A8FF]"
                      >
                        <WebsiteLink
                          color="#C3A8FF"
                          width="24px"
                          height="24px"
                        />
                      </a>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          <div className="flex w-full h-full gap-3">
            <div className="p-4 h-full w-full gradient-border flex flex-col justify-center gap-1">
              <p className="text-xs uppercase  font-roboto text-secondary-text">
                Thursday, july 6
              </p>
              <p className="font-meduim text-base font-roboto truncate">
                Submissions Due
              </p>
            </div>
            <div className="p-4 h-full w-full gradient-border flex flex-col justify-center gap-1">
              <p className="text-xs uppercase  font-roboto text-secondary-text">
                Friday, july 16
              </p>
              <p className="font-meduim text-base font-roboto truncate">
                Winners Announced
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-8 px-4 relative">
        {days.map((day, index) => {
          const dayDate = parseISO(day);
          const dayEvents = eventsByDay[day];

          return (
            <div
              key={day}
              className="space-y-4 flex justify-between items-start border-t border-t-[#424248] pt-4 lg:flex-row flex-col"
            >
              <DayHeader
                dayNumber={index + 1}
                date={dayDate}
                isToday={isSameDay(dayDate, new Date())}
              />

              <div className="gap-8 flex flex-col basis-[70%]">
                {dayEvents.map((event, i) => (
                  <div key={i} className="relative">
                    <EventCard event={event} isUpNext={event.upcoming} />
                    {isPastEvent(event) && (
                      <div className="absolute inset-0 bg-primary-bg bg-opacity-60 rounded-lg flex items-center justify-center"></div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
        {isOwner && (
          <EditHackathonSchedule hackathonId={parseInt(hackathonId)} />
        )}
      </div>
    </div>
  );
};
