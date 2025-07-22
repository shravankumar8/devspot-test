import { useCallback, useState } from "react";

interface UseStakingOptions {
  hackathonId: number;
  onSuccess?: (stakeId: string) => void;
  onError?: (error: string) => void;
  primaryWallet: { address: string };
}

export function useStaking({
  hackathonId,
  onSuccess,
  onError,
  primaryWallet,
}: UseStakingOptions) {
  const [isLoading, setIsLoading] = useState(false);
  const [stakeStatus, setStakeStatus] = useState<
    "idle" | "pending" | "confirmed" | "failed"
  >("idle");

  const initiateStake = useCallback(async () => {
    // if (!primaryWallet?.address || !user) {
    //   onError?.("Wallet not connected");
    //   return;
    // }

    setIsLoading(true);
    setStakeStatus("pending");

    try {
      const response = await fetch(`/api/hackathons/${hackathonId}/stake`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create stake");
      }

      // Open Coinbase Commerce checkout
      window.open(data.hostedUrl, "_blank", "width=600,height=700");

      // Poll for transaction status
      const pollStatus = async () => {
        const statusResponse = await fetch(
          `/api/hackathons/${hackathonId}/stake`
        );
        const statusData = await statusResponse.json();
        console.log({statusData})

        if (statusData.stake?.status === "confirmed") {
          setStakeStatus("confirmed");
          onSuccess?.(statusData.stake.id);
          return;
        }

        if (statusData.stake?.status === "failed") {
          setStakeStatus("failed");
          onError?.("Transaction failed");
          return;
        }

        // Continue polling if still pending
        if (statusData.stake?.status === "pending") {
          setTimeout(pollStatus, 3000);
        }
      };

      // Start polling after a short delay
      setTimeout(pollStatus, 5000); 
    } catch (error) {
      setStakeStatus("failed");
      onError?.(error instanceof Error ? error.message : "Unknown error");
    } finally {
      setIsLoading(false);
    }
  }, [hackathonId, primaryWallet?.address, onSuccess, onError]);

  const checkStakeStatus = useCallback(async () => {
    try {
      const response = await fetch(`/api/hackathons/${hackathonId}/stake`);
      const data = await response.json();

      if (data.stake) {
        setStakeStatus(data.stake.status);
        return data.stake;
      }

      return null;
    } catch (error) {
      console.error("Error checking stake status:", error);
      return null;
    }
  }, [hackathonId]);

  return {
    isLoading,
    stakeStatus,
    initiateStake,
    checkStakeStatus,
  };
}
