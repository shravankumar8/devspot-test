import { Hackathons } from "@/types/entities";
import { TechnologyOrganization } from "@/types/profile";
import { create } from "zustand";

interface TechOwnerState {
  selectedOrg: TechnologyOrganization | null;
  setSelectedOrg: (org: TechnologyOrganization | null) => void;
  selectedHackathon: Hackathons | null;
  setSelectedHackathon: (hackathon: Hackathons) => void;
}

export const useTechOwnerStore = create<TechOwnerState>((set) => ({
  selectedOrg: null,
  setSelectedOrg: (org) => set({ selectedOrg: org }),
  selectedHackathon: null,
  setSelectedHackathon: (hackathon) => set({ selectedHackathon: hackathon }),
}));
