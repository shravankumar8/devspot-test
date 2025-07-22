import { create } from "zustand";

interface ProjectCreationType {
  hackathonName: string;
  projectUrl?: string | null;
}

interface ProjectState {
  projectCreation: ProjectCreationType | null;
  setProjectCreation: (val: ProjectCreationType | null) => void;
}

export const useProjectStore = create<ProjectState>((set) => ({
  projectCreation: null,
  setProjectCreation: (val: ProjectCreationType | null) =>
    set({ projectCreation: val }),
}));
