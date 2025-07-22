import Label from "@/components/common/form/label";
import { Button } from "@/components/ui/button";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import GenericModal from "@/components/ui/generic-modal";
import { Spinner } from "@/components/ui/spinner";
import UseModal from "@/hooks/useModal";
import { Projects } from "@/types/entities";
import axios, { AxiosError } from "axios";
import { useState } from "react";
import { toast } from "sonner";
import { useSWRConfig } from "swr";
import EditProfileIcon from "../../profile/EditProfileIcon";
import { initialTechnology } from "../../profile/SkillsAndTechnologies/list";
import SkillsDropdown from "../../profile/SkillsAndTechnologies/SkillsDropdown";
import SuggestTagPopover from "../../profile/SkillsAndTechnologies/SuggestTagPopover";
interface EditProjectTechnologyModalProps {
  project: Projects;
}

const EditProjectTechnologyModal = (props: EditProjectTechnologyModalProps) => {
  const { project } = props;

  const { mutate } = useSWRConfig();
  const [query, setQuery] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { closeModal: onClose, isOpen, openModal: onOpen } = UseModal();
  const [selectedTechnolgies, setSelectedTechnolgies] = useState<string[]>(
    project?.technologies || []
  );

  const handleSubmit = async () => {
    setSubmitting(true);

    try {
      const payload = {
        technologies: selectedTechnolgies,
      };
      await axios.patch(`/api/projects/${project?.id}`, payload);

      mutate(`/api/projects/${project?.id}`);

      toast.success("Updated Project Technology Information Successfully", {
        position: "top-right",
      });

      onClose();
    } catch (error: any) {
      console.log("Error updating Project Technology information:", error);

      setSubmitting(false);

      if (error instanceof AxiosError) {
        toast.error(
          `Could not Update Project Technology Information ${error?.response?.data?.error}`,
          {
            position: "top-right",
          }
        );

        return;
      }

      toast.error(
        `Could not Update Project Technology Information  ${error?.message}`,
        {
          position: "top-right",
        }
      );
    } finally {
      setSubmitting(false);
    }
  };

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
          Edit technologies Links
        </DialogTitle>
      </DialogHeader>

      <div className="flex flex-col gap-5 md:h-[400px] overflow-y-scroll pb-5">
        <div className="flex w-full flex-col gap-3">
          <Label>Technologies</Label>

          <div className="mt-4 pb-4 mb-3 border-b border-b-[#D0D0D1]/10">
            <SkillsDropdown
              options={initialTechnology}
              placeholder="Add new Technology"
              selected={selectedTechnolgies}
              query={query}
              skillType="technologies"
              setQuery={setQuery}
              setSelected={setSelectedTechnolgies}
            />
          </div>
        </div>

        <SuggestTagPopover />
      </div>

      <div className="w-full flex sm:justify-end justify-center mt-4">
        <Button
          type="submit"
          className="w-fit font-roboto text-sm gap-2"
          onClick={handleSubmit}
          disabled={submitting}
        >
          {submitting && <Spinner size="small" />} Save
        </Button>
      </div>
    </GenericModal>
  );
};

export default EditProjectTechnologyModal;
