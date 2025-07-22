"use client";

import HackathonHeader from "@/components/page-components/TODashboard/hackathon-header";
import AnalyticsCard from "@/components/page-components/TODashboard/participants/AnalyticsCard";
import AttritionBarChart from "@/components/page-components/TODashboard/participants/AttritionBarChart";
import CommonSignupSkillsBarChart from "@/components/page-components/TODashboard/participants/CommonSignupSkillsBarChart";
import Events from "@/components/page-components/TODashboard/participants/Events";
import FAQ from "@/components/page-components/TODashboard/participants/FAQ";
import Mentors from "@/components/page-components/TODashboard/participants/Mentors";
import ParticipantsTableV2 from "@/components/page-components/TODashboard/participants/ParticipantsTableV2";
import Resources from "@/components/page-components/TODashboard/participants/Resources";
import SignupsByLocation from "@/components/page-components/TODashboard/participants/SignupsByLocation";
import SignupSkillsBarChart from "@/components/page-components/TODashboard/participants/SignupSkillsBarChart";
import TrafficByLocation from "@/components/page-components/TODashboard/participants/TrafficByLocation";
import TrafficChart from "@/components/page-components/TODashboard/participants/TrafficChart";
import { useTechOwnerStore } from "@/state/techOwnerStore";
import {
  AnimatedGrid,
  AnimatedGridItem,
  AnimatedWrapper,
} from "./animated-wrapper";

export interface ParticipantsAnalyticsPropsBase {
  hackathonId: number;
  technologyOwnerId: number;
}

export default function ParticipantsPage({
  params,
}: Readonly<{
  params: { id: string };
}>) {
  const { selectedOrg } = useTechOwnerStore();
  const hackathonId = params.id;

  const HACKATHON_ID = parseInt(hackathonId);
  const TECHNOLOGY_OWNER_ID = selectedOrg?.technology_owner_id ?? 0;

  return (
    <div>
      <AnimatedWrapper delay={0}>
        <HackathonHeader />
      </AnimatedWrapper>

      <div className="px-8 py-8">
        <AnimatedWrapper delay={0.2}>
          <h2 className="uppercase text-sm font-roboto font-medium">
            Participants
          </h2>
        </AnimatedWrapper>

        {/* First Analytics Grid */}
        <AnimatedGrid
          className="mt-3 grid grid-cols-12 gap-6 items-stretch"
          staggerDelay={0.1}
        >
          <AnimatedGridItem className="col-span-12 lg:col-span-6 xl:col-span-3">
            <AnalyticsCard
              hackathonId={HACKATHON_ID}
              technologyOwnerId={TECHNOLOGY_OWNER_ID}
            />
          </AnimatedGridItem>

          <AnimatedGridItem className="col-span-12 lg:col-span-6 xl:col-span-6">
            <TrafficChart />
          </AnimatedGridItem>

          <AnimatedGridItem className="col-span-12 lg:col-span-6 xl:col-span-3">
            <TrafficByLocation />
          </AnimatedGridItem>

          <AnimatedGridItem className="col-span-12 lg:col-span-6 xl:col-span-6">
            <SignupSkillsBarChart
              hackathonId={HACKATHON_ID}
              technologyOwnerId={TECHNOLOGY_OWNER_ID}
            />
          </AnimatedGridItem>

          <AnimatedGridItem className="col-span-12 lg:col-span-6 xl:col-span-3">
            <SignupsByLocation />
          </AnimatedGridItem>

          <AnimatedGridItem className="col-span-12 lg:col-span-6 xl:col-span-3">
            <AttritionBarChart
              hackathonId={HACKATHON_ID}
              technologyOwnerId={TECHNOLOGY_OWNER_ID}
            />
          </AnimatedGridItem>
        </AnimatedGrid>

        {/* Participants Table */}
        <AnimatedWrapper delay={0.8} className="mt-6">
          <ParticipantsTableV2
            hackathonId={HACKATHON_ID}
            technologyOwnerId={TECHNOLOGY_OWNER_ID}
          />
        </AnimatedWrapper>

        {/* Second Grid Section */}
        <AnimatedGrid
          className="mt-6 grid grid-cols-12 gap-6"
          staggerDelay={0.15}
        >
          <AnimatedGridItem className="col-span-12 md:col-span-6">
            <CommonSignupSkillsBarChart
              hackathonId={HACKATHON_ID}
              technologyOwnerId={TECHNOLOGY_OWNER_ID}
            />
          </AnimatedGridItem>

          <AnimatedGridItem className="col-span-12 md:col-span-3">
            <FAQ
              hackathonId={HACKATHON_ID}
              technologyOwnerId={TECHNOLOGY_OWNER_ID}
            />
          </AnimatedGridItem>

          <AnimatedGridItem className="col-span-12 md:col-span-3">
            <Resources
              hackathonId={HACKATHON_ID}
              technologyOwnerId={TECHNOLOGY_OWNER_ID}
            />
          </AnimatedGridItem>
        </AnimatedGrid>

        {/* Third Grid Section */}
        <AnimatedGrid
          className="mt-6 grid grid-cols-12 gap-6"
          staggerDelay={0.2}
        >
          <AnimatedGridItem className="col-span-12 md:col-span-6">
            <Events
              hackathonId={HACKATHON_ID}
              technologyOwnerId={TECHNOLOGY_OWNER_ID}
            />
          </AnimatedGridItem>

          <AnimatedGridItem className="col-span-12 md:col-span-6">
            <Mentors />
          </AnimatedGridItem>
        </AnimatedGrid>
      </div>
    </div>
  );
}
