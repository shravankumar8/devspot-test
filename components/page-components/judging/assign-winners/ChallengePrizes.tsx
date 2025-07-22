import axios from "axios";
import { useCallback, useState } from "react";
import useSWR from "swr";
import PrizeCard from "./PrizesCard";
import ProjectsScoreTable from "./ProjectsScoreTable";
import WinnerModal from "./WinnerModal";

interface ChallengePrizesProps {
  id: string;
  assignWinnersChallengesData: any; // Replace with actual type if available
}

// Todo: Add in the project info as props
const ChallengePrizes = ({
  id,
  assignWinnersChallengesData,
}: ChallengePrizesProps) => {
  const [selections, setSelections] = useState<{
    [prizeId: number]: {
      projectId: number;
      challengeId: number;
      judgingId: string;
      prizeId: number;
    };
  }>({});
  const [assignedProjects, setAssignedProjects] = useState<number[]>([]);
  const [prizeAssignments, setPrizeAssignments] = useState<
    Record<number, number | null>
  >({});

  const fetchHandler = async (url: string) => {
    try {
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  };

  const {
    data: projectsData,
    error: projectsError,
    isLoading: projectsLoading,
  } = useSWR(
    `/api/judgings/${id}/assign-winner/get-challenges/${assignWinnersChallengesData.id}/projects`,
    fetchHandler
  );

  const {
    data: submissionSatus,
    error: submissionStatusError,
    isLoading: statusLoading,
  } = useSWR(
    `/api/judgings/${id}/assign-winner/get-challenges/${assignWinnersChallengesData.id}/get-project-submission-status`,
    fetchHandler
  );

  const handlePrizeProjectSelect = useCallback(
    (prizeId: number, projectId: number | null) => {
      setPrizeAssignments((prev) => {
        const newAssignments = { ...prev, [prizeId]: projectId };

        // Update assigned projects list
        const newAssignedProjects = Object.values(newAssignments).filter(
          (id) => id !== null
        );

        setAssignedProjects(newAssignedProjects);

        return newAssignments;
      });
      setSelections((prev) => {
        if (projectId === null) {
          // If projectId is null, remove this prize from selections
          const { [prizeId]: _, ...rest } = prev;
          return rest;
        } else {
          // Add or update the selection for this prize
          return {
            ...prev,
            [prizeId]: {
              projectId,
              challengeId: assignWinnersChallengesData.id,
              judgingId: id,
              prizeId,
            },
          };
        }
      });
    },
    [assignWinnersChallengesData.id, projectsData]
  );

  if (projectsLoading) {
    return <div className="text-white">Loading projects...</div>;
  }

  return (
    <div>
      {/* Title */}
      <div className="flex justify-between items-center mb-4">
        <h1 className=" font-bold text-2xl font-roboto">
          {assignWinnersChallengesData?.challenge_name}
        </h1>

        <WinnerModal
          judgingId={id}
          selections={selections}
          challengeName={assignWinnersChallengesData?.challenge_name}
          submittedWinners={assignWinnersChallengesData?.submitted_winners}
          submissionStatus={submissionSatus}
        />
      </div>

      {/* Prizes Grid */}
      <div className="grid grid-cols-12 gap-6">
        {assignWinnersChallengesData?.prizes.map(
          (prize: any, index: number) => (
            <div className="col-span-12 md:col-span-6" key={index}>
              <PrizeCard
                prize={prize}
                challengeId={assignWinnersChallengesData?.id}
                onProjectSelect={handlePrizeProjectSelect}
                currentAssignment={prizeAssignments[prize.id]}
                assignedProjects={assignedProjects}
                projects={projectsData}
                submittedWinners={
                  assignWinnersChallengesData?.submitted_winners
                }
              />
            </div>
          )
        )}
      </div>

      {/* Projects Table */}
      <div className="mt-4">
        <ProjectsScoreTable
          challengeId={assignWinnersChallengesData.id}
          id={id}
          projectsData={projectsData}
        />
      </div>
    </div>
  );
};

export default ChallengePrizes;
