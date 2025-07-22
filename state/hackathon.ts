import { Hackathons } from "@/types/entities";
import { create } from "zustand";

interface IHackathonStateType {
  selectedHackathon: Hackathons | null;
  setSelectedHackathon: (hackathon: Hackathons) => void;
  isLoading: boolean;
  setIsLoading: (value: boolean) => void;
}
interface ITechOwnerStateType {
  following: boolean;
  setFollowing: (value: boolean) => void;
}

interface IChallengeType {
  activeTab: string;
  setActiveTab: (value: string) => void;
}

export const useTechOwner = create<ITechOwnerStateType>((set) => ({
  following: false,
  setFollowing: (following) => set({ following: following }),
}));

export const useHackathonStore = create<IHackathonStateType>((set) => ({
  selectedHackathon: null,
  isLoading: false,
  setIsLoading: (data) => set({ isLoading: data }),
  setSelectedHackathon: (hackathon) =>
    set(() => ({ selectedHackathon: hackathon })),

  hackathonParticipants: {
    items: [],
    pageNumber: 0,
    totalItems: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  },
}));

export const useChallengeStore = create<IChallengeType>((set) => ({
  activeTab: "",
  setActiveTab: (activeTab) => set(() => ({ activeTab })),
}));
