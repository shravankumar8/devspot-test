import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import useSWR from "swr";

// Types
interface MultiProjectData {
  multi_projects: boolean;
}

interface UseMultiProjectToggleResult {
  isMultiProjectEnabled: boolean;
  isLoading: boolean;
  isToggling: boolean;
  error: Error | null;
  toggleMultiProjects: () => Promise<void>;
}

// Custom hook for multi-project toggle logic
export const useMultiProjectToggle = (
  hackathonId: string | number
): UseMultiProjectToggleResult => {
  const [isToggling, setIsToggling] = useState(false);
  const [pendingState, setPendingState] = useState<boolean | null>(null);

  const apiUrl = `/api/hackathons/${hackathonId}/toggle-multi-projects`;

  const fetchJudgingsData = async (url: string) => {
    const resp = await axios.get(url);
    return resp.data;
  };

  const { data, error, isLoading, mutate } = useSWR<MultiProjectData>(
    apiUrl,
    fetchJudgingsData,
    {
      revalidateOnFocus: false,
      errorRetryCount: 3,
    }
  );

  const isMultiProjectEnabled = pendingState ?? data?.multi_projects ?? false;

  const toggleMultiProjects = async (): Promise<void> => {
    if (isToggling || isLoading) return;

    const newValue = !data?.multi_projects;

    // Optimistic update
    setPendingState(newValue);
    setIsToggling(true);

    try {
      await axios.put(`${apiUrl}?value=${newValue}`);
      await mutate(); // Revalidate data
      setPendingState(null);
    } catch (error) {
      // Rollback optimistic update
      setPendingState(null);
      await mutate();

      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to toggle Multi Projects. Please try again later.";

      toast.error(errorMessage);
      console.error("Toggle multi-projects error:", error);
    } finally {
      setIsToggling(false);
    }
  };

  // Reset pending state when data changes
  useEffect(() => {
    if (data?.multi_projects !== undefined) {
      setPendingState(null);
    }
  }, [data?.multi_projects]);

  return {
    isMultiProjectEnabled,
    isLoading,
    isToggling,
    error,
    toggleMultiProjects,
  };
};
