"use client";
import FlagModal from "@/components/page-components/judging/JudgingHackathonProjectPage/judging-tool/FlagModal";
import JudgingTool from "@/components/page-components/judging/JudgingHackathonProjectPage/JudgingTool";
import { ParticipantProject } from "@/components/page-components/projects";
import { useAuthStore } from "@/state";
import { JudgingEntries } from "@/types/entities";
import { UserProfile } from "@/types/profile";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import useSWR from "swr";

type PageProps = {
  params: { id: string; projectId: string; challengeId: string };
};

export default function JudgingHackathonProjectPage({ params }: PageProps) {
  const router = useRouter();
  const [isJudgingToolOpen, setIsJudgingToolOpen] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("isJudgingToolOpen");
      return saved ? JSON.parse(saved) : false;
    }
    return false;
  });

  useEffect(() => {
    localStorage.setItem(
      "isJudgingToolOpen",
      JSON.stringify(isJudgingToolOpen)
    );
  }, [isJudgingToolOpen]);

  const { user } = useAuthStore();

  useEffect(() => {
    if (!user) router.back();
  }, [user]);

  const judgingId = params.id;
  const projectId = params.projectId;
  const challengeId = params.challengeId;

  const fetchProjectToBeJudged = async (url: string) => {
    const resp = await axios.get(url);
    return resp.data as JudgingEntries;
  };

  const { data: judgingProjects, isLoading } = useSWR<JudgingEntries>(
    `/api/judgings/${judgingId}/projects/${projectId}?challengeId=${challengeId}`,
    fetchProjectToBeJudged
  );

  // Fetch all projects here so juding tool can navigate through them

  const fetchProjectsToBeJudged = async (url: string) => {
    const resp = await axios.get(url);
    return resp.data as JudgingEntries[];
  };

  const { data: allJudgingProjects = [] } = useSWR<JudgingEntries[]>(
    `/api/people/${user?.id}/judgings/${judgingId}/projects/ungrouped`,
    fetchProjectsToBeJudged
  );

  const { data: userProfile, isLoading: isFetchingUserProfile } =
    useSWR<UserProfile>("/api/profile", fetchUserProfile, {});

  async function fetchUserProfile(url: string) {
    try {
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }

  console.log("allJudgingProjects", allJudgingProjects);
  const filteredJudgingProjects = allJudgingProjects?.filter(
    (project) => project.projects.submitted === true
  );

  const currentIndex =
    filteredJudgingProjects.length > 0
      ? filteredJudgingProjects.findIndex(
          (e) =>
            String(e.project_id) === String(projectId) &&
            String(e.projects?.project_challenge?.challenge_id) ===
              String(challengeId)
        )
      : -1;

  console.log("currentIndex", currentIndex);
  console.log("judgingProjects", judgingProjects);

  if (!judgingProjects) return;

  return (
    <div className="relative px-4 py-3">
      {userProfile?.role_id !== 5 && (
        <JudgingTool
          currentIndex={currentIndex}
          total={
            allJudgingProjects.filter(
              (project) => project.projects.submitted === true
            ).length
          }
          isJudgingToolOpen={isJudgingToolOpen}
          setIsJudgingToolOpen={setIsJudgingToolOpen}
          entry={judgingProjects}
          allJudgingProjects={allJudgingProjects.filter(
            (project) => project.projects.submitted === true
          )}
        />
      )}

      <FlagModal
        judgingId={judgingProjects.judging_id}
        projectId={judgingProjects.project_id}
        challengeId={judgingProjects.challenge_id}
      />

      <div
        className={`${
          isJudgingToolOpen ? "lg:w-[60%] lg:pr-5" : "w-full"
        } transition-all duration-250`}
      >
        <ParticipantProject
          isJudgingToolOpen={isJudgingToolOpen}
          isProjectDataLoading={isLoading}
          suspiciousFlags={judgingProjects.suspicious_flags ?? undefined}
          isOwner={false}
          projectData={judgingProjects.projects}
        />
      </div>
    </div>
  );
}
