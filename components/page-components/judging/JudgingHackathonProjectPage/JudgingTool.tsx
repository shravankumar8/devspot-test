"use client";
import { Button } from "@/components/ui/button";
import UseModal from "@/hooks/useModal";
import { useAuthStore } from "@/state";
import { JudgingEntries, Judgings } from "@/types/entities";
import axios from "axios";
import {
  BarChartIcon,
  ChevronDownCircleIcon,
  ChevronLeft,
  ChevronRight,
  ChevronUpCircleIcon,
  Code,
  FlagIcon,
  PencilRuler,
  Rocket,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import useSWR, { useSWRConfig } from "swr";
import ProjectBadge from "../../dashboard/sections/projects/ProjectBadge";
import EvaluationCard from "./judging-tool/EvaluationCard";
import ScoreInput from "./judging-tool/Score";

interface Props {
  entry: JudgingEntries & {
    can_be_edited?: boolean;
  };
  setIsJudgingToolOpen: (isOpen: boolean) => void;
  isJudgingToolOpen: boolean;
  allJudgingProjects: JudgingEntries[];
  currentIndex: number;
  total: number;
}

const JudgingTool = (props: Props) => {
  const router = useRouter();
  const pathname = usePathname(); // e.g. /en/judging/1/123
  const {
    entry,
    isJudgingToolOpen,
    setIsJudgingToolOpen,
    allJudgingProjects,
    currentIndex,
    total,
  } = props;
  const { openModal } = UseModal("flag-project");
  const { user } = useAuthStore();

  console.log("JudgingTool entry:", entry);

  // States
  const [feedback, setFeedback] = useState({
    technical: entry.technical_feedback || "",
    ux: entry.ux_feedback || "",
    business: entry.business_feedback || "",
    innovation: entry.innovation_feedback || "",
  });

  const [categoryScores, setCategoryScores] = useState({
    technical: entry.technical_score || 0,
    ux: entry.ux_score || 0,
    business: entry.business_score || 0,
    innovation: entry.innovation_score || 0,
  });

  const handleScoreChange = (
    category: keyof typeof categoryScores,
    value: number
  ) => {
    setCategoryScores((prev) => ({ ...prev, [category]: value }));
  };

  const [score, setScore] = useState(entry.score || 0);

  const [comments, setComments] = useState(
    entry.judging_status === "judged"
      ? entry.general_comments
      : entry.general_comments_summary
  );

  // Handlers

  /**
   *
   * @note: No longer used, but kept for reference for editing feedback summary
   * @param value
   */
  const handleFeedbackChange = (key: keyof typeof feedback, value: string) => {
    console.log(`Feedback for ${key}:`, value);
    setFeedback((prev) => ({ ...prev, [key]: value }));
  };

  const handleBack = () => {
    const segments = pathname.split("/").filter(Boolean); // removes empty strings
    segments.pop(); // remove last segment (projectId)
    segments.pop(); // remove second last segment (id)
    const newPath = "/" + segments.join("/"); // rebuild the path
    router.push(newPath);
  };

  const handleUnflagProject = async () => {
    try {
      await axios.post(
        `/api/judgings/${entry.judging_id}/projects/${entry.project_id}/flag`,
        {
          challenge_id: entry.challenge_id,
          flag_reason: "unflagged", // Required field
          status: "unflag",
        }
      );

      mutate(
        `/api/judgings/${entry.judging_id}/projects/${entry.project_id}?challengeId=${entry.projects.project_challenge?.challenge_id}` // Update the cache for the specific project
      );
      toast.success("Project unflagged successfully.", {
        position: "top-right",
      });
    } catch (error: any) {
      console.error("Error unflagging project:", error);
      toast.error(`Failed to unflag project: ${error?.message}`, {
        position: "top-right",
      });
    }
  };

  // Api
  const [submitting, setSubmitting] = useState(false);
  const { mutate } = useSWRConfig();

  const handleSubmitEntry = async () => {
    setSubmitting(true);

    try {
      const payload = {
        challenge_id: entry.challenge_id,
        score,
        general_comments: comments,
        technical_score: categoryScores.technical,
        business_score: categoryScores.business,
        innovation_score: categoryScores.innovation,
        technical_feedback: feedback.technical,
        ux_feedback: feedback.ux,
        business_feedback: feedback.business,
        innovation_feedback: feedback.innovation,
        ux_score: categoryScores.ux,
        judging_status: "judged",
      };

      console.log("Submitting payload:", payload);

      await axios.put(
        `/api/judgings/${entry.judging_id}/projects/${entry.project_id}`,
        payload
      );

      await mutate(
        `/api/judgings/${entry.judging_id}/projects/${entry.project_id}?challengeId=${entry.challenge_id}`
      );
      toast.success("Updated Judging Entry Successfully", {
        position: "top-right",
      });
    } catch (error: any) {
      console.error("Error updating Judging Entry:", error);
      toast.error(
        `Could not Update Judging Entry Information ${error?.message || ""}`,
        { position: "top-right" }
      );
    } finally {
      setSubmitting(false);
    }
  };

  // Fetch the judgings to get the is submitted status
  const fetchJudgings = async (url: string) => {
    const resp = await axios.get(url);
    return resp.data as Judgings[];
  };

  const { data: judgings = [] } = useSWR<Judgings[]>(
    `/api/people/${user?.id}/judgings`,
    fetchJudgings
  );

  const currentJudging = judgings?.find(
    (j) => j.id === parseInt(String(entry.judging_id))
  );
  const isSubmitted = currentJudging?.is_submitted;
  // If the current entry has already been submitted or the PROJECT has not been submitted, disable the judging tool
  const isDisabled = isSubmitted || !entry.projects.submitted;
  const canBeEdited = entry.can_be_edited && !isDisabled;
  console.log("isDisabled", isDisabled);
  console.log("canBeEdited", canBeEdited);

  return (
    <div
      className={`right-0 lg:right-3 bottom-4 z-50 fixed bg-primary-bg p-4 border border-main-primary rounded-xl w-full lg:w-[40%] transition-all delay-200 ${
        isJudgingToolOpen ? "h-[90vh] overflow-y-scroll" : "h-auto"
      }`}
    >
      <div className="flex flex-col h-full">
        <header className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            {/* Todo: handle onclick */}
            <div onClick={() => setIsJudgingToolOpen(!isJudgingToolOpen)}>
              {isJudgingToolOpen ? (
                <ChevronDownCircleIcon
                  size={28}
                  className="stroke-main-primary cursor-pointer"
                />
              ) : (
                <ChevronUpCircleIcon
                  size={28}
                  className="stroke-main-primary cursor-pointer"
                />
              )}
            </div>
            <div className="flex items-center gap-3">
              <h3 className="font-semibold text-white text-lg">
                You are judging{" "}
                <span className="text-main-primary">BookBot</span>
              </h3>
              <ProjectBadge judgingStatus={entry.judging_status} />
            </div>
          </div>
          <div
            className={`cursor-pointer ${
              isDisabled ? "opacity-50 pointer-events-none" : ""
            }`}
            title={isDisabled ? "You can't flag a submitted project" : ""}
            onClick={() => {
              if (isDisabled) return;

              if (entry.judging_status === "flagged") {
                handleUnflagProject();
              } else {
                openModal(); // opens the flag modal
              }
            }}
          >
            <FlagIcon
              size={28}
              className={`stroke-white ${
                entry.judging_status === "flagged" && "fill-white"
              }`}
            />
          </div>
        </header>

        {!isJudgingToolOpen && (
          <div className="bg-tertiary-bg my-3 w-full h-[2px]" />
        )}

        {/* Todo: convert to its own components */}
        {isJudgingToolOpen && (
          <div>
            <div className="gap-4 grid grid-cols-2 my-3">
              <EvaluationCard
                readOnly={isDisabled}
                canBeEdited={canBeEdited}
                fullDescription={entry.technical_feedback}

                title={entry.projects.name}
                icon={<Code size={20} className="stroke-primary-900" />}
                category="Technical"

                onChange={(value) => handleFeedbackChange("technical", value)}
                description={
                  canBeEdited
                    ? entry.technical_feedback
                    : entry.technical_summary
                }

                score={categoryScores.technical}
                onScoreChange={(val) => handleScoreChange("technical", val)}
              />
              <EvaluationCard
                readOnly={isDisabled}
                canBeEdited={canBeEdited}
                fullDescription={entry.ux_feedback}
                title={entry.projects.name}
                icon={<PencilRuler size={20} className="stroke-primary-900" />}
                category="UX"

                onChange={(value) => handleFeedbackChange("ux", value)}
                description={canBeEdited ? entry.ux_feedback : entry.ux_summary}
                score={categoryScores.ux}
                onScoreChange={(val) => handleScoreChange("ux", val)}
              />
              <EvaluationCard
                readOnly={isDisabled}
                canBeEdited={canBeEdited}
                fullDescription={entry.business_feedback}
                title={entry.projects.name}
                icon={<BarChartIcon size={20} className="stroke-primary-900" />}
                category="Business"
                onChange={(value) => handleFeedbackChange("business", value)}
                description={
                  canBeEdited ? entry.business_feedback : entry.business_summary
                }

                score={categoryScores.business}
                onScoreChange={(val) => handleScoreChange("business", val)}
              />
              <EvaluationCard
                readOnly={isDisabled}
                canBeEdited={canBeEdited}
                title={entry.projects.name}
                fullDescription={entry.innovation_feedback ?? ""}
                icon={<Rocket size={20} className="stroke-primary-900" />}
                category="Innovation"
                onChange={(value) => handleFeedbackChange("innovation", value)}
                description={
                  canBeEdited
                    ? entry.innovation_feedback
                    : entry.innovation_summary
                }
                score={categoryScores.innovation}
                onScoreChange={(val) => handleScoreChange("innovation", val)}
              />
            </div>

            <div>
              <h5 className="font-semibold text-base">Score</h5>
              <ScoreInput
                readOnly={isDisabled}
                value={score}
                onChange={(val) => {
                  setScore(val);
                  console.log("Selected score:", val);
                }}
              />
            </div>

            <div className="my-3">
              <h5 className="font-semibold text-base">Comments</h5>
              <textarea
                disabled={isDisabled}
                name="comments"
                id="comments"
                value={comments}
                placeholder="Enter general comments of this project"
                onChange={(e) => setComments(e.target.value)}
                className="bg-white mt-2 px-4 py-3 border border-primary-900 rounded-lg w-full h-52 text-primary-900 placeholder:text-primary-400 placeholder:italic"
              />
            </div>
          </div>
        )}

        <footer
          className={`flex justify-between items-center ${
            isJudgingToolOpen ? "mt-3 pb-3" : "mt-0"
          }`}
        >
          <div className="flex items-center gap-3">
            <span className="bg-main-primary px-2 pt-0.5 rounded-lg">
              {currentIndex + 1}/{total}
            </span>
            <h3
              onClick={handleBack}
              className="cursor-pointer font-semibold text-white text-base underline"
            >
              Back to dashboard
            </h3>
          </div>

          <div className="flex items-center gap-3">
            {/* Navigate between projects (todo: fix issue) */}
            <Button
              className={`${
                currentIndex === 0 ? "opacity-50 pointer-events-none" : ""
              } !bg-[#DDDEFD]`}
              variant="secondary"
              size="md"
              disabled={currentIndex === 0}
              onClick={() => {
                const prev = allJudgingProjects[currentIndex - 1];
                if (prev) {
                  router.push(
                    `/judging/${prev.judging_id}/${prev.project_id}/${prev.projects?.project_challenge?.challenge_id}`
                  );
                }
              }}
            >
              <ChevronLeft className="stroke-main-primary" size={24} />
            </Button>

            <Button
              className={`${
                currentIndex === total - 1
                  ? "opacity-50 pointer-events-none"
                  : ""
              } !bg-[#DDDEFD]`}
              variant="secondary"
              size="md"
              disabled={currentIndex === total - 1}
              onClick={() => {
                const next = allJudgingProjects[currentIndex + 1];
                if (next) {
                  router.push(
                    `/judging/${next.judging_id}/${next.project_id}/${next.projects?.project_challenge?.challenge_id}`
                  );
                }
              }}
            >
              <ChevronRight className="stroke-main-primary" size={24} />
            </Button>

            <Button
              onClick={handleSubmitEntry}
              disabled={submitting || isDisabled}
              size={"md"}
            >
              Save score
            </Button>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default JudgingTool;
