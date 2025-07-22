import { BACKGROUND_COLORS } from "@/components/page-components/projects/constants/bacakground";
import { useTechOwnerStore } from "@/state/techOwnerStore";
import { Hackathons } from "@/types/entities";
import axios from "axios";
import { useFormik } from "formik";
import { useCallback, useMemo } from "react";
import { toast } from "sonner";
import { useSWRConfig } from "swr";

interface UseHackathonFormProps {
  hackathon: Hackathons;
  onClose: () => void;
  selectedTechnologies: string[];
}

export const useHackathonForm = ({
  hackathon,
  onClose,
  selectedTechnologies,
}: UseHackathonFormProps) => {
  const { mutate } = useSWRConfig();
  const { selectedOrg } = useTechOwnerStore();


  const initialValues = useMemo(() => {
    let selectedBackgroundIndex = null;
    if (hackathon?.banner_url) {
      selectedBackgroundIndex = BACKGROUND_COLORS.indexOf(hackathon.banner_url);
    } else {
      selectedBackgroundIndex = 0;
    }

    return {
      name: hackathon?.name || "Untitled project",
      banner_url: hackathon?.banner_url,
      banner_file: null as File | null,
      avatar_url: hackathon?.avatar_url,
      avatar_file: null as File | null,
      selectedBackgroundIndex:
        selectedBackgroundIndex === -1 ? null : selectedBackgroundIndex,
    };
  }, [hackathon]);

  const handleSubmit = useCallback(
    async (values: typeof initialValues, { setSubmitting, resetForm }: any) => {
      setSubmitting(true);

      try {
        const { avatar_file, banner_file, name, banner_url, avatar_url } =
          values;

        const formData = new FormData();
        if (name) {
          formData.append("name", name);
        }

        if (avatar_file || avatar_url) {
          formData.append("hackathon_logo", avatar_file ?? avatar_url);
        }

        if (banner_file || banner_url) {
          formData.append("hackathon_header", banner_file ?? banner_url);
        }

        formData.append("technologies", selectedTechnologies.join(","));

        await axios.put(
          `/api/technology-owners/${selectedOrg?.technology_owner_id}/hackathons/${hackathon?.id}/edit/header`,
          formData
        );
        mutate(`/api/hackathons/${hackathon?.id}`);

        toast.success("Updated Header Information Successfully", {
          position: "top-right",
        });

        onClose();
        resetForm();
      } catch (error: any) {
        console.error("Error updating header information:", error);
        toast.error(`Could not Update Header Information ${error?.message}`, {
          position: "top-right",
        });
      } finally {
        setSubmitting(false);
      }
    },
    [hackathon?.id, selectedTechnologies, mutate, onClose]
  );

  return useFormik({
    initialValues,
    onSubmit: handleSubmit,
  });
};
