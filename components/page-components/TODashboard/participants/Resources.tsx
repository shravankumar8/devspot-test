import { ParticipantsAnalyticsPropsBase } from "@/app/[locale]/(TODashboard)/TO/hackathons/[id]/analytics/participants/page";
import axios from "axios";
import useSWR from "swr";
import FadeTransitionLoader from "./FadeTransitionLoader";

interface CountItem {
  label: string;
  count: number;
}
const fetcher = (url: string) =>
  axios.get<{ data: CountItem[] }>(url).then((res) => res.data?.data);

const SectionSkeletonloader = () => {
  return (
    <div className="mt-4">
      <ul className="flex flex-col gap-3">
        {Array.from({ length: 15 }).map((_, index) => (
          <li
            key={index}
            className="flex justify-between items-center animate-pulse"
          >
            <div className="h-4 bg-gray-600 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-600 rounded w-8 ml-4"></div>
          </li>
        ))}
      </ul>
    </div>
  );
};

interface ResourcesectionProps extends ParticipantsAnalyticsPropsBase {}

const Resources = (props: ResourcesectionProps) => {
  const { hackathonId, technologyOwnerId } = props;

  const { data: resources = [], isLoading } = useSWR<CountItem[]>(
    `/api/technology-owners/${technologyOwnerId}/hackathons/${hackathonId}/analytics/participants/resources`,
    fetcher
  );

  return (
    <div className="p-6 bg-secondary-bg rounded-2xl h-[360px] overflow-y-scroll border border-black-terciary">
      <header className="flex justify-between items-center">
        <p className="text-secondary-text">Resources</p>
        <p className="text-secondary-text">Clicks</p>
      </header>
      <FadeTransitionLoader
        isLoading={isLoading}
        loader={<SectionSkeletonloader />}
      >
        <div className="mt-4">
          <ul className="flex flex-col gap-3">
            {resources?.map((item, index) => (
              <li
                className="flex justify-between items-center font-roboto"
                key={index}
              >
                <span className="text-xs truncate max-w-[150px] text-white font-medium tracking-wide">
                  {item.label}
                </span>
                <span className="text-xs text-white font-medium">
                  {item.count}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </FadeTransitionLoader>
    </div>
  );
};

export default Resources;
