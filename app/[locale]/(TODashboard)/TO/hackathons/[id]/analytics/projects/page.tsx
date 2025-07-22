"use client";

import HackathonHeader from "@/components/page-components/TODashboard/hackathon-header";
import CircularProgress from "@/components/page-components/TODashboard/prizes/challenges/CircularProgress";

import DevspotLoader from "@/components/common/DevspotLoader";
import ProjectsPerChallengePie from "@/components/page-components/TODashboard/projects/ProjectsPerChallengePie";
import ProjectsStatusesBar from "@/components/page-components/TODashboard/projects/ProjectsStatusesBar";
import { Switch } from "@/components/ui/switch";
import { useTechOwnerStore } from "@/state/techOwnerStore";
import axios from "axios";
import useSWR from "swr";
import ProjectManager, { Project } from "../judging/components/project-manager";
import { JudgeDataType } from "../judging/page";
import ChallengesSkeleton from "./projectsSubmittedLoader";
import TechnologiesSkeleton from "./technologyLoader";
import { useMultiProjectToggle } from "./useMultiProjectToggle";

interface challengesDataType {
  challenge_id: number;
  challenge_name: string;
  total_projects: number;
  submitted_projects: number;
  submission_percentage: number;
}

interface technologyDataType {
  technology_name: string;
  uses: number;
  percentage: number;
}

