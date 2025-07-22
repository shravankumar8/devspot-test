import { LeaderboardEntry } from "@/components/page-components/TODashboard/prizes/leaderboard/Preview";
import { create } from "zustand";

interface PreviewAssignment {
  prizeId: number;
  projectId: number;
  projectData?: LeaderboardEntry;
  isPreview: boolean;
}

interface PreviewState {
  previewAssignments: Record<number, PreviewAssignment[]>; // key: challengeId
  setPreviewAssignment: (
    challengeId: number,
    assignment: PreviewAssignment
  ) => void;
  removePreviewAssignment: (challengeId: number, prizeId: number) => void;
}

export const usePreviewStore = create<PreviewState>((set) => ({
  previewAssignments: {},
  setPreviewAssignment: (challengeId, assignment) =>
    set((state) => {
      const currentAssignments = state.previewAssignments[challengeId] || [];
      const existingIndex = currentAssignments.findIndex(
        (a) => a.prizeId === assignment.prizeId
      );

      return {
        previewAssignments: {
          ...state.previewAssignments,
          [challengeId]:
            existingIndex >= 0
              ? currentAssignments.map((a) =>
                  a.prizeId === assignment.prizeId ? assignment : a
                )
              : [...currentAssignments, assignment],
        },
      };
    }),
  removePreviewAssignment: (challengeId, prizeId) =>
    set((state) => ({
      previewAssignments: {
        ...state.previewAssignments,
        [challengeId]: (state.previewAssignments[challengeId] || []).filter(
          (a) => a.prizeId !== prizeId
        ),
      },
    })),
}));
