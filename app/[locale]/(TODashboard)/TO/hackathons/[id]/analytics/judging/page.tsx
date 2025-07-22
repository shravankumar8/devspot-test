"use client";

import DevspotLoader from "@/components/common/DevspotLoader";
import { Button } from "@/components/ui/button";
import { useTechOwnerStore } from "@/state/techOwnerStore";
import axios from "axios";
import useSWR from "swr";
import FlaggedProjects from "./components/flagged-projects";
import JudgingActivity from "./components/judge-activity";
import JudgesManager from "./components/judge-manager";
import ProjectManager, { Project } from "./components/project-manager";

interface Challenge {
  id: number;
  name: string;
  is_winner_assigner: boolean;
}

interface ScoreStats {
  mean: number;
  median: number;
  mode: number;
}

export interface JudgeDataType {
  id: string;
  name: string;
  avatar_url: string;
  challenges: Challenge[];
  judging_id: number;
  total_projects: number;
  progress: number;
  score_stats: ScoreStats;
}

export default function JudgingAnalytics({
  params,
}: Readonly<{
  params: { id: string };
}>) {
  const fetchJudgingsData = async (url: string) => {
    const resp = await axios.get(url);
    return resp.data;
  };
  const { selectedOrg } = useTechOwnerStore();
  const hackathonId = params.id;

  const fetchProjectsData = async (url: string) => {
    const resp = await axios.get(url);
    return resp.data.data;
  };

  const { data: judgesData, isLoading: isJudgesDataLoading } = useSWR<
    JudgeDataType[]
  >(
    `/api/technology-owners/${selectedOrg?.technology_owner_id}/hackathons/${hackathonId}/judgings`,
    fetchJudgingsData
  );

  const { data: projectsData, isLoading: isProjectsLoading } = useSWR<
    Project[]
  >(
    `/api/technology-owners/${selectedOrg?.technology_owner_id}/hackathons/${hackathonId}/projects`,
    fetchProjectsData
  );

  return (
    <div>
      {isJudgesDataLoading || isProjectsLoading ? (
        <div className="flex justify-center items-center h-screen w-full">
          <DevspotLoader />
        </div>
      ) : (
        <>
          {" "}
          <div className="sticky mt-0 px-8 py-2 bg-secondary-bg top-0 flex justify-between items-center z-30">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 flex-shrink-0 rounded-md overflow-hidden">
                <img
                  src="https://dbaimdvhgbmmxfjaszcp.supabase.co/storage/v1/object/public/hackathon-images/logos/PLLogoBrightGreen.svg"
                  alt=""
                  className="w-full h-full"
                />
              </div>
              <p className="text-xl font-roboto">
                PL_Genesis: Modular Worlds Hackathon
              </p>
              <div>
                <span className="flex items-center bg-[#263513] px-3 py-1 rounded-full h-[26px] font-[500] font-roboto text-[#91C152] text-[12px]">
                  Registration live
                </span>
              </div>
            </div>
            <div>
              <Button size="sm">Share</Button>
            </div>
          </div>
          <div className="px-8 py-6">
            <h2 className="uppercase text-sm font-roboto font-medium">
              judging
            </h2>

            <div className="mt-3">
              <JudgingActivity hackathonId={hackathonId} />
            </div>
            {judgesData && projectsData && (
              <div className="mt-6">
                <JudgesManager
                  hackathonId={hackathonId}
                  showTitle
                  judgesData={judgesData}
                  projectsData={projectsData}
                />
              </div>
            )}
            {projectsData && judgesData && (
              <div className="mt-6">
                <ProjectManager
                  showHeader
                  hackathonId={hackathonId}
                  projectsData={projectsData}
                  judgesData={judgesData}
                />
              </div>
            )}
            {projectsData && judgesData && (
              <div className="mt-6">
                <FlaggedProjects hackathonId={hackathonId} />
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