const ProjectsPage = ({
  params,
}: Readonly<{
  params: { id: string };
}>) => {
  const { selectedOrg } = useTechOwnerStore();
  const HACKATHON_ID = params.id;

  const fetchHandler = async (url: string) => {
    const resp = await axios.get(url);
    return resp.data.data;
  };
  const fetchJudgingsData = async (url: string) => {
    const resp = await axios.get(url);
    return resp.data;
  };

  const { data: projectsData, isLoading: isProjectsLoading } = useSWR<
    Project[]
  >(
    `/api/technology-owners/${selectedOrg?.technology_owner_id}/hackathons/${HACKATHON_ID}/projects`,
    fetchHandler
  );

  const { data: judgesData, isLoading: isJudgesDataLoading } = useSWR<
    JudgeDataType[]
  >(
    `/api/technology-owners/${selectedOrg?.technology_owner_id}/hackathons/${HACKATHON_ID}/judgings`,
    fetchJudgingsData
  );

  const { data: challengesData, isLoading: isChallengesDataLoading } = useSWR<
    challengesDataType[]
  >(
    `/api/technology-owners/${selectedOrg?.technology_owner_id}/hackathons/${HACKATHON_ID}/projects/submitted-per-challenge`,
    fetchJudgingsData
  );

  const { data: technologiesData, isLoading: isTechnologiesDataLoading } =
    useSWR<technologyDataType[]>(
      `/api/technology-owners/${selectedOrg?.technology_owner_id}/hackathons/${HACKATHON_ID}/technologies`,
      fetchJudgingsData
    );

  const { isMultiProjectEnabled, isLoading, isToggling, toggleMultiProjects } =
    useMultiProjectToggle(HACKATHON_ID);

  return (
    <div>
      {isJudgesDataLoading || isProjectsLoading ? (
        <div className="flex justify-center items-center h-screen w-full">
          <DevspotLoader />
        </div>
      ) : (
        <>
          <HackathonHeader />
          <div className="px-8 py-6">
            <h2 className="uppercase text-sm font-roboto font-medium">
              Projects
            </h2>
            <div
              className={`bg-gradient-to-tr from-[#4075FF] to-[#9667FA] text-white text-sm p-2 rounded-lg font-roboto font-medium flex gap-2 items-center mt-3`}
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-gray-300 border-t-[#4075FF] rounded-full animate-spin"></div>
              ) : (
                <Switch
                  checked={isMultiProjectEnabled}
                  onCheckedChange={toggleMultiProjects}
                  disabled={isLoading || isToggling}
                  aria-label="Toggle multi-project mode"
                />
              )}

              <p>
                Allow participants to be a part of multiple teams and submit
                multiple projects.
              </p>
            </div>
            {/* Section: Projects Table */}
            {projectsData && judgesData && (
              <div className="mt-6">
                <ProjectManager
                  projectsData={projectsData}
                  judgesData={judgesData}
                  hackathonId={HACKATHON_ID}
                />
              </div>
            )}
            {/* Section: Project Charts */}
            <section className="mt-6 grid grid-cols-12 gap-6">
              <div className="col-span-12 md:col-span-6 h-auto md:min-h-[330px] rounded-2xl border border-tertiary-bg bg-secondary-bg p-6">
                <h4 className="font-semibold font-roboto">
                  Projects Per Challenge
                </h4>

                {/* Chart */}
                <div className="mt-2">
                  <ProjectsPerChallengePie hackathon_id={HACKATHON_ID} />
                </div>
              </div>

              <div className="col-span-12 md:col-span-6 h-auto md:min-h-[330px] rounded-2xl border border-tertiary-bg bg-secondary-bg p-6">
                <h4 className="font-semibold font-roboto">Project Statuses</h4>

                {/* Chart */}
                <div className="mt-2">
                  <ProjectsStatusesBar hackathon_id={HACKATHON_ID} />
                </div>
              </div>
            </section>
            {/* Section: Technologies, Projects Submitted */}
            <section className="mt-6 grid grid-cols-12 gap-6 font-roboto">
              <div className="col-span-12 md:col-span-4 h-auto md:min-h-[564px] rounded-2xl border border-tertiary-bg bg-secondary-bg p-6">
                {isTechnologiesDataLoading && <TechnologiesSkeleton />}
                {technologiesData && (
                  <>
                    <div className="grid grid-cols-12">
                      <div className="col-span-6">
                        <h6 className="text-secondary-text">Technologies</h6>
                      </div>
                      <div className="col-span-3">
                        <h6 className="text-secondary-text">Uses</h6>
                      </div>
                      <div className="col-span-3">
                        <h6 className="text-secondary-text">Projects</h6>
                      </div>
                    </div>
                    <div className="h-[500px] overflow-y-scroll mt-5">
                      {technologiesData?.map((tech, idx) => (
                        <div key={idx} className="grid grid-cols-12 mt-3">
                          <span
                            className="col-span-6 truncate text-sm"
                            title={tech.technology_name}
                          >
                            {tech.technology_name}
                          </span>
                          <span className="col-span-3 text-sm">
                            {tech.uses}
                          </span>
                          <span className="col-span-3 text-sm">
                            {tech.percentage}%
                          </span>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>

              <div className="col-span-12 md:col-span-4 h-auto md:min-h-[564px] rounded-2xl border border-tertiary-bg bg-secondary-bg p-6">
                <h4 className="font-semibold font-roboto">
                  Projects Submitted per Challenge
                </h4>
                {isChallengesDataLoading && <ChallengesSkeleton />}

                {challengesData && (
                  <div className="mt-5 h-[500px] overflow-y-scroll">
                    <ul className="flex flex-col gap-7">
                      {challengesData?.map((challenge) => (
                        <li
                          key={challenge.challenge_id}
                          className="flex gap-6 items-center"
                        >
                          <div className="flex-shrink-0">
                            <CircularProgress
                              percentage={challenge.submission_percentage}
                              size={48}
                            />
                          </div>

                          <div>
                            <h6 className="text-white font-meduim text-sm">
                              {challenge.challenge_name
                                .replace(/^[⚡️🧪🔁🧠]+/, "")
                                .trim()}
                            </h6>
                            <p className="text-secondary-text text-sm">
                              <span className="text-white">
                                {challenge.submitted_projects}
                              </span>
                              /{challenge.total_projects} Projects
                            </p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </section>
          </div>
        </>
      )}
    </div>
  );
};

export default ProjectsPage;
