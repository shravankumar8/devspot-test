import { Button } from "@/components/ui/button";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import GenericModal from "@/components/ui/generic-modal";

import Label from "@/components/common/form/label";
import { WebsiteLink } from "@/components/icons/Location";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import UseModal from "@/hooks/useModal";
import { Projects } from "@/types/entities";
import axios, { AxiosError } from "axios";
import { useFormik } from "formik";
import { toast } from "sonner";
import { useSWRConfig } from "swr";
import * as Yup from "yup";
import EditProfileIcon from "../../profile/EditProfileIcon";
import {
  formatGitHubUrl,
  isGithubRepo,
  repoContainsCode,
  repositoryExists,
  validateProjectRepo,
} from "../ProgressFooter/repoValidation";

interface EditProjectLinksModalProps {
  project: Projects;
}

const EditProjectLinksModal = (props: EditProjectLinksModalProps) => {
  const { project } = props;
  const { mutate } = useSWRConfig();

  const { closeModal: onClose, isOpen, openModal: onOpen } = UseModal();

  const validationSchema = Yup.object().shape({
    project_url: Yup.string()
      .url("Project URL must be a valid URL")
      .notRequired()
      .nullable()
      .test(
        "is-github-repo",
        "Must be a valid GitHub repository URL (e.g., https://github.com/owner/repo)",
        (value) => {
          if (!value) return false;
          return isGithubRepo(value);
        }
      )
      .test(
        "repository-exists",
        "GitHub repository must be accessible and public",
        async (value) => {
          if (!value || !isGithubRepo(value)) return false;
          return await repositoryExists(value);
        }
      )
      .test(
        "repo-contains-code",
        "GitHub repository is empty or contains no code",
        async (value) => {
          if (!value || !isGithubRepo(value)) return false;
          return await repoContainsCode(value);
        }
      ),

    demo_url: Yup.string()
      .url("Demo URL must be a valid URL")
      .notRequired()
      .nullable(),
  });

  const formik = useFormik({
    initialValues: {
      project_url: project?.project_url ?? undefined,
      demo_url: project?.demo_url ?? undefined,
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      setSubmitting(true);

      if (values.project_url) {
        const validation = await validateProjectRepo(values.project_url);

        if (!validation.isValid) {
          toast.error(validation.error, {
            position: "top-right",
          });

          setSubmitting(false);

          return;
        }
      }

      try {
        await axios.patch(`/api/projects/${project?.id}`, {
          ...values,
          project_url: values?.project_url
            ? formatGitHubUrl(values.project_url)
            : undefined,
        });

        mutate(`/api/projects/${project?.id}`);

        toast.success("Updated Project Link Information Successfully", {
          position: "top-right",
        });

        onClose();
        resetForm();
      } catch (error: any) {
        console.log("Error updating Project Link information:", error);

        setSubmitting(false);

        if (error instanceof AxiosError) {
          toast.error(
            `Could not Update Project Link Information ${error?.response?.data?.error}`,
            {
              position: "top-right",
            }
          );

          return;
        }

        toast.error(
          `Could not Update Project Link Information  ${error?.message}`,
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
          Edit Project Links
        </DialogTitle>
      </DialogHeader>

      <form onSubmit={formik.handleSubmit} className="flex flex-col">
        <div className="flex flex-col gap-5 md:h-[400px] overflow-y-scroll pb-5">
          <div className="flex w-full flex-col gap-3">
            <Label>
              Please provide your project’s GitHub repository or a link to the
              source code (must be public).
              Format: https://github.com/owner/repo
            </Label>

            <Input
              id="project_url"
              name="project_url"
              placeholder="https://github.com/your-project"
              height="20px"
              value={formik.values.project_url ?? ""}
              className="font-roboto text-sm"
              prefixIcon={<WebsiteLink color="#4E52F5" />}
              onChange={formik.handleChange}
              error={formik.errors.project_url}
            />
          </div>

          <div className="flex w-full flex-col gap-3">
            <Label>
              A link to a live demo of your project is required for submission.
            </Label>

            <Input
              id="demo_url"
              name="demo_url"
              placeholder="https://myusername.github.io/myproject/"
              height="20px"
              value={formik.values.demo_url ?? ""}
              className="font-roboto text-sm"
              prefixIcon={<WebsiteLink color="#4E52F5" />}
              onChange={formik.handleChange}
              error={formik.errors.demo_url}
            />
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

export default EditProjectLinksModal;
