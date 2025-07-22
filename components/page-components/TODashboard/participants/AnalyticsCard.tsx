import { ParticipantsAnalyticsPropsBase } from "@/app/[locale]/(TODashboard)/TO/hackathons/[id]/analytics/participants/page";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import axios from "axios";
import useSWR from "swr";
import FadeTransitionLoader from "./FadeTransitionLoader";

interface AnalyticsOverview {
  registrations: number;
  pageViews: number;
  profileViews: number;
  followersGained: number;
  projectSubmissions: number;
}

const fetcher = (url: string) =>
  axios.get<{ data: AnalyticsOverview }>(url).then((res) => res.data?.data);

const analyticsLabels: { key: keyof AnalyticsOverview; label: string }[] = [
  { key: "registrations", label: "Sign Ups" },
  { key: "pageViews", label: "Page Views" },
  { key: "profileViews", label: "Profile Views" },
  { key: "followersGained", label: "Followers Gained" },
  { key: "projectSubmissions", label: "Project Submissions" },
];

const AnalyticsItem = ({
  isLoading,
  value,
  label,
}: {
  isLoading: boolean;
  value?: number;
  label: string;
}) => (
  <li className="flex items-center gap-3">
    <FadeTransitionLoader
      isLoading={isLoading}
      loader={<Skeleton className="w-full h-full rounded-full bg-[#000375]" />}
      className="w-16 h-6"
    >
      <Badge
        variant="custom"
        className="w-full h-full bg-[#000375] text-[#ADAFFA] justify-center font-roboto flex !text-sm  items-center"
      >
        {value}
      </Badge>
    </FadeTransitionLoader>

    <p className="text-white font-medium text-sm font-roboto">{label}</p>
  </li>
);

interface AnalyticsCardProps extends ParticipantsAnalyticsPropsBase {}

const AnalyticsCard = ({
  hackathonId,
  technologyOwnerId,
}: AnalyticsCardProps) => {
  const { data, isLoading } = useSWR<AnalyticsOverview>(
    `/api/technology-owners/${technologyOwnerId}/hackathons/${hackathonId}/analytics/participants/overview`,
    fetcher
  );

  return (
    <div className="p-6 bg-gradient-to-r from-[#4075FF] to-[#9667FA] rounded-2xl flex flex-col h-[360px] border border-transparent">
      <header className="flex flex-col gap-2">
        <h3 className="text-white font-bold !font-roboto text-xl">
          Analytics: At a glance
        </h3>
        <h3 className="text-white font-semibold !font-roboto">
          28.5% Conversion Rate
        </h3>
      </header>

      <div className="mt-auto font-roboto">
        <ul className="flex flex-col gap-3">
          {analyticsLabels.map(({ key, label }) => (
            <AnalyticsItem
              key={key}
              isLoading={isLoading}
              value={data?.[key]}
              label={label}
            />
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AnalyticsCard;
