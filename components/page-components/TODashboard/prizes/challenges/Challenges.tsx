"use client";

import { Button } from "@/components/ui/button";
import { useTechOwnerStore } from "@/state/techOwnerStore";
import { usePreviewStore } from "@/state/TODashboard";
import { ChallengPrizeType } from "@/types/techowners";
import axios, { AxiosError } from "axios";
import { CheckCircle } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import useSWR from "swr";
import { LeaderboardEntry } from "../leaderboard/Preview";
import AddPrizeModal from "./AddPrizeModal";
import { JudgeCard } from "./JudgesCard";
import PrizeCard from "./PrizesCard";

export interface PrizesProjects {
  project_id: number;
  name: string;
  logo_url: string | null;
  average_score: number | null;
}
// #region Main component
interface ChallengesProps {
  challengePrize: ChallengPrizeType;
  hackathon_id: number | string;
}

const ChallengeItem = ({ challengePrize, hackathon_id }: ChallengesProps) => {
  const { selectedOrg } = useTechOwnerStore();
  const [prizeAssignments, setPrizeAssignments] = useState<
    Record<number, number | null>
  >({});
  const [assignedProjects, setAssignedProjects] = useState<number[]>([]);
  const [isPublishing, setIsPublishing] = useState(false);

  const { setPreviewAssignment, removePreviewAssignment } = usePreviewStore();

  useEffect(() => {
    const initialAssignments = challengePrize.prizes.reduce((acc, prize) => {
      acc[prize.id] = null;
      return acc;
    }, {} as Record<number, number | null>);
    setPrizeAssignments(initialAssignments);
  }, [challengePrize.prizes]);

  const fetchProjectsData = async (url: string) => {
    try {
      const resp = await axios.get(url);
      return resp.data;
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  const { data: projectsData, isLoading: isProjectsDataLoading } = useSWR<
    LeaderboardEntry[]
  >(
    `/api/technology-owners/${selectedOrg?.technology_owner_id}/hackathons/${hackathon_id}/prizes/challenges/${challengePrize?.id}/projects`,
    fetchProjectsData
  );

  const hasAssignedPrizes = Object.values(prizeAssignments).some(
    (id) => id !== null
  );

  const handlePublish = async () => {
    try {
      // Prepare the payload with only assigned prizes
      setIsPublishing(true);
      const winners = Object.entries(prizeAssignments)
        .filter(([_, projectId]) => projectId !== null)
        .map(([prizeId, projectId]) => ({
          challenge_id: challengePrize.id,
          project_id: projectId!,
          prize_id: Number(prizeId),
        }));

      const response = await axios.put(
        `/api/technology-owners/${selectedOrg?.technology_owner_id}/hackathons/${hackathon_id}/prizes/publish-winners`,
        { winners }
      );
      toast.success(`Prizes Published Successfully`, {
        position: "bottom-right",
      });

      // Show success notification
    } catch (error: any) {
      console.error("Failed to publish:", error);
      // Show error notification
      if (error instanceof AxiosError) {
        toast.error(
          `Could not publish prizes ${error?.response?.data?.error}`,
          {
            position: "bottom-right",
          }
        );

        return;
      }

      toast.error(`Could not publish prizes ${error?.response?.data?.error}`, {
        position: "bottom-right",
      });
    } finally {
      setIsPublishing(false);
    }
  };

  const handlePrizeProjectSelect = useCallback(
    (prizeId: number, projectId: number | null) => {
      setPrizeAssignments((prev) => {
        const newAssignments = { ...prev, [prizeId]: projectId };

        // Update preview store
        if (projectId) {
          const project = projectsData?.find((p) => p.projectId === projectId);
          setPreviewAssignment(challengePrize.id, {
            prizeId,
            projectId,
            isPreview: true,
            projectData: project ?? undefined,
          });
        } else {
          removePreviewAssignment(challengePrize.id, prizeId);
        }

        // Update assigned projects list
        const newAssignedProjects = Object.values(newAssignments).filter(
          (id) => id !== null
        ) as number[];
        setAssignedProjects(newAssignedProjects);

        return newAssignments;
      });
    },
    [
      challengePrize.id,
      projectsData,
      setPreviewAssignment,
      removePreviewAssignment,
    ]
  );

  return (
    <div>
      {/* Challenge Name + Buttons */}

      <header className="flex justify-between items-end mb-4">
        <h1 className="font-roboto font-bold text-2xl">
          {challengePrize.challenge_name}
        </h1>
        <div className="flex items-center gap-3 ">
          <AddPrizeModal
            challengeId={challengePrize?.id}
            mode="Add"
            isPrizePage
            hackathonId={1}
          />
          <Button
            size="sm"
            variant={"secondary"}
            loading={isPublishing}
            disabled={
              !hasAssignedPrizes &&
              !challengePrize.prizes.some((prize) => prize.assigned_project)
            }
            onClick={handlePublish}
          >
            <CheckCircle className="mr-2" size={20} />
            {isPublishing ? "Publishing..." : "Publish"}
          </Button>
        </div>
      </header>

      {/* Judges and Progress */}
      {challengePrize?.judges.length > 0 && (
        <section className="z-10 relative flex mb-4 border border-tertiary-bg rounded-2xl min-h-[88px]">
          <div className="flex flex-col justify-center gap-4 bg-secondary-bg p-3 rounded-tl-2xl rounded-bl-2xl font-roboto">
            <h6 className="font-medium text-secondary-text text-sm">Judge</h6>
            <h6 className="font-medium text-secondary-text text-sm">
              Progress
            </h6>
          </div>
          <div className="flex w-full overflow-x-scroll scrollbar-custom">
            {challengePrize?.judges.map((judge, index) => (
              <JudgeCard
                key={judge.id}
                judgeData={judge}
                bgColor={index % 2 === 0 ? "primary" : "secondary"}
                isLast={index === challengePrize?.judges.length - 1}
              />
            ))}
          </div>
        </section>
      )}

      {/* Prizes */}
      {challengePrize?.prizes.length > 0 && projectsData && (
        <div className="gap-4 grid grid-cols-12">
          {challengePrize?.prizes?.map((prize) => (
            <PrizeCard
              key={prize.id}
              prize={prize}
              challengeId={challengePrize?.id}
              onProjectSelect={handlePrizeProjectSelect}
              assignedProjects={assignedProjects}
              currentAssignment={prizeAssignments[prize.id]}
              projects={projectsData}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ChallengeItem;
