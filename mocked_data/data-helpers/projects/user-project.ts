import { ProjectDetails } from "@/types/projects";

export const UserProjectData: ProjectDetails = {
  tagline: null,
  project_name: null,
  description: null,
  looking_for_team_members: true,
  technollogies: [],
  logo_url: null,
  date_created: "May 9, 2025",
  challenge_ids: [],
  hackathon_name: "Quantum Shift",
  challenge_name: "Open & Sovereign Systems",
  header_url: null,
  feedbackQuestions: [
    { id: "1", question: "Overall experience" },
    { id: "2", question: "User experience" },
    { id: "3", question: "Support experience" },
  ],
  project_links: [
    { label: "Repo", url: "", id: "12" },
    { label: "Demo", id: "11", url: "" },
    { label: "Video", id: "14", url: "" },
  ],
  team_members: [
    {
      avatar_url: "",
      prize_allocated: 50,
      email: "john@gmail.com",
      full_name: "Russel French",
      id: "2",
      role: "Designer",
    },
  ],
};
