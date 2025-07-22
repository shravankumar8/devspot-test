import { IHackathonData, UserHackathon } from "@/types/hackathons";
import { Session, User } from "@supabase/supabase-js";
import axios from "axios";
import { create } from "zustand";

interface SigupDataState {
  ActiveStep: number;
  selectedDescription: string[];
  connectedAccount: string[];
  personalInfo: { name: string; email: string };
  regComplete: boolean;

  setActiveStep: (step: number) => void;
  setSelectedDescription: (description: string[]) => void;
  setConnectedAccount: (account: string[]) => void;
  setPersonalInfo: (info: { name: string; email: string }) => void;
  setRegComplete: (complete: boolean) => void;
  fetchRoles: () => Promise<void>;
  userId: string;
  setUserId: (id: string) => void;
}
interface UserData {
  isLoggedIn: boolean;
  userData: User | null;
  setUserData: (data: User | null) => void;
  hackathonData: IHackathonData[];
  setHackathonData: (hackathonData: IHackathonData) => void;
  currentUserData: {
    name: string;
    role: string;
    imgUrl: string;
    openfor: { work: boolean; project: boolean };
    devTokens: number;
  } | null;
  currentStage:
    | "not-applied"
    | "applied"
    | "joined"
    | "pending"
    | "tokens"
    | "";
  activeProfileTab: string;
  userHackathons: UserHackathon[];
  addUserHackathon: (hackathon: UserHackathon) => void;
  updateUserHackathon: (
    hackathonId: string,
    updates: Partial<UserHackathon>
  ) => void;
  removeUserHackathon: (hackathonId: string) => void;

  setActiveProfileTab: (activeProfileTab: string) => void;
  setCurrentStage: (
    currentStage: "not-applied" | "applied" | "joined" | "pending"
  ) => void;
  setIsLoggedIn: (isLoggedIn: boolean) => void;
}

export const useUserStore = create<UserData>((set) => ({
  isLoggedIn: false,
  userData: null,
  currentUserData: {
    name: "Russel French",
    role: "Developer",
    imgUrl: "/profile_image.png",
    openfor: { work: true, project: true },
    devTokens: 100,
  },
  currentStage: "not-applied",
  activeProfileTab: "projects",
  userHackathons: [],
  hackathonData: [],

  addUserHackathon: (hackathon) =>
    set((state) => {
      // Check if hackathon already exists
      const exists = state.userHackathons.some(
        (h) => h.hackathonId === hackathon.hackathonId
      );

      if (exists) {
        return state;
      }

      return {
        userHackathons: [...state.userHackathons, hackathon],
      };
    }),

  updateUserHackathon: (hackathonId, updates) =>
    set((state) => ({
      userHackathons: state.userHackathons.map((hackathon) =>
        hackathon.hackathonId === hackathonId
          ? { ...hackathon, ...updates }
          : hackathon
      ),
    })),

  removeUserHackathon: (hackathonId) =>
    set((state) => ({
      userHackathons: state.userHackathons.filter(
        (hackathon) => hackathon.hackathonId !== hackathonId
      ),
    })),

  setActiveProfileTab: (activeProfileTab) => set(() => ({ activeProfileTab })),
  setHackathonData: (data) =>
    set((state) => ({ hackathonData: state.hackathonData })),
  setIsLoggedIn: (isLoggedIn) => set(() => ({ isLoggedIn })),
  setCurrentStage: (currentStage) => set(() => ({ currentStage })),
  setUserData: (data) => set(() => ({ userData: data })),
}));

export const useSignupStore = create<SigupDataState>((set) => ({
  ActiveStep: 1,
  selectedDescription: [],
  connectedAccount: [],
  personalInfo: { name: "", email: "" },
  regComplete: false,
  userId: "",

  setActiveStep: (step) => set(() => ({ ActiveStep: step })),
  setSelectedDescription: (description) =>
    set(() => ({ selectedDescription: description })),
  setConnectedAccount: (account) => set(() => ({ connectedAccount: account })),
  setPersonalInfo: (info) => set(() => ({ personalInfo: info })),
  setRegComplete: (complete) => set(() => ({ regComplete: complete })),
  setUserId: (id) => set(() => ({ userId: id })),
  fetchRoles: async () => {
    // set({ isLoading: true });
    try {
      const response = await axios.get("/api/profile/roles");
      console.log(response);
      set({ selectedDescription: response.data?.roles });
    } catch (error) {
      console.log(error);
      console.error("Error fetching roles:", error);
    }
  },
}));

interface AuthState {
  session: Session | null;
  user: User | null;
  isLoading: boolean;
  setSession: (session: Session | null) => void;
  fetchSession: () => Promise<void>;
  devAccountSuccess: boolean;
  setdevAccountSuccess: (devAccountSuccess: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  session: null,
  user: null,
  isLoading: true,
  devAccountSuccess: false,
  setdevAccountSuccess: (devAccountSuccess) =>
    set(() => ({ devAccountSuccess })),
  setSession: (session) => {
    set({ session, user: session?.user || null });
  },

  fetchSession: async () => {
    set({ isLoading: true });

    try {
      const res = await fetch("/api/auth/session");
      if (res.ok) {
        const { session } = await res.json();
        set({ session, isLoading: false, user: session?.user || null });
      } else {
        set({ session: null, isLoading: false });
      }
    } catch (error) {
      console.log(error);
      console.error("Error fetching session:", error);
      set({ session: null, isLoading: false });
    }
  },
}));

// #region Judging Store
interface JudgingState {
  isJudgingToolOpen: boolean;
  setIsJudgingToolOpen: (isOpen: boolean) => void;
}

export const useJudgingStore = create<JudgingState>((set) => ({
  isJudgingToolOpen: false,
  setIsJudgingToolOpen: (isOpen) => set(() => ({ isJudgingToolOpen: isOpen })),
}));

// #endregion
