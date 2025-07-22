import { ParticipantsAnalyticsPropsBase } from "@/app/[locale]/(TODashboard)/TO/hackathons/[id]/analytics/participants/page";
import { formatDate } from "@/utils/date";
import axios from "axios";
import useSWR from "swr";
import FadeTransitionLoader from "./FadeTransitionLoader";

interface EventItem {
  title: string;
  datetime: string;
  rsvps: number;
}

const fetcher = (url: string) =>
  axios.get<{ data: EventItem[] }>(url).then((res) => res.data?.data);

interface EventsSectionProps extends ParticipantsAnalyticsPropsBase {}

const EventsSkeleton = () => {
  return (
    <div className="mt-4">
      <ul className="flex flex-col gap-3">
        {Array.from({ length: 4 }).map((_, index) => (
          <li
            key={index}
            className="flex justify-between items-center animate-pulse"
          >
            <div className="flex-1">
              <div className="h-4 bg-gray-600 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-700 rounded w-1/2"></div>
            </div>
            <div className="h-4 bg-gray-600 rounded w-8 ml-4"></div>
          </li>
        ))}
      </ul>
    </div>
  );
};
const Events = (props: EventsSectionProps) => {
  const { hackathonId, technologyOwnerId } = props;

  const { data: sessions = [], isLoading } = useSWR<EventItem[]>(
    `/api/technology-owners/${technologyOwnerId}/hackathons/${hackathonId}/analytics/participants/session-rsvp`,
    fetcher
  );

  return (
    <div className="p-6 bg-secondary-bg rounded-2xl h-[360px] overflow-y-scroll border border-black-terciary">
      <header className="flex justify-between items-center">
        <p className="text-secondary-text">Event</p>
        <p className="text-secondary-text">RSVPs</p>
      </header>

      <FadeTransitionLoader isLoading={isLoading} loader={<EventsSkeleton />}>
        <div className="mt-4">
          <ul className="flex flex-col gap-3">
            {sessions?.map((item, index) => (
              <li
                key={index}
                className="flex justify-between items-center font-roboto tracking-wide"
              >
                <div>
                  <span className="text-xs text-white font-medium">
                    {item.title}
                  </span>
                  {formatDate(item?.datetime) && (
                    <p className="text-secondary-text text-xs uppercase font-medium">
                      {formatDate(item?.datetime)}
                    </p>
                  )}
                </div>
                <span className="text-xs text-white font-medium">
                  {item.rsvps}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </FadeTransitionLoader>
    </div>
  );
};

export default Events;
