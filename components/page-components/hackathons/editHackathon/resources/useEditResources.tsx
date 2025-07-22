import { useTechOwnerStore } from "@/state/techOwnerStore";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import useSWR, { mutate } from "swr";

interface Challenge {
  challenge_id: number;
  hackathon_challenges: {
    challenge_name: string;
  };
}

interface Sponsor {
  logo: string;
  name: string;
}

interface Resource {
  id: number;
  title: string;
  url: string | null;
  description: string | null;
  type: string | null;
  technologies: string[];
  sponsors: Sponsor[];
  has_external_link: boolean;
  is_downloadable: boolean;
  challenge_id: number | null;
  hackathon_resource_challenges: Challenge[];
  challenges: string[];
  created_at: string;
  updated_at: string;
  hackathon_id: number;
  clicks: number;
}

interface FormResource extends Omit<Resource, "hackathon_resource_challenges"> {
  challengeIds: number[];
  tempFile?: File;
}

export const useHackathonResources = (hackathonId: number) => {
  const [resources, setResources] = useState<FormResource[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const { selectedOrg } = useTechOwnerStore();

  const fetchResources = async (url: string) => {
    try {
      const { data } = await axios.get(url);

      const formattedResources = data.data?.map((resource: Resource) => ({
        ...resource,
        challengeIds:
          resource.hackathon_resource_challenges?.map((c) => c.challenge_id) ||
          [],
        tempFile: undefined,
      }));
      setResources(formattedResources);

      return formattedResources;
    } catch (error) {
      console.error("Error fetching resources:", error);
      toast.error("Failed to load resources");
    }
  };

  const { mutate: resourcesMutate, data } = useSWR(
    `/api/hackathons/${hackathonId}/resources`,
    fetchResources
  );

  useEffect(() => {
    resourcesMutate();
  }, [hackathonId]);

  const addNewResource = () => {
    const newResource: FormResource = {
      id: Date.now(), // Temporary negative ID for new resources
      title: "",
      description: null,
      url: null,
      type: null,
      technologies: [],
      sponsors: [],
      has_external_link: false,
      is_downloadable: false,
      challenge_id: null,
      challenges: [],
      challengeIds: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      hackathon_id: hackathonId,
      clicks: 0,
    };
    setResources([...resources, newResource]);
  };

  const updateResourceField = <K extends keyof FormResource>(
    id: number,
    field: K,
    value: FormResource[K]
  ) => {
    setResources((prev) =>
      prev.map((resource) =>
        resource.id === id ? { ...resource, [field]: value } : resource
      )
    );
  };

  const uploadFile = async (file: File): Promise<string> => {
    const formData = new FormData();
    const isVideo = file.type.includes("video");
    formData.append(isVideo ? "video" : "image", file);

    try {
      const { data } = await axios.post<{ data: { public_url: string } }>(
        `/api/technology-owners/${selectedOrg?.technology_owner_id}/hackathons/${hackathonId}/edit/resources/upload-file`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      return data?.data?.public_url;
    } catch (error) {
      console.error("File upload failed:", error);
      throw error;
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const processedResources = await Promise.all(
        resources.map(async (resource) => {
          let finalUrl = resource.url;

          if (resource.is_downloadable && resource.tempFile) {
            finalUrl = await uploadFile(resource.tempFile);
          }

          return {
            id: resource?.id ?? undefined,
            title: resource?.title ?? undefined,
            type: resource?.type ?? undefined,
            technologies: resource?.technologies ?? [],
            url: finalUrl || "",
            challengeIds: resource.challengeIds.map((id) => id),
            is_downloadable: resource.is_downloadable ?? false,
          };
        })
      );

      await axios.put(
        `/api/technology-owners/${selectedOrg?.technology_owner_id}/hackathons/${hackathonId}/edit/resources`,
        processedResources
      );

      resourcesMutate();
      mutate(`/api/hackathons/${hackathonId}/overview`);

      toast.success("Resources updated successfully");
      return true;
    } catch (error) {
      console.error("Submission failed:", error);
      toast.error("Failed to update resources");
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  const deleteResource = (id: number) => {
    setResources(resources.filter((r) => r.id !== id));
  };

  return {
    resources,
    addNewResource,
    updateResourceField,
    deleteResource,
    handleSubmit,
    submitting,
  };
};
