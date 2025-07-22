import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/utils/url-validator";
import axios from "axios";
import useSWR from "swr";

interface ProjectProps {
  id: string;
  challengeId: string;
  projectsData: any[]; // Replace with actual type if available
}

const ProjectsScoreTable = ({
  projectsData,
  id,
  challengeId,
}: ProjectProps) => {
  const fetchHandler = async (url: string) => {
    try {
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  };

  // Get the judges information
  // /api/judgings/[judgingId]/assign-winner/get-challenges/[challengeId]/judges
  const {
    data: judgesData,
    error: judgesError,
    isLoading: judgesLoading,
  } = useSWR(
    `/api/judgings/${id}/assign-winner/get-challenges/${challengeId}/judges`,
    fetchHandler
  );

  if (judgesLoading) {
    return <div className="font-roboto">Loading Projects data...</div>;
  }

  return (
    <div className="flex w-full overflow-hidden rounded-lg pt-0  pb-0 border border-tertiary-bg text-white">
      {/* Left: Project Names */}
      <div className="min-w-[120px] lg:min-w-[250px] xl:min-w-[300px] sticky left-0 z-10 bg-background border-r border-tertiary-bg">
        <div className="p-4 font-bold border-b border-tertiary-bg">
          Projects
        </div>
        {projectsData.map((project) => (
          <div key={project.id} className="h-14 p-4 flex items-center gap-2">
            <Avatar className="w-6 h-6">
              <AvatarImage
                src={project?.logo_url}
                className="w-full object-cover"
                alt={project?.name}
              />
              <AvatarFallback>
                <div className="w-8 h-8 rounded-full bg-gray-300 border-2 border-gray-200 flex items-center justify-center text-xs font-medium text-gray-700">
                  {getInitials(project.name)}
                </div>
              </AvatarFallback>
            </Avatar>
            <span title={project.name} className="truncate">
              {project.name}
            </span>
          </div>
        ))}
      </div>

      {/* Center: Judges + Scores (single scrollable block) */}
      <div className="overflow-x-auto w-full">
        <div className="min-w-max">
          {/* Judges Header Row */}
          <div className="flex border-b border-tertiary-bg bg-background sticky top-0 z-10">
            <div className="w-24 !h-14 flex justify-center items-center">
              <Avatar className="w-8 h-8  border border-white">
                <AvatarImage
                  src="https://pbnaslxybqdeosvgknbq.supabase.co/storage/v1/object/public/hackathon-images//devspot-judgebot-logo.png"
                  className="w-full object-cover"
                  alt="Judge Bot"
                />
                <AvatarFallback>
                  <div className="w-8 h-8 rounded-full bg-gray-300 border-2 border-gray-200 flex items-center justify-center text-xs font-medium text-gray-700">
                    JB
                  </div>
                </AvatarFallback>
              </Avatar>
            </div>

            {judgesData.map((judge: any) => (
              <div
                key={judge.id}
                className="w-24 !h-14 flex justify-center items-center"
              >
                <Avatar className="w-8 h-8">
                  <AvatarImage
                    src={judge?.user?.avatar_url}
                    className="w-full object-cover"
                    alt={judge?.user?.full_name}
                  />
                  <AvatarFallback>
                    <div className="w-8 h-8 rounded-full bg-gray-300 border-2 border-gray-200 flex items-center justify-center text-xs font-medium text-gray-700">
                      {getInitials(judge?.user?.full_name)}
                    </div>
                  </AvatarFallback>
                </Avatar>
              </div>
            ))}
          </div>

          {/* Score Rows */}
          {projectsData.map((project) => {
            const judgebotScore = project.judges_scores.find(
              (score: any) => score.judge_id === "bot"
            );

            return (
              <div key={project.id} className="flex  bg-secondary-bg">
                {judgebotScore && (
                  <div className="w-24 !h-14 flex justify-center items-center">
                    <div className="border border-white rounded-full px-3 py-1 text-sm">
                      {judgebotScore
                        ? Math.ceil(Number(judgebotScore?.score))
                        : "-"}
                      /10
                    </div>
                  </div>
                )}
                {judgesData.map((judge: any) => {
                  const scoreEntry = project.judges_scores.find(
                    (score: any) => score.judge_id === judge.id
                  );
                  return (
                    <div
                      key={judge.id}
                      className="w-24 !h-14 flex justify-center items-center"
                    >
                      <div className="border border-white rounded-full px-3 py-1 text-sm">
                        {scoreEntry ? Math.ceil(Number(scoreEntry.score)) : "-"}
                        /10
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>

      {/* Right: Averages */}
      <div className="min-w-[100px] sticky right-0 z-10 bg-background border-l border-tertiary-bg">
        <div className="p-4 font-bold border-b border-tertiary-bg text-center">
          Average
        </div>
        {projectsData.map((project) => (
          <div key={project.id} className="flex  items-center justify-center">
            <div
              key={project.id}
              className="!h-14 flex justify-center items-center"
            >
              <span
                className="px-2 py-1 rounded-full text-sm font-medium text-white"
                style={{
                  background: "linear-gradient(to right top, #4075FF, #9667FA)",
                }}
              >
                {Math.ceil(Number(project.average_score))}/10
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectsScoreTable;
