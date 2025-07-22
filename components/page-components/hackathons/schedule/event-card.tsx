"use client";

import { Checkbox } from "@/components/common/Checkbox";
import { LocationSvg, WebsiteLink } from "@/components/icons/Location";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/state";
import { HackathonSessions } from "@/types/entities";
import { cn } from "@/utils/tailwind-merge";
import axios, { AxiosError } from "axios";
import moment from "moment-timezone";
import { useState } from "react";
import { toast } from "sonner";
import { useSWRConfig } from "swr";
import { downloadICS, generateICS } from "./ics";

interface EventCardProps {
  event: HackathonSessions;
  isUpNext: boolean;
}

interface Location {
  link: string;
  name: string;
}

export function EventCard({ event, isUpNext }: Readonly<EventCardProps>) {
  // const startTime = new Date(event?.start_time!);
  // const endTime = new Date(event?.end_time);
  const { user } = useAuthStore();
  const { mutate } = useSWRConfig();

  const userTZ = moment.tz.guess();

  // 2) Parse & convert to that zone, then format

  const formatTimeDisplay = (date: Date | string | null) => {
    // const old = format(date, "h:mm a").replace(":00", "");
    const pretty = moment.tz(date, userTZ).format("h:mm A z");

    return pretty;
  };

  const isMilestone = event.tags.includes("Milestone") || event.is_milestone;

  const [isRsvp, setIsRsvp] = useState(event?.rsvpd);

  const handleRSVP = async () => {
    if (!user) {
      return toast.error("You need to be Logged in to RSVP for a session");
    }

    const previous = isRsvp;
    const next = !previous;
    setIsRsvp(next);

    try {
      await axios.post(
        `/api/hackathons/${event.hackathon_id}/schedule/${event.id}/rsvp`,
        { status: next }
      );

      if (next) {
        const startTime = new Date(event?.start_time!);
        const endTime = event?.end_time ? new Date(event?.end_time) : undefined;

        // 1. Build .ics text
        const ics = generateICS({
          title: event.title,
          description: event.description ?? "",
          location: event.event_link || event.location?.[0]?.name || "",
          start: startTime,
          end: endTime,
          organizer: { name: "DevSpot", email: "no-reply@devspot.com" },
        });

        // 2. Trigger download
        const safeName = event.title.replace(/\s+/g, "_").toLowerCase();
        downloadICS(ics, `${safeName}.ics`);
      }
    } catch (err) {
      // revert back
      setIsRsvp(previous);

      if (err instanceof AxiosError) {
        toast.error(
          `Could not RSVP for session: ${
            err.response?.data?.error ?? err.message
          }`
        );
      } else {
        toast.error("Could not RSVP for session");
      }
    }
  };

  return (
    <div
      className={cn(
        "flex lg:flex-row flex-col p-4 rounded-xl transition-all duration-200 ease-in-out hover:bg-secondary-bg "
      )}
    >
      <div className="basis-[32%] flex items-start font-inter flex-col gap-3">
        <div className="text-lg">
          {formatTimeDisplay(event?.start_time)}

          {event?.end_time && <> - {formatTimeDisplay(event?.end_time)}</>}
        </div>
        <div>
          {isUpNext && (
            <div className="w-fit py-1 text-[12px] px-2 text-[#EFC210] bg-[#6E5B1B] font-medium rounded-[16px] mb-3">
              UP NEXT
            </div>
          )}
          {!isMilestone && (
            <button
              onClick={handleRSVP}
              className={cn(
                "rounded-[16px] px-3 flex gap-2 items-center font-roboto dark:bg-gradient-to-l dark:from-[#9667FA] dark:to-[#4075FF]  dark:text-white py-1"
              )}
            >
              <Checkbox checked={isRsvp} variant="light" />

              <span className="text-[#E7E7E8] font-[500] font-roboto">
                RSVP
              </span>
            </button>
          )}
        </div>
      </div>

      <div className="lg:border-l-[2px] border-l-tertiary-bg px-4 basis-[68%]">
        <div className="flex flex-col space-y-4">
          <div className="flex items-start justify-between font-roboto">
            <div>
              <h3 className="text-lg font-bold text-white">{event.title}</h3>

              {event.description && (
                <p className="text-sm text-secondary-text mt-2">
                  {event.description}
                </p>
              )}

              <div className="flex flex-wrap gap-2 mt-3 font-roboto">
                {event.tags?.map((tag, i) => (
                  <span
                    key={i}
                    className={cn(
                      "px-3 py-[6px] text-xs rounded-[16px] font-[500] capitalize",
                      isMilestone
                        ? "bg-white text-tertiary-text"
                        : "text-[#E7E7E8] bg-[#2B2B31]"
                    )}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {!isMilestone && event.location && (
            <Button className="!bg-[#3400A8] !rounded-[16px]" size="sm">
              <a
                target="_blank"
                rel="noreferrer"
                href={event.location?.[0]?.link ?? ""}
                className="text-[#C3A8FF] flex items-center gap-2"
              >
                <LocationSvg color="#C3A8FF" />
                <p className="text-[#C3A8FF] text-sm underline">
                  {event.location?.[0]?.name}
                </p>{" "}
              </a>
            </Button>
          )}

          {!isMilestone && event.event_link && (
            <Button className="!bg-[#000375] !rounded-[16px]" size="sm">
              <a
                target="_blank"
                rel="noreferrer"
                href={event.event_link ?? ""}
                className="text-[#ADAFFA] flex items-center gap-2 underline"
              >
                <WebsiteLink color="#ADAFFA" />
                Register for Event
              </a>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
