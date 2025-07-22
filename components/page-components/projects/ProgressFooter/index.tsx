import { Checkbox } from "@/components/common/Checkbox";
import Modal from "@/components/common/Modal";
import { CheckCircle } from "@/components/icons/Location";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import UseModal from "@/hooks/useModal";
import { consentItems } from "@/mocked_data/data-helpers/hackathons/legal-data";
import { Projects, UserHackathonChallengeFeedback } from "@/types/entities";
import axios, { AxiosError } from "axios";
import { Eye } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import useSWR, { useSWRConfig } from "swr";
import { validateProjectRepo } from "./repoValidation";
import { SubmissionTooltip } from "./submissionToolTip";

interface ProgressFooterProps {
  project: Projects;
}

export const ProgressFooter = ({ project }: ProgressFooterProps) => {
  const router = useRouter();
  const { mutate } = useSWRConfig();
  const searchParams = useSearchParams();
  const progress = project?.project_completion_rate ?? 0;
  const [submitting, setSubmitting] = useState(false);
  const {
    isOpen: isLegalOptInOpen,
    openModal: openLegalOptInModal,
    closeModal: closeLegalOptInModal,
  } = UseModal("legal-opt-in");

  const handlePreview = () => {
    const current = new URLSearchParams(searchParams);
    current.set("view", "preview");

    router.push(`?${current.toString()}`);
  };

  const fetchUserHackathonFeedbacks = async (url: string) => {
    const resp = await axios.get(url);
    return resp.data as UserHackathonChallengeFeedback[];
  };

  const { data, isLoading: isProjectLoading } = useSWR<
    UserHackathonChallengeFeedback[]
  >(
    `/api/hackathons/${project.hackathon_id}/feedback`,
    fetchUserHackathonFeedbacks
  );

  const hasFeedback = useMemo(() => {
    const challenges = project.project_challenges ?? [];

    const remainingChallenges = challenges.filter((challenge) => {
      return !data?.some(
        (feedback) => feedback?.challenge_id === challenge?.challenge_id
      );
    });

    console.log(remainingChallenges);

    return remainingChallenges.length === 0;
  }, [data, project]);

  const handleSubmit = async () => {
    setSubmitting(true);

    if (progress < 100) {
      toast.success(
        "Cannot Submit Project At the moment, Please Complete project requirements",
        {
          position: "top-right",
        }
      );

      setSubmitting(false);

      return;
    }

    if (!project.project_url) {
      toast.error("Project URL is required, Please update your project url", {
        position: "top-right",
      });

      setSubmitting(false);

      return;
    }

    const validation = await validateProjectRepo(project.project_url);

    if (!validation.isValid) {
      toast.error(validation.error, {
        position: "top-right",
      });

      setSubmitting(false);

      return;
    }

    try {
      await axios.post(`/api/projects/${project?.id}/submit-project`, {});

      mutate(`/api/projects/${project?.id}`);

      toast.success("Submitted Project Successfully", {
        position: "top-right",
      });
      closeLegalOptInModal();
    } catch (error: any) {
      console.log("Error Submitting Project:", error);

      setSubmitting(false);

      if (error instanceof AxiosError) {
        toast.error(
          `Could not Submit Project ${error?.response?.data?.error}`,
          {
            position: "top-right",
          }
        );

        return;
      }

      toast.error(`Could not Submit Project  ${error?.message}`, {
        position: "top-right",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const [consents, setConsents] = useState<Record<string, boolean>>({});
  const handleConsentChange = (id: string) => {
    setConsents((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };
  const allRequiredConsentsChecked = consentItems
    .filter((item) => item.required)
    .every((item) => consents[item.id]);

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-[#4103CE] to-[#010375] py-3 px-5 flex items-center justify-between z-40 shadow-lg font-roboto">
      <div className="flex flex-col gap-3 lg:ml-64 md:ml-20 ml-0">
        <div className="flex items-center gap-2">
          <p className="text-sm text-white">
            Your project is {progress}% complete.
          </p>
          <SubmissionTooltip projectData={project} />
        </div>

        <div className="mt-2 w-full bg-[#5A5A5F] rounded-full h-1.5">
          <div
            className="bg-gradient-to-r from-[#9667FA] to-[#4075FF] h-1.5 rounded-full"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={handlePreview}
          className="flex items-center gap-2 text-sm text-white px-3 py-1.5 rounded-md transition-colors"
        >
          <Eye size={16} />
          <span>PREVIEW</span>
        </button>
        <Button
          onClick={() => progress >= 100 && openLegalOptInModal()}
          size="sm"
          className="text-sm gap-2"
          disabled={
            project?.submitted ||
            progress < 100 ||
            isProjectLoading ||
            !hasFeedback
          }
        >
          {project.submitted ? (
            <>
              <CheckCircle />
              Submitted
            </>
          ) : (
            "Submit Project"
          )}
        </Button>
      </div>

      <Modal
        isOpen={isLegalOptInOpen}
        onClose={closeLegalOptInModal}
        sidebar={false}
        maxWidth="800px"
      >
        <div className="w-full relative">
          <div className="pt-5 px-5 pb-2 bg-[#1B1B22]">
            <h2 className="text-[20px] sm:text-[24px] sticky left-6 top-0 font-semibold font-inter">
              Legal Opt-ins
            </h2>
            <p className="font-inter text-[15px] mt-6">
              Please agree to the following legal terms.
            </p>
          </div>
          <div className="text-white px-4 pt-4 h-[550px] overflow-y-scroll w-full font-roboto">
            <div className="max-w-3xl mx-auto ">
              <div className="space-y-3">
                {consentItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between gap-4 p-3 rounded-lg bg-tertiary-bg text-gray-300"
                  >
                    <div className="space-y-2">
                      <h3 className="text-[16px] font-roboto font-medium text-white">
                        {item?.title}
                      </h3>
                      {item?.linkUrl ? (
                        <p className="text-sm text-secondary-text">
                          {item?.description}{" "}
                          <Link
                            target="_blank"
                            rel="noreferrer"
                            href={item?.linkUrl}
                            className="text-white hover:underline"
                          >
                            {item?.linkText}
                          </Link>{" "}
                          {item?.afterLinkText}
                        </p>
                      ) : (
                        <p className="text-sm text-secondary-text">
                          {item?.description}
                        </p>
                      )}
                    </div>
                    <div>
                      <Checkbox
                        checked={!!consents[item.id]}
                        onCheckedChange={() => handleConsentChange(item.id)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="pt-6 w-full justify-end flex bg-[#1B1B22] sticky bottom-0 right-6 pb-6">
              <Button
                disabled={!allRequiredConsentsChecked || submitting}
                onClick={handleSubmit}
                className="flex items-center gap-1"
              >
                {submitting && <Spinner size="small" />}
                Continue
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};
