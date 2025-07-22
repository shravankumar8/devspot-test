import { Button } from "@/components/ui/button";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import GenericModal from "@/components/ui/generic-modal";
import { Spinner } from "@/components/ui/spinner";
import UseModal from "@/hooks/useModal";
import { Projects } from "@/types/entities";
import axios, { AxiosError } from "axios";
import { useFormik } from "formik";
import { toast } from "sonner";
import { useSWRConfig } from "swr";
import EditProfileIcon from "../../profile/EditProfileIcon";
import Label from "@/components/common/form/label";
import { TextArea } from "@/components/common/form/textarea";

interface EditProjectAboutModalProps {
  project: Projects;
}

const EditProjectAboutModal = (props: EditProjectAboutModalProps) => {
  const { project } = props;
  const { mutate } = useSWRConfig();

  const { closeModal: onClose, isOpen, openModal: onOpen } = UseModal();

  const formik = useFormik({
    initialValues: {
      description:
        project?.description ?? undefined,

    },
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      setSubmitting(true);

      try {
        await axios.patch(`/api/projects/${project?.id}`, values);

        mutate(`/api/projects/${project?.id}`);

        toast.success("Updated Project About Information Successfully", {
          position: "top-right",
        });

        onClose();
        resetForm();
      } catch (error: any) {
        console.log("Error updating Project About information:", error);

        setSubmitting(false);

        if (error instanceof AxiosError) {
          toast.error(
            `Could not Update Project About Information ${error?.response?.data?.error}`,
            {
              position: "top-right",
            }
          );

          return;
        }

        toast.error(
          `Could not Update Project About Information  ${error?.message}`,
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
          Edit About
        </DialogTitle>
      </DialogHeader>

      <form
        onSubmit={formik.handleSubmit}
        className="flex flex-col"
      >
        <div className="flex flex-col gap-5 md:h-[400px] overflow-y-scroll pb-5">


          <div className="flex w-full flex-col gap-3">
            <Label>What is your project about?</Label>

            <TextArea
              required
              name="description"
              label="description"
              placeholder='A couple sentences about your project.'
              maxWordLength={250}
              value={formik.values.description}
              onChange={formik.handleChange}
              error={formik.errors.description}
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

export default EditProjectAboutModal;
