import {
  DiscussionThread,
  Hackathon,
  ProjectDataType,
  TransactionDataType,
} from "@/types/profile";

const today = new Date();

export const projects: ProjectDataType[] = [
  {
    id: "gramara",
    title: "Gramara",
    mission: "Mission:Unite hackathon",
    description:
      "AI grammar checker that works 1000% better for non-fluent English writers (see a side-by-side comparison with Grammarly, LanguageTool and Google Docs in the screenshots) Gramara uses the latest NLP technology to increase the fluency and clarity of your writing.",
    logo: "/project1.png",
    teamSize: 5,
    hasTrophy: true,
    tags: ["API Development", "Mobile Applications"],
    contributors: [
      { name: "Emmanuel", pic: "/contributors.png" },
      { name: "Emmanuel", pic: "/contributors.png" },
      { name: "Emmanuel", pic: "/contributors.png" },
      { name: "Emmanuel", pic: "/contributors.png" },
      { name: "Emmanuel", pic: "/contributors.png" },
    ],
  },
  {
    id: "notebag",
    title: "NoteBag",
    mission: "Mission:Unite hackathon",
    description:
      "Notebag is a note taking app you can use entirely from your keyboard. It is built from the ground up to be there when you need it and carefully hidden away when you don't. It brings along amazing features such as note linking, instant preview and an omnibar.",
    logo: "/project2.png",
    teamSize: 2,
    hasTrophy: true,
    tags: ["API Development", "Mobile Applications"],
    contributors: [
      { name: "Emmanuel", pic: "/contributors.png" },
      { name: "Emmanuel", pic: "/contributors.png" },
    ],
  },
  {
    id: "sitesauce",
    title: "Sitesauce",
    mission: "Mission:Unite hackathon",
    description:
      "Sitesauce converts your dynamic website (like a WordPress blog) into a static website in one click. It also keeps the site updated when your content changes. This will help you reduce server costs and page load times and increase scalability and security.",
    logo: "/project3.png",
    teamSize: 3,
    hasTrophy: false,
    tags: ["API Development", "Mobile Applications"],
    contributors: [
      { name: "Emmanuel", pic: "/contributors.png" },
      { name: "Emmanuel", pic: "/contributors.png" },
      { name: "Emmanuel", pic: "/contributors.png" },
    ],
  },
];

export const hackathons: Hackathon[] = [
  {
    id: "hr-2024",
    title: "HR Hackathon 2024",
    company: "Amazon",
    companyLogo: "/amazons.png",
    type: "in-person",
    location: "San Francisco, United States",
    startDate: "October 12, 2024",
    endDate: "October 24, 2024",
    participants: 19,
    status: "live",
  },
  {
    id: "mission-unite",
    title: "Mission:Unite hackathon",
    company: "Microsoft",
    companyLogo: "/microsoft_img.png",
    type: "virtual",
    location: "San Francisco, United States",
    startDate: "June 21, 2024",
    endDate: "June 23, 2024",
    participants: 135,
    status: "complete",
    hasProject: true,
  },
  {
    id: "mediathon",
    title: "MediaThon",
    company: "IBM",
    companyLogo: "/IBM.png",
    type: "in-person",
    location: "San Francisco, United States",
    startDate: "March 19, 2024",
    endDate: "March 20, 2024",
    participants: 39,
    status: "complete",
    hasProject: true,
  },
  {
    id: "mediathon",
    title: "MediaThon",
    company: "IBM",
    companyLogo: "/IBM.png",
    type: "in-person",
    location: "San Francisco, United States",
    startDate: "March 19, 2024",
    endDate: "March 20, 2024",
    participants: 39,
    status: "complete",
    hasProject: true,
  },
  {
    id: "mediathon",
    title: "MediaThon",
    company: "IBM",
    companyLogo: "/IBM.png",
    type: "in-person",
    location: "San Francisco, United States",
    startDate: "March 19, 2024",
    endDate: "March 20, 2024",
    participants: 39,
    status: "complete",
    hasProject: true,
  },
  {
    id: "mediathon",
    title: "MediaThon",
    company: "IBM",
    companyLogo: "/IBM.png",
    type: "in-person",
    location: "San Francisco, United States",
    startDate: "March 19, 2024",
    endDate: "March 20, 2024",
    participants: 39,
    status: "complete",
    hasProject: true,
  },
  {
    id: "mediathon",
    title: "MediaThon",
    company: "IBM",
    companyLogo: "/IBM.png",
    type: "in-person",
    location: "San Francisco, United States",
    startDate: "March 19, 2024",
    endDate: "March 20, 2024",
    participants: 39,
    status: "complete",
    hasProject: true,
  },
];

export const discussions: DiscussionThread[] = [
  {
    id: "fresh-code",
    title: "What is the Fresh Code Rule?",
    details:
      "[More details about the question/discussion topic from the original poster.]",
    date: "SEP 21, 2020 @ 1:00PM",
    author: {
      name: "Russel French",
      avatar: "/profile_image.png",
      role: "Senior Developer",
    },
    responseCount: 4,
  },
  {
    id: "participation",
    title: "Who Can Participate?",
    details:
      "[More details about the question/discussion topic from the original poster.]",
    date: "MAR 21, 2020 @ 12:00PM",
    author: {
      name: "Russel French",
      avatar: "/profile_image.png",
      role: "Senior Developer",
    },
    responseCount: 6,
  },
  {
    id: "azure-sessions",
    title:
      "What are the Pre-Microsoft Azure Virtual Hackathon Virtual Sessions?",
    details:
      "[More details about the question/discussion topic from the original poster.]",
    date: "MAY 21, 2020 @ 3:00PM",
    author: {
      name: "Russel French",
      avatar: "/profile_image.png",
      role: "Senior Developer",
    },
    responseCount: 3,
  },
];

export const TransactionsData: TransactionDataType[] = [
  {
    id: "1",
    description: "Hackathon Reward",
    amount: 140,
    date: today,
    type: "deposit",
  },
  // {
  //   id: "2",
  //   description: "Hackathon Reward",
  //   amount: 80,
  //   date: today,
  //   type: "deposit",
  // },
  // {
  //   id: "3",
  //   description: "Withdraw",
  //   amount: 120,
  //   date: today,
  //   type: "withdraw",
  // },
  // {
  //   id: "4",
  //   description: "Hackathon Reward",
  //   amount: 160,
  //   date: today,
  //   type: "deposit",
  // },
  // {
  //   id: "5",
  //   description: "Withdraw made",
  //   amount: 60,
  //   date: today,
  //   type: "withdraw",
  // },
  // {
  //   id: "6",
  //   description: "Hackathon Reward",
  //   amount: 600,
  //   date: today,
  //   type: "deposit",
  // },
];
