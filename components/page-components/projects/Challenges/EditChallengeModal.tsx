import { Button } from "@/components/ui/button";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import GenericModal from "@/components/ui/generic-modal";

import { Spinner } from "@/components/ui/spinner";
import UseModal from "@/hooks/useModal";
import { HackathonChallenges, Projects } from "@/types/entities";
import axios, { AxiosError } from "axios";
import { useFormik } from "formik";
import * as yup from "yup";

import { MultiSelect } from "@/components/common/form/select/multi";
import { Badge } from "@/components/ui/badge";
import { Option } from "@/types/common";
import { useMemo } from "react";
import { toast } from "sonner";
import useSWR, { useSWRConfig } from "swr";
import EditProfileIcon from "../../profile/EditProfileIcon";
import { cn } from "@/utils/tailwind-merge";

interface EditChallengeModalProps {
  project: Projects;
}

const EditChallengeModal = (props: EditChallengeModalProps) => {
  const { project } = props;
  const { mutate } = useSWRConfig();

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
        label: role.challenge_name,
      }));

      return options;
    } catch (error) {
      console.log(error);
      return [];
    }
  };

  const { data: hackathonChallenges, isLoading: isFetchingChallenges } = useSWR<
    Option[]
  >(
    `/api/hackathons/${project?.hackathon_id}/challenges`,
    fetchHackathonChallenges,
    {}
  );

  const schema = yup.object({
    challenge_ids: yup.array().of(yup.string()).min(1).required(),
    project_code_type: yup
      .string()
      .oneOf(
        ["fresh_code", "existing_code"],
        "Project code type must be either 'fresh_code' or 'existing_code'"
      )
      .required("Project code type is required"),
  });

  const initialValues = useMemo(() => {
    const challenges = project?.project_challenges ?? [];

    return {
      challenge_ids: challenges.map((item) => item?.challenge_id!) ?? [],
      project_code_type: project.project_code_type,
    };
  }, [project?.project_challenges]);

  const formik = useFormik({
    initialValues,
    validationSchema: schema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      setSubmitting(true);

      try {
        await axios.patch(`/api/projects/${project?.id}`, values);

        mutate(`/api/projects/${project?.id}`);

        toast.success("Updated Challenge Information Successfully", {
          position: "top-right",
        });

        onClose();
      } catch (error: any) {
        console.log("Error updating Project header information:", error);

        setSubmitting(false);

        if (error instanceof AxiosError) {
          toast.error(
            `Could not Update Project Header Information ${error?.response?.data?.error}`,
            {
              position: "top-right",
            }
          );

          return;
        }

        toast.error(
          `Could not Update Project Header Information  ${error?.message}`,
          {
            position: "top-right",
          }
        );
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <GenericModal
      controls={{
        isOpen,
        onClose,
        onOpen,
      }}
      trigger={
        <div>
          <EditProfileIcon />
        </div>
      }
    >
      <DialogHeader className="bg-[#1B1B22] py-2">
        <DialogTitle className="!text-[24px] font-semibold">
          Edit Project Details
        </DialogTitle>
      </DialogHeader>

      <form
        onSubmit={formik.handleSubmit}
        className="flex flex-col gap-3 mt-6 "
      >
        <div className="md:min-h-[400px] flex flex-col gap-6">
          <MultiSelect
            options={hackathonChallenges ?? []}
            isLoading={isFetchingChallenges}
            placeholder="What challenge(s) are you submitting this project for?"
            value={formik.values.challenge_ids}
            isAsync
            onChange={(selectedValues) => {
              formik.setFieldValue("challenge_ids", selectedValues);
            }}
          />

          <div className="flex flex-col gap-3">
            <p className="font-roboto font-normal text-secondary-text text-sm">
              Fresh Code or Existing Code?
            </p>

            <div className="flex gap-3">
              <div className="flex items-center gap-4">
                <Badge
                  onClick={() =>
                    formik.setFieldValue("project_code_type", "fresh_code")
                  }
                  className={cn(
                    "!bg-transparent border !border-white px-4 h-8 rounded-full text-sm font-roboto font-normal !text-white whitespace-nowrap cursor-pointer transition-all duration-200 ease-in-out",

                    formik.values.project_code_type === "fresh_code" &&
                      "!bg-white !text-tertiary-text"
                  )}
                >
                  Fresh Code
                </Badge>

                <Badge
                  onClick={() =>
                    formik.setFieldValue("project_code_type", "existing_code")
                  }
                  className={cn(
                    "!bg-transparent border !border-white px-4 h-8 rounded-full text-sm font-roboto font-normal !text-white whitespace-nowrap cursor-pointer transition-all duration-200 ease-in-out",

                    formik.values.project_code_type === "existing_code" &&
                      "!bg-white !text-tertiary-text"
                  )}
                >
                  Existing Code
                </Badge>
              </div>
            </div>

            {formik.errors.project_code_type && (
              <p
                className="text-red-500 text-xs font-medium capitalize font-roboto"
                role="alert"
              >
                {formik.errors.project_code_type}
              </p>
            )}
          </div>
        </div>

        <div className="w-full flex sm:justify-end justify-center mt-4">
          <Button
            type="submit"
            className="w-fit font-roboto text-sm gap-2"
            disabled={!formik.dirty || !formik.isValid || formik.isSubmitting}
          >
            {formik.isSubmitting && <Spinner size="small" />} Save
          </Button>
        </div>
      </form>
    </GenericModal>
  );
};

export default EditChallengeModal;
