import { JudgingEntries } from "@/types/entities";
import { ChallengPrizeType } from "@/types/techowners";
import axios from "axios";
import Link from "next/link";
import useSWR from "swr";
import ProjectCard from "../dashboard/sections/projects/ProjectCard";
import { JudgeCard } from "../TODashboard/prizes/challenges/JudgesCard";
import ProjectsScoreTable from "./assign-winners/ProjectsScoreTable";

interface ChallengeGroupProps {
  challengeId: string;
  challengeGroup: any;
  filteredProjects: JudgingEntries[];
  judgingId: string;
  judgesData: ChallengPrizeType[];
}

export const ChallengeGroupWithData = ({
  challengeId,
  challengeGroup,
  judgingId,
  judgesData,
  filteredProjects,
}: ChallengeGroupProps) => {
  // Fetch projects data for this specific challenge
  const fetchHandler = async (url: string) => {
    try {
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  };

  const { data: tableProjectsData, isLoading: isTableLoading } = useSWR(
    `/api/judgings/${judgingId}/assign-winner/get-challenges/${challengeId}/projects`,
    fetchHandler
  );

  const challengeJudges =
    judgesData.find(
      (challenge) => challenge.challenge_name === challengeGroup.challenge_name
    )?.judges || [];

  if (filteredProjects.length === 0) return null;

  return (
    <div className="space-y-4 mt-4">
      <h3 className="text-lg font-roboto font-semibold text-white">
        {challengeGroup.challenge_name}
      </h3>

      {/* Projects cards */}
      <div className="gap-6 grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3">
        {filteredProjects.map((card: any, index) =>
          card.projects.submitted ? (
            <Link
              key={index}
              href={`/judging/${card.judging_id}/${card.project_id}/${card.projects?.project_challenge?.challenge_id}`}
            >
              <ProjectCard
                key={card.id}
                props={card.projects}
                judgingStatus={card.judging_status}
                score={card.score}
                showBadge={true}
                botScore={
                  card.judging_bot_scores
                    ? card.judging_bot_scores?.score
                    : null
                }
              />
            </Link>
          ) : (
            <ProjectCard
              key={card.id}
              props={card.projects}
              judgingStatus={card.judging_status}
              score={card.score ?? 0}
              showBadge={true}
            />
          )
        )}
      </div>

      {/* JudgeCard section */}
      {challengeJudges.length > 0 && (
        <section className="z-10 relative flex mb-4 border border-tertiary-bg rounded-2xl min-h-[88px]">
          <div className="flex flex-col justify-center gap-4 bg-secondary-bg p-3 rounded-tl-2xl rounded-bl-2xl font-roboto">
            <h6 className="font-medium text-secondary-text text-sm">Judge</h6>
            <h6 className="font-medium text-secondary-text text-sm">
              Progress
            </h6>
          </div>
          <div className="flex w-full overflow-x-scroll scrollbar-custom">
            {challengeJudges.map((judge, index) => (
              <JudgeCard
                key={judge.id}
                judgeData={judge}
                bgColor={index % 2 === 0 ? "primary" : "secondary"}
                isLast={index === challengeJudges.length - 1}
              />
            ))}
          </div>
        </section>
      )}

      {/* ProjectsScoreTable section */}
      {!isTableLoading && tableProjectsData && (
        <div className="mt-4">
          <ProjectsScoreTable
            challengeId={challengeId}
            id={judgingId}
            projectsData={tableProjectsData}
          />
        </div>
      )}
    </div>
  );
};
