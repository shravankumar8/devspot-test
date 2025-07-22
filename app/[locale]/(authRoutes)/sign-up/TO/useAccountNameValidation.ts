import { useState, useCallback } from "react";

export function useAccountValidation() {
  const [isValidating, setIsValidating] = useState(false);

  const checkAccountExists = useCallback(
    async (accountName: string): Promise<boolean> => {
      if (!accountName || accountName.length < 3) return false;

      setIsValidating(true);
      try {
        const res = await fetch(
          `/api/technology-owners/search?search_term=${encodeURIComponent(
            accountName
          )}`
        );
        const data = await res.json();
        return data?.data?.length > 0;
      } catch (err) {
        console.error("Account validation error:", err);
        return false;
      } finally {
        setIsValidating(false);
      }
    },
    []
  );

  return { checkAccountExists, isValidating };
}
