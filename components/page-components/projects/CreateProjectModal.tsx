"use client";
import { MultiSelect } from "@/components/common/form/select/multi";
import { ProjectIcon, WebsiteLink } from "@/components/icons/Location";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import GenericModal from "@/components/ui/generic-modal";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import UseModal from "@/hooks/useModal";
import { useAuthStore } from "@/state";
import { Option } from "@/types/common";
import { HackathonChallenges } from "@/types/entities";
import { cn } from "@/utils/tailwind-merge";
import axios, { AxiosError } from "axios";
import { useFormik } from "formik";
import { Info } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useState } from "react";
import { toast } from "sonner";
import useSWR from "swr";
import {
  checkFileExists,
  formatGitHubUrl,
  validateProjectRepo,
} from "./ProgressFooter/repoValidation";
import { LOGO_TEMPLATES } from "./constants/bacakground";
interface CreateProjectModalProps {
  hackathonId: string;
  onOpenSpotModal: () => void;
  setSubmittedProjectUrl: Dispatch<SetStateAction<string | null>>;
}

const CreateProjectModal = ({
  hackathonId,
  onOpenSpotModal,
  setSubmittedProjectUrl,
}: CreateProjectModalProps) => {
  const router = useRouter();
  const { user } = useAuthStore();
  const { closeModal: onClose, isOpen, openModal: onOpen } = UseModal();

  const fetchHackathonChallenges = async (url: string) => {
    try {
      const response = await axios.get<{
        data: {
          items: HackathonChallenges[];
        };
      }>(url);

      const options: Option[] = response?.data?.data?.items.map((role) => ({
        value: role.id,
        // @ts-ignore
        label: role.sponsors[0]?.name + ": " + role.challenge_name,
      }));

      return options;
    } catch (error) {
      console.log(error);
      return [];
    }
  };

  const { data: hackathonChallenges = [], isLoading: isFetchingChallenges } =
    useSWR<Option[]>(
      `/api/hackathons/${hackathonId}/challenges?as=options`,
      fetchHackathonChallenges,
      {}
    );

  const [creationType, setCreationType] = useState<"template" | "bot" | null>(
    null
  );

  const formik = useFormik({
    initialValues: {
      name: null,
      projectUrl: null,
      challengeIds: [],
      projectCodeType: null,
    },
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      setSubmitting(true);

      if (!values.projectUrl) {
        toast.error("Project URL is required", {
          position: "top-right",
        });

        setSubmitting(false);

        return;
      }

      const validation = await validateProjectRepo(values.projectUrl);

      if (!validation.isValid) {
        toast.error(validation.error, {
          position: "top-right",
        });

        setSubmitting(false);

        return;
      }

      const formattedUrl = formatGitHubUrl(values.projectUrl);

      if (creationType == "bot") {
        setSubmittedProjectUrl(formattedUrl);
        resetForm();
        onClose();
        onOpenSpotModal();
        return;
      }

      try {
        const randomLogo =
          LOGO_TEMPLATES[Math.floor(Math.random() * LOGO_TEMPLATES.length)];
        const payload = {
          ...values,
          hackathonId,
          logo_url: randomLogo,
        };

        if (creationType === "template") {
          const fileResult = await checkFileExists(
            formattedUrl,
            "project.json"
          );

          if (!fileResult) {
            toast.error("There is no Project.json in your project", {
              position: "top-right",
            });

            setSubmitting(false);

            return;
          }

          const response = await axios.post(
            "https://devspot-judge-agent.onrender.com/project/generate",
            {},
            {
              params: {
                project_url: formattedUrl,
                user_id: user?.id,
              },
            }
          );

          if (!response.data.data)
            return toast.error(
              "Could not create project, Please create manually"
            );

          resetForm();

          toast.success("Project Created Successfully", {
            position: "top-right",
          });

          return router.push(`/en/projects/${response.data?.data.id}`);
        }

        const response = await axios.post(`/api/projects`, {
          ...payload,
          projectUrl: formattedUrl,
        });
        setSubmitting(true);

        router.push(`/en/projects/${response.data.id}`);

        toast.success("Project Created Successfully", {
          position: "top-right",
        });
      } catch (error: any) {
        console.log("Error Creating Project:", error);

        setSubmitting(false);

        console.log(error);
        if (error instanceof AxiosError) {
          toast.error(
            `Could not Create Project ${error?.response?.data?.error}`,
            {
              position: "top-right",
            }
          );

          return;
        }

        toast.error(`Could not Create Project ${error?.message}`, {
          position: "top-right",
        });
      }
    },
  });

  return (
    <GenericModal
      hasMinHeight={false}
      hasSidebar={false}
      controls={{
        isOpen,
        onClose,
        onOpen,
      }}
      trigger={
        <div>
          <Button className="flex gap-2 items-center" variant="special">
            <ProjectIcon />
            <span>Create Project</span>
          </Button>
        </div>
      }
    >
      <div className="overflow-y-scroll">
        <DialogHeader className="bg-[#1B1B22] py-2">
          <DialogTitle className="!text-[24px] font-semibold">
            Create your project page
          </DialogTitle>
        </DialogHeader>

        <form
          onSubmit={formik.handleSubmit}
          className="flex flex-col gap-3 mt-6 overflow-y-scroll"
        >
          <p className="font-normal font-roboto text-sm">
            You can always edit this later.
          </p>

          <Input
            // required
            id="name"
            name="name"
            placeholder="Your project’s Name"
            height="20px"
            value={formik.values.name ?? ""}
            className="font-roboto text-sm"
            onChange={formik.handleChange}
            error={formik.errors.name}
          />

          <Input
            id="projectUrl"
            name="projectUrl"
            placeholder="Your project’s public repository link"
            height="20px"
            value={formik.values.projectUrl ?? ""}
            className="font-roboto text-sm"
            prefixIcon={<WebsiteLink color="#4E52F5" />}
            onChange={formik.handleChange}
          />

          <MultiSelect
            isSearchable
            options={hackathonChallenges}
            isLoading={isFetchingChallenges}
            placeholder="What challenge(s) are you submitting this project for?"
            value={formik.values.challengeIds}
            onChange={(selectedValues) => {
              formik.setFieldValue("challengeIds", selectedValues);
            }}
            height="150px"
            styles={{
              placeholder: (provided) => ({
                ...provided,
                fontSize: "14px",
                fontWeight: "normal",
                height: "40px",
              }),
            }}
          />
          <p className="font-normal font-roboto text-xs flex items-center gap-2 italic">
            <Info
              color="#4E52F5"
              className="w-3 h-3 text-gray-400 hover:text-white"
            />
            <p className="flex items-center gap-1">
              Want to use the 🦴 Fetch Spot feature for project submission? Just
              plug in your project using{" "}
              <Link
                href="/project-submission-guide"
                target="_blank"
                className="text-main-primary font-meduim"
              >
                this JSON template
              </Link>{" "}
              —full instructions{" "}
              <Link
                href="/project-submission-guide"
                target="_blank"
                className="text-main-primary font-medium"
              >
                right here.
              </Link>
            </p>
          </p>

          <div>
            <p className="font-roboto font-normal text-secondary-text text-sm mb-3">
              Fresh Code or Existing Code?
            </p>

            <div className="flex gap-3">
              <div className="flex items-center gap-4">
                <Badge
                  onClick={() =>
                    formik.setFieldValue("projectCodeType", "fresh_code")
                  }
                  className={cn(
                    "!bg-transparent border !border-white px-4 h-8 rounded-full text-sm font-roboto font-normal !text-white whitespace-nowrap cursor-pointer transition-all duration-200 ease-in-out",

                    formik.values.projectCodeType === "fresh_code" &&
                      "!bg-white !text-tertiary-text"
                  )}
                >
                  Fresh Code
                </Badge>

                <Badge
                  onClick={() =>
                    formik.setFieldValue("projectCodeType", "existing_code")
                  }
                  className={cn(
                    "!bg-transparent border !border-white px-4 h-8 rounded-full text-sm font-roboto font-normal !text-white whitespace-nowrap cursor-pointer transition-all duration-200 ease-in-out",

                    formik.values.projectCodeType === "existing_code" &&
                      "!bg-white !text-tertiary-text"
                  )}
                >
                  Existing Code
                </Badge>
              </div>
            </div>
          </div>

          <div className="w-full gap-2 flex sm:justify-end justify-center mt-4">
            {/* <Button
              type="submit"
              onClick={() => setUseBot(true)}
              className="w-fit font-roboto text-sm flex items-center gap-2"
              disabled={
                Boolean(formik.errors.projectUrl) ||
                !Boolean(formik.values.projectUrl) ||
                formik.isSubmitting
              }
            >
              🐶 Let Spot create it
              {formik.isSubmitting && useBot && <Spinner size="small" />}
            </Button> */}
            <Button
              type="submit"
              onClick={() => setCreationType("template")}
              className="w-fit font-roboto text-sm flex items-center gap-2"
              disabled={
                Boolean(formik.errors.projectUrl) ||
                !Boolean(formik.values.projectUrl) ||
                formik.isSubmitting
              }
            >
              🦴 Go fetch Spot!
              {formik.isSubmitting && creationType == "template" && (
                <Spinner size="small" />
              )}
            </Button>

            <Button
              type="submit"
              onClick={() => setCreationType(null)}
              className="w-fit font-roboto text-sm gap-2"
              disabled={
                !formik.dirty ||
                !formik.isValid ||
                formik.isSubmitting ||
                formik.values.challengeIds.length < 1 ||
                !formik.values.name ||
                !formik.values.projectCodeType
              }
            >
              {formik.isSubmitting && !creationType && <Spinner size="small" />}{" "}
              Review and Submit
            </Button>
          </div>
        </form>
      </div>
    </GenericModal>
  );
};

export default CreateProjectModal;
