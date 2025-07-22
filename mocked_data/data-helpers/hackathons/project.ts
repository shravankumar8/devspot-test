import {
  FAQItem,
  ParticipantCardProps,
  PrizeData,
  ProjectCardProps,
} from "@/types/hackathons";

export const ProjectsData: ProjectCardProps[] = [
  {
    id: "1",
    title: "BookBot",
    challenge: "Microsoft Except API Challenge",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
    logo: "/project_bg.svg",
    technologies: ["React", "C+", "Java", "Machine Learning"],
    teamMembers: [
      { name: "Abraham", image: "" },
      { name: "Abraham", image: "" },
      { name: "Abraham", image: "" },
      { name: "Abraham", image: "" },
    ],
    rank: 2,
  },
  {
    id: "2",
    title: "BookBot",
    challenge: "Microsoft Except API Challenge",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
    logo: "/project_bg.svg",
    technologies: ["React", "C+", "Java"],
    teamMembers: [
      { name: "Abraham", image: "" },
      { name: "Abraham", image: "" },
      { name: "Abraham", image: "" },
    ],
    rank: 1,
  },
  {
    id: "3",
    title: "BookBot",
    challenge: "Microsoft Except API Challenge",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
    logo: "/project_bg.svg",
    technologies: ["React", "C+", "Machine Learning"],
    teamMembers: [
      { name: "Abraham", image: "" },
      { name: "Abraham", image: "" },
      { name: "Abraham", image: "" },
      { name: "Abraham", image: "" },
    ],
    rank: 1,
  },
  {
    id: "4",
    title: "BookBot",
    challenge: "Microsoft Except API Challenge",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
    logo: "/project_bg.svg",
    technologies: ["React", "C+", "Machine Learning"],
    teamMembers: [
      { name: "Abraham", image: "" },
      { name: "Abraham", image: "" },
      { name: "Abraham", image: "" },
      { name: "Abraham", image: "" },
      { name: "Abraham", image: "" },
    ],
  },
  {
    id: "5",
    title: "BookBot",
    challenge: "Microsoft Except API Challenge",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
    logo: "/project_bg.svg",
    technologies: ["React", "C+", "Machine Learning"],
    teamMembers: [
      { name: "Abraham", image: "" },
      { name: "Abraham", image: "" },
      { name: "Abraham", image: "" },
      { name: "Abraham", image: "" },
    ],
  },
  {
    id: "6",
    title: "BookBot",
    challenge: "Microsoft Except API Challenge",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
    logo: "/project_bg.svg",
    technologies: ["React", "C+", "Python", "Machine Learning"],
    teamMembers: [
      { name: "Abraham", image: "" },
      { name: "Abraham", image: "" },
      { name: "Abraham", image: "" },
      { name: "Abraham", image: "" },
    ],
    winningTags: ["Best video"],
  },
];

export const initialParticipants: ParticipantCardProps[] = [
  {
    id: "1",
    name: "Olive James",
    role: "Senior Developer",
    location: "Tokyo, Japan",
    skills: ["React", "C++", "Java", "Machine Learning"],
    tokens: 824,
    projectsNumber: 1,
    image:
      "https://s3-alpha-sig.figma.com/img/b49c/2aa5/63bd4fcd5dd9fb30a26f74406d66a973?Expires=1745193600&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=inNHdnS9W9S0ObDxPef8ZGtgqUYObLk0yOxczTocHlnUrRy~laFCMHa6E-TXQXNrunhfSEfJEvGdGiC~i~wF-TLkOZeaD5tEr8UHnl6ayjGn3v4R84AQnWrgbtwnn5h3Sr4dhuazS03UazuFSF9udEleZpHVybTr~YxjGgZTHTJ1KRj3Z4R7GLNcCeWfV3OsCHv5ocQpc-UL8Ac3yivjW93EFGn~0~gLQ-SBk554M8chdyQ924JFN~d9EKp9AN0emoHzaMXmz9H2D8pmyHwwDS81Vod-MKg3TS0EEGzMqakXS0pVCGfSDTumC1HGrpVLLlDCWQh9zEhssyK-y2XROg__",
  },
  {
    id: "2",
    name: "Ola Hopkins",
    role: "Associate Developer",
    location: "Tokyo, Japan",
    skills: ["JavaScript", "Python", "React"],
    tokens: 251,
    lookingForTeammates: true,
    image:
      "https://s3-alpha-sig.figma.com/img/d973/b17b/466355ffd7ff2084d3977dcc86ddbc11?Expires=1745193600&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=hw-Skzpy0z-r0bDg1U8Xe2LbLCy6jikscd0PgMAqgUJab~yUtfQZs3-3oyGmClQazCgL9kNW83hM-3QDedHjDWti3zHyKxUdqEguWYuK9JGZr5H-TIDcFQPUq8zZpfCpdKGiB5D1lTdHx10nbR3HksfcZoAhB8p2VnGDBEmf5A3edGcaZnB-Bm5JGeX9iegTy~1-mjt4gIUiTdhic-tjqzHzq4uTGuLGJhumUE73NvW5i3M2~hTyhav~KCNJ2Vo7T3wsVvcjWgB-sOlOMzeP4hg6thQxbHpUBwotfdlVe19RiBZi3V0By9G9U2xOEp54l--edjbupRnbhtF0f0IWIw__",
  },
  {
    id: "3",
    name: "Henry Edwards",
    role: "Lead Developer",
    location: "Tokyo, Japan",
    skills: ["React", "C++", "Java"],
    tokens: 100,
    projectsNumber: 2,
    image:
      "https://s3-alpha-sig.figma.com/img/6723/5c6f/0107498c7d71858feb093541b0969658?Expires=1745193600&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=CV5aEzSSJuqBG42Gxb-6-xWVxBdGysK5r4XCZvM6K5d6TYLozvmieLqtx1VfRtdWGOSeLjYoE8FEMjxcM8-4P8eT~it4mFHdv3XEA8wmieBDS-eAfHrYQCxTL6gcuED~0-Qvxd8z0kgDH-ibGAQsdZiI-MxPczmCplnGeFBtKIU5leQK1pzoI8ibsHutwMRDf8ut7dZDpjaM3QfVBT-PGflJ9PVCSGglxgh6nrmCzMjR~qzJ9n-SKYRVx~tTsC1VsoG7JrJKEEjb4fk9D-a9GV90bVvWwcaUfHoI~ptVGeVADUkIzkAgiPXkz5QP~kNZ5NJ~NtrDwAhGuzvfhQjWrQ__",
  },
  {
    id: "4",
    name: "Nancy Duncan",
    role: "Senior Software Engineer",
    location: "Tokyo, Japan",
    skills: ["Python"],
    tokens: 8129,
    projectsNumber: 8,
    image:
      "https://s3-alpha-sig.figma.com/img/07f0/eda9/c20bcc257c70b703919e2b7809d59842?Expires=1745193600&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=VlTfb~4Ol8XpO7xTfBSwrtEvkaEy6Xz7kdjxXkpSj-M2A-sRsGGpzkQ6FaAJ~ZCF2spBKzub08lfGkaC4TpOBYcxEdK~d~zOgihCmc2oNzhXPkKWj5hvZnOVmv3Q9MyJoDEr0Gg1Gp6BYs2tq9Mz8cMA6pWonlSxTQ84QMiTkWyEnVT2OlC~1a3IppIdqGBEYBSFhvZAgoLptuWBiUdqIimiPt8BwHN29le3V3k3SRAkRzTOAiKM3B5~4ujXoCkz~CjqgYSNXO9Pu2LORZDTfBBe4kitYk9krYwQhzTPwMnhNFNic~I1PZgekH55kAQa19TLtJ~NrSK-tjQA-GhhMA__",
  },
  {
    id: "5",
    name: "Rosetta Alvarez",
    role: "Lead Developer",
    location: "Tokyo, Japan",
    skills: ["React", "Ruby", "Java", "AI", "Cryptography"],
    tokens: 100,
    image:
      "https://s3-alpha-sig.figma.com/img/b60d/4de8/d5188cec925a9f154dcee647500bae18?Expires=1745193600&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=Cfqpb5F1j0sxO3PC8ej83oxa2EOYOrbGDKc4o~oYNEYhqV291nU2K4AH~G7-e4exmbR07p2K0NgThUXpSoCyAq5kBJ1O9mSfM2uvgQ7MqZTXhL9zppEOq3irwNzit6EY3HQ6wA~1fzmqiBqyOcZ9SZ~x~m4Zt86ydsBCNR0oh53ZHn-LWxbQivIhGHEoTOeX-K3a6OYAsubMzrbrnjDyPKABVVtOOO1s~q~k-HOGH9foyPIWmkzilY1TROXTJUf~cYGM68wED-tjvJd4BmeeoLe~xL-5SKVIDaacA4ZyOu2YVxn8goJAO~SJiCn8LrjUype~8ehwlpOLfqTux9hvxQ__",
  },
  {
    id: "6",
    name: "Fannie Hahn",
    role: "Project Manager",
    location: "Tokyo, Japan",
    skills: ["Python"],
    tokens: 100,
    image:
      "https://s3-alpha-sig.figma.com/img/31a1/bed5/4d5a6d7080bf6f415ba8bd0407de09ea?Expires=1745193600&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=cT63wPdJPHM4XW1vdFb-3jXs4Cu~dWGmvYBTBDnaqsTDUGROibz62LUSezQD9z68MpmkzJRoKdB786r0viPezUhfswT0qI3zd3kqLsLDXajPXxMqNEFaxPgSLaTU9rOkSBgu2-2uAJirmFEp6iZ64cJo2SaYrrNvicw6OCJwqBzy3I6VYSVEIL9-~5PwfKSJnYRSE0GVSryWUQau~4t3oh4c0u-z6NH8~nHQ0bPT1BNRsmJqImP4N82mxwePXMWC71wfEvfmPzSp25AmfMEK4MV6kQsF7RvPEuUfw7E3UTYIMqZTOkeKX-3IVebBPj3O1LasaIR040u8us2naaUQVQ__",
  },
  {
    id: "7",
    name: "Leo Slater",
    role: "Founder",
    location: "Tokyo, Japan",
    skills: ["JavaScript", "CSS", "HTML"],
    tokens: 2000,
    projectsNumber: 5,
    image:
      "https://s3-alpha-sig.figma.com/img/025e/db74/27d5adb8825bc5985f02dcbac32d247b?Expires=1745193600&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=ZXEcNgcQiDgNdT~0zdWtCw0n3mUwzro-cyDbQJd8GN02N-v6w6j8FzOhn927Bdr0KiyClfjMYbRMAoxP~sRGOGHcbISnlgGdcCUBrzBhnlA7F7vydYDnMYPhQ8nd1BOmFLkP57X1HpoM1YJ5J2EDr8nVtNky~YeyHZXFBq3wC2k2J1~~FBg~k-yntZ1gWcZGYTfCJ4Gu13qlBq6atGkFqWBHimt6w2G4dmGeuv4wziKPJhLeAoBHFymlI3XEku4boDrwlclIguABk319Pi6IBRBkNqO3Zw9NwruLn8IqBP8MhCBgZg~ETLGrkYofhjhhQwshzJGzhmQZjSXSh-N~Ig__",
  },
  {
    id: "8",
    name: "Zakaria Mora",
    role: "Research Lead",
    location: "Tokyo, Japan",
    skills: ["Python", "MySQL", "Java", "AI", "Bitcoin"],
    tokens: 350,
    image:
      "https://s3-alpha-sig.figma.com/img/3f99/7ac8/8310448974cf239a72bad8ef817f985f?Expires=1745193600&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=VI-FKlDnzLwoJtIosnGkgXHM3FrvJE8JRAVXwkiaolILv0WgiE9yqaKCunczMPax3M3y05Qz2FpLX9OZrvdfNLmwjKMVoTdKlAVk6xrYuF5FMrobh~c6lbieawFw6p0SUj8JsgRlXyE-GHdjOvkG3mgdyE-nkddY6rRzmiQnNHnb~r4EzcDv5ttNPZFTIClQ2zC1NMWrpM0JncbtPj8fuUBMlbcAqnIJSrXkxI~leORvdwEYMEtDfjJ5lskF2Qp1XemjEzMNVgGol8IU7luYV7DLSYMhKZYl8PpFbyOIUMvYjdMIdbz69TPsCr~MvDcBl1XNU4Oezte71rKBWEE4Zw__",
  },
  {
    id: "9",
    name: "Cormac Brandt",
    role: "Senior Software Engineer",
    location: "Tokyo, Japan",
    skills: ["React", "JavaScript"],
    tokens: 8293,
    projectsNumber: 3,
    image:
      "https://s3-alpha-sig.figma.com/img/f0ef/9ca4/526b84a58e088956bb12e059d1a14c13?Expires=1745193600&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=rNDIg2D-cSxW0qZ7PEDr5OoFMdN2e7QAFyyE52LyAE1nKagwzCH45L40h7OX1aXtzLnxnpE7B7~AcLSSLrCIQNF90AXLgMccTNtWOtG1la0h6Vsxh6ut2Q24ua~zOH~bYZLiuTSKfLOLbveY-eNRpWS7kyCH80QyBd07BfNeMdLI7~TR8xCRyeig0CuPo0KxeP6p0K9iNfYnwGlonWmwnKDxMc9Uf2zhW4V-ObDOVEZh~N0hx5rvQziUhxLZsT0rOAbXt5ZtcFNx6Y-4Jl2Y4vQc5JKdNYoRFcKxv~TUAJuAiKuhSc-oDIGw0xtpPPFDpJkzK~8vQ73FeO1kyrp~TA__",
  },
  {
    id: "10",
    name: "Amelia Fry",
    role: "Software Engineer",
    location: "Tokyo, Japan",
    skills: ["React", "Java"],
    tokens: 180,
    image:
      "https://s3-alpha-sig.figma.com/img/dbff/74a7/06bd1874b917d2e4a7c6ad5067073258?Expires=1745193600&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=ml48bA4U1-eRSd7sEuNX0AyAH47~FCgyBhXIwlX5mjvdTDC1KVyJ~lOXPYM41Os-d-gQs6KmF6aoktURp6q-G9M7mxYCcpq9cX0HVFs86~PVT7Yja-wDEWTqXr3-s3Q6Af15oXSv8U3xKUdRzmH4vIpsv1klmbijdEQqn9nlhuMZwnkheqKuNe7XOiQFHRl-BckfFwiEGfAPkjT6Xv3ORJV9QrboEAYRIk92GNJwwcfszO63dXsgtU5fE6vCYeOdoJxANMSwBy0Wv08jwfamzrDx61o~JWzID7msYfgIrYfvF7AQIju8KnVbJQghE2G-Wc8rAnOtZD8UACxBBSkQFg__",
  },
  {
    id: "11",
    name: "Kiana Padilla",
    role: "Lead Designer",
    location: "Tokyo, Japan",
    skills: ["Adobe Creative Suite", "Figma"],
    tokens: 1000,
    image:
      "https://s3-alpha-sig.figma.com/img/7ab5/bc05/5fbd3420476e357d174027ae26e7c09a?Expires=1745193600&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=ZFXS08T3ffcf-pK2tIkOH7-4FSjqH315x9cHoYhqGtx6h5qJn7TyiNoePKRQAmcRWSe3fwTXa2~LwWlavj9PvuOR4y6WwfKxcxB1qvk1EoXBvB42rjqaDLArbaWXXulehpMN8FFIfFi~hegm4wlxUANV7VStJ~bgfEizaxCHu-k~9rO0jPj2CMBoH6wLNCgDvt5RxqHPkJWqBcSi9AuS6QtQ2f0xTfXxMRGI6ah~XBsP2SBI4P4m3AEe5N-OZer83OLXp~zoXC8OWXAIhnCMjajU5YsgVb0Jplxw~GjxGA6VxVsC4~P82uw2-8hI4cpQx6l6uLpQLGuJW7evWCxT5w__",
  },
  {
    id: "12",
    name: "Alex Morgan",
    role: "UX Designer",
    location: "Tokyo, Japan",
    skills: ["Adobe", "Figma", "Sketch"],
    tokens: 250,
    lookingForTeammates: true,
    image:
      "https://s3-alpha-sig.figma.com/img/9e03/314b/6be949db4da5ca3cd5c60d680034189d?Expires=1745193600&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=m5-XVLd4LieMnRFXzgEDn43eHhtT82JgbWEAYRPSk40Ji96t8Ru~4PkCtZLG-Jzw0KHshxQrmW2abTV36cAeHTDaIkMTsyHD4y91Kwm4xCQvKecxhnIiUIP2COXLqmZBaAdl9yBbyg8sAVWMf-Rcf624x9toKHvLg4KZdAUqVhFsnme8zhfzgUp6PqX6RAQGq5evKkpTiMy3t0E9ELYnC93zkIlNwynSHjTWTrUXir977hh27AQ9FGesqyTvJaj4h9gQxpKelWhsI24k5ux7wcR4RAFf8yl9ftUNRNNsoHyc-r9Bfs6JKEidVle7xJnWgiQD97RukZGvbmm4pevK5Q__",
  },
];

export const faqData: FAQItem[] = [
  {
    question: "Is there an application process to sign up?",
    answer:
      "Yes, there is an application process. You'll need to complete the online registration form on our website and provide some basic information about yourself and your project. Applications are reviewed within 5-7 business days.",
  },
  {
    question: "Will technical support be provided during the competition?",
    answer:
      "We offer comprehensive technical support throughout the competition. Our support team is available via email, chat, and scheduled video calls to help you overcome any technical challenges you might face.",
  },
  {
    question: "Can I submit a world that's already been released / published?",
    answer:
      "No, all submissions must be original and unpublished work created specifically for this competition. Previously released or published worlds are not eligible for entry. This ensures a fair competition environment for all participants.",
  },
  {
    question: "Should I submit my entry for compatibility testing?",
    answer:
      "Yes, we strongly recommend submitting your entry for compatibility testing at least two weeks before the final deadline. This will give you time to address any compatibility issues that might be identified during testing.",
  },
];

export const prizes: PrizeData[] = [
  {
    challenge: "AI for Healthcare",
    total_prize: "$100,000",
    bounty: [
      {
        cash: 1000,
        tokens: 500,
        position: 1,
        sponsor: {
          name: "HealthTech Inc.",
          logo: "https://s3-alpha-sig.figma.com/img/92c5/57a5/ec7c4817cedb3010754e0106eb371040?Expires=1745193600&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=ECPIFcYqMSoWVVvFEvNUpr2ribztA3uDTPsk5sGFafveYyAUd8rh1qmKWKdIJbHrTQy8yYyhpmQBBBQBHjy05VEyNCoEURs1s2-DcUoXtMV6YCFTDb~XLrMlkg0DcUhAi1lMABypA4bwbQoOU02YgPfcSmvq1zVFLUJoWbxPuLAdz8ZwIGzTU3fG7QMBvh32ZUTaXc1Tg3MqjLYma4eouv~EPmHktz81OJx67fssGNnWIMZoRKzsr2fvw9o30ky6bqm2rgaEMWu0tgRqZi5ACr1iFHJzZHdMmgq9GnPEYZNXxUaMmxy3eCvkvRsZGpecs4lPZmc9HSmd6WKQaiiBNg__",
        },
      },
      {
        custom_prize: "Free Mentorship & Cloud Credits",
        position: 2,
        sponsor: {
          name: "CloudCare",
          logo: "https://s3-alpha-sig.figma.com/img/92c5/57a5/ec7c4817cedb3010754e0106eb371040?Expires=1745193600&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=ECPIFcYqMSoWVVvFEvNUpr2ribztA3uDTPsk5sGFafveYyAUd8rh1qmKWKdIJbHrTQy8yYyhpmQBBBQBHjy05VEyNCoEURs1s2-DcUoXtMV6YCFTDb~XLrMlkg0DcUhAi1lMABypA4bwbQoOU02YgPfcSmvq1zVFLUJoWbxPuLAdz8ZwIGzTU3fG7QMBvh32ZUTaXc1Tg3MqjLYma4eouv~EPmHktz81OJx67fssGNnWIMZoRKzsr2fvw9o30ky6bqm2rgaEMWu0tgRqZi5ACr1iFHJzZHdMmgq9GnPEYZNXxUaMmxy3eCvkvRsZGpecs4lPZmc9HSmd6WKQaiiBNg__",
        },
      },
    ],
  },
  {
    challenge: "Sustainable Energy Solutions",
    total_prize: "$100,000",
    bounty: [
      {
        cash: 2000,
        position: 1,
        sponsor: {
          name: "GreenPower Co.",
          logo: "https://s3-alpha-sig.figma.com/img/778e/e4a7/02d26dea630d2f78ac28a44ac8630501?Expires=1745193600&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=UVMFDg3iV76DlXUN7Eh6f3q774P1B1bT~b9XNwr04TO3~tJfehlxHPUk4BlTICTjSUh4T8Z~M3vX8G5LUdGOu2LzHn97DrguaH0lUo~NMdl7N1ZigF4TCK1YdxuP4osJ4tppwkzKx4A3wzhaXC1mV759wIuWYN3AUyZcjBpH6rtYpFSudXQzw4DtQCmjZnz1JW-YYMRH9VPSk1AeBUhweQTP2Wa6MQnwDVEDx~JYeHVvkBDYRzz8YKCJNaxtRGOZtJghT-nusjnsces0s-T9xttHLNfGlq3eGh8mn4g-nGHoAczvtv6PkPXMyn7FkqD0hFqRPXQ~CuJIlsUk9XzdBQ__",
        },
      },
      {
        tokens: 1000,
        custom_prize: "Smart Solar Kit",

        sponsor: {
          name: "EcoStart",
          logo: "https://s3-alpha-sig.figma.com/img/22d8/a542/7cce1f3ed7ea00ceded0550462aedee9?Expires=1745193600&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=drjsw9MXr2ykbReFds7vIZai75LAZbbn3fI1hUVCK6XxC2JNnFJ664lcsScNUaKClad5hAQIonoay~tIdLWMhdRyS5OfJSjLvOG3P6mzezgH7Y6SzGQN-4GMDa0Jj7a7Rb2OyooG90nl6m6R8Mhj18QvmFfg1aJW2AVmqZxTlOhJVfv2yOreNjb1a3mfjueDjQIPBprXyR~ExwiICrBWrvLGDB22bhdsEsr7pbhSv99OBFQuuboxBvHtdFbvHaipqoIW0Rmq7JlI4ZqJJbBcComPzWDThfJkH0-Tm5aWg7SdKGYmUUn~6ooRkQcRt-oxHwMYCsA0loy2WrSqju5~CA__",
        },
        custom_category: "Innovation Award",
      },
    ],
  },
  {
    challenge: "Blockchain for Finance",
    total_prize: "$100,000",
    bounty: [
      {
        tokens: 1500,
        position: 1,
        sponsor: {
          name: "ChainBank",
          logo: "https://s3-alpha-sig.figma.com/img/22d8/a542/7cce1f3ed7ea00ceded0550462aedee9?Expires=1745193600&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=drjsw9MXr2ykbReFds7vIZai75LAZbbn3fI1hUVCK6XxC2JNnFJ664lcsScNUaKClad5hAQIonoay~tIdLWMhdRyS5OfJSjLvOG3P6mzezgH7Y6SzGQN-4GMDa0Jj7a7Rb2OyooG90nl6m6R8Mhj18QvmFfg1aJW2AVmqZxTlOhJVfv2yOreNjb1a3mfjueDjQIPBprXyR~ExwiICrBWrvLGDB22bhdsEsr7pbhSv99OBFQuuboxBvHtdFbvHaipqoIW0Rmq7JlI4ZqJJbBcComPzWDThfJkH0-Tm5aWg7SdKGYmUUn~6ooRkQcRt-oxHwMYCsA0loy2WrSqju5~CA__",
        },
      },
      {
        cash: 750,
        custom_prize: "Beta Access to Finance SDK",
        position: 3,
        sponsor: {
          name: "LedgerLabs",
          logo: "https://s3-alpha-sig.figma.com/img/92c5/57a5/ec7c4817cedb3010754e0106eb371040?Expires=1745193600&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=ECPIFcYqMSoWVVvFEvNUpr2ribztA3uDTPsk5sGFafveYyAUd8rh1qmKWKdIJbHrTQy8yYyhpmQBBBQBHjy05VEyNCoEURs1s2-DcUoXtMV6YCFTDb~XLrMlkg0DcUhAi1lMABypA4bwbQoOU02YgPfcSmvq1zVFLUJoWbxPuLAdz8ZwIGzTU3fG7QMBvh32ZUTaXc1Tg3MqjLYma4eouv~EPmHktz81OJx67fssGNnWIMZoRKzsr2fvw9o30ky6bqm2rgaEMWu0tgRqZi5ACr1iFHJzZHdMmgq9GnPEYZNXxUaMmxy3eCvkvRsZGpecs4lPZmc9HSmd6WKQaiiBNg__",
        },
      },
    ],
  },
];

export const dummyProjects = [
  {
    id: 1,
    name: "Catalyst",
    tagline: "Beat ChatGPT with our revolutionary AI model",
    rank: 1,
    score: 8,
    judges: [{ name: "Alice Smith", judging_id: 2, avatar_url: null }],
    project_challenges: [
      {
        hackathon_challenges: {
          challenge_name:
            "⚡️ The Agentic Internet and Building AI-led Web3 Experiences",
          sponsors: [
            {
              logo: "https://example.com/near-logo.png",
              name: "Near",
            },
          ],
          is_round_2_only: false,
        },
      },
    ],
    technologies: ["AI", "LLM", "Web3", "Blockchain"],
    project_team_members: [
      {
        users: {
          full_name: "Alice Smith",
          avatar_url: "https://example.com/avatar1.jpg",
        },
        status: "confirmed",
        is_project_manager: true,
      },
      {
        users: {
          full_name: "Bob Johnson",
          avatar_url: "https://example.com/avatar2.jpg",
        },
        status: "confirmed",
        is_project_manager: false,
      },
    ],
  },
  {
    id: 2,
    name: "Arc",
    tagline: "Next-gen blockchain infrastructure",
    rank: 2,
    score: 7.5,
    project_challenges: [
      {
        hackathon_challenges: {
          challenge_name: "🌐 Best Use of IPFS and Filecoin",
          sponsors: [
            {
              logo: "https://example.com/filecoin-logo.png",
              name: "Filecoin",
            },
            {
              logo: "https://example.com/ipfs-logo.png",
              name: "IPFS",
            },
          ],
          is_round_2_only: false,
        },
      },
    ],
    judges: [{ name: "Badere Johnson", judging_id: 2, avatar_url: null }],
    technologies: ["Blockchain", "Rust", "Smart Contracts"],
    project_team_members: [
      {
        users: {
          full_name: "Charlie Brown",
          avatar_url: "https://example.com/avatar3.jpg",
        },
        status: "confirmed",
        is_project_manager: true,
      },
    ],
  },
  {
    id: 3,
    name: "Filtzip",
    tagline: "Decentralized storage solution",
    rank: 3,
    score: 7,
    project_challenges: [
      {
        hackathon_challenges: {
          challenge_name: "🔐 Best Privacy Preserving Solution",
          sponsors: [
            {
              logo: "https://example.com/eth-logo.png",
              name: "Ethereum",
            },
          ],
          is_round_2_only: true,
        },
      },
    ],
    judges: [{ name: "Thompson Jola", judging_id: 2, avatar_url: null }],
    technologies: ["Storage", "Encryption", "ZK Proofs"],
    project_team_members: [
      {
        users: {
          full_name: "Dana White",
          avatar_url: "https://example.com/avatar4.jpg",
        },
        status: "confirmed",
        is_project_manager: true,
      },
      {
        users: {
          full_name: "Eve Black",
          avatar_url: "https://example.com/avatar5.jpg",
        },
        status: "confirmed",
        is_project_manager: false,
      },
      {
        users: {
          full_name: "Frank Green",
          avatar_url: "https://example.com/avatar6.jpg",
        },
        status: "confirmed",
        is_project_manager: false,
      },
    ],
  },
  {
    id: 4,
    name: "Neuralink",
    tagline: "AI-powered neural interfaces",
    score: 6.8,
    project_challenges: [
      {
        hackathon_challenges: {
          challenge_name: "🧠 Most Innovative AI Application",
          sponsors: [
            {
              logo: "https://example.com/openai-logo.png",
              name: "OpenAI",
            },
          ],
          is_round_2_only: false,
        },
      },
    ],
    judges: [{ name: "Young balde", judging_id: 2, avatar_url: null }],
    technologies: ["AI", "Neuroscience", "BCI"],
    project_team_members: [
      {
        users: {
          full_name: "Grace Hopper",
          avatar_url: "https://example.com/avatar7.jpg",
        },
        status: "confirmed",
        is_project_manager: true,
      },
      {
        users: {
          full_name: "Henry Ford",
          avatar_url: "https://example.com/avatar8.jpg",
        },
        status: "confirmed",
        is_project_manager: false,
      },
    ],
  },
  {
    id: 5,
    name: "QuantumLeap",
    tagline: "Quantum computing for everyone",
    score: 9.2,
    project_challenges: [
      {
        hackathon_challenges: {
          challenge_name: "⚛️ Best Quantum Computing Project",
          sponsors: [
            {
              logo: "https://example.com/ibm-logo.png",
              name: "IBM",
            },
          ],
          is_round_2_only: true,
        },
      },
    ],
    judges: [{ name: "Emmanuel Smith", judging_id: 2, avatar_url: null }],
    technologies: ["Quantum", "Qiskit", "Python"],
    project_team_members: [
      {
        users: {
          full_name: "Isaac Newton",
          avatar_url: "https://example.com/avatar9.jpg",
        },
        status: "confirmed",
        is_project_manager: true,
      },
      {
        users: {
          full_name: "Jane Doe",
          avatar_url: "https://example.com/avatar10.jpg",
        },
        status: "confirmed",
        is_project_manager: false,
      },
      {
        users: {
          full_name: "Kevin Smith",
          avatar_url: "https://example.com/avatar11.jpg",
        },
        status: "confirmed",
        is_project_manager: false,
      },
      {
        users: {
          full_name: "Lisa Ray",
          avatar_url: "https://example.com/avatar12.jpg",
        },
        status: "confirmed",
        is_project_manager: false,
      },
    ],
  },
];


export const sampleWinnersData = [
  {
    id: "1",
    name: "Beat ChatGPT",
    avatar_url: null,
    challenge: "⚡ Catalyst",
    project: "Catalyst",
    standing: "1st Place",
    prizeAllocation: "25%",
    walletAddress: "",
    kycProgress: 0,
    status: "Missing wallet address" as const,
  },
  {
    id: "2",
    name: "Beat ChatGPT",
    avatar_url: null,
    challenge: "🏆 Catalyst",
    project: "Catalyst",
    standing: "1st Place",
    prizeAllocation: "25%",
    walletAddress: "",
    kycProgress: 0,
    status: "Missing wallet address" as const,
  },
  {
    id: "3",
    name: "Beat ChatGPT",
    avatar_url: null,
    challenge: "⚡ Catalyst",
    project: "Catalyst",
    standing: "1st Place",
    prizeAllocation: "25%",
    walletAddress: "nbh4",
    kycProgress: 0,
    status: "Not paid" as const,
  },
  {
    id: "4",
    name: "Beat ChatGPT",
    avatar_url: null,
    challenge: "🎯 Catalyst",
    project: "Catalyst",
    standing: "1st Place",
    prizeAllocation: "25%",
    walletAddress: "C3D4",
    kycProgress: 0,
    status: "Not paid" as const,
  },
  {
    id: "5",
    name: "Beat ChatGPT",
    avatar_url: null,
    challenge: "Arc",
    project: "Arc",
    standing: "2nd Place",
    prizeAllocation: "16.6%",
    walletAddress: "D4E5",
    kycProgress: 0,
    status: "Not paid" as const,
  },
  {
    id: "6",
    name: "Beat ChatGPT",
    avatar_url: null,
    challenge: "⚡ Beat ChatGPT",
    project: "Arc",
    standing: "2nd Place",
    prizeAllocation: "16.6%",
    walletAddress: "E5F6",
    kycProgress: 0,
    status: "Not paid" as const,
  },
  {
    id: "7",
    name: "Beat ChatGPT",
    avatar_url: null,
    challenge: "Arc",
    project: "Arc",
    standing: "2nd Place",
    prizeAllocation: "16.6%",
    walletAddress: "F607",
    kycProgress: 0,
    status: "Not paid" as const,
  },
  {
    id: "8",
    name: "Beat ChatGPT",
    avatar_url: null,
    challenge: "Arc",
    project: "Arc",
    standing: "2nd Place",
    prizeAllocation: "16.6%",
    walletAddress: "0789",
    kycProgress: 0,
    status: "Not paid" as const,
  },
  {
    id: "9",
    name: "Beat ChatGPT",
    avatar_url: null,
    challenge: "Arc",
    project: "Arc",
    standing: "2nd Place",
    prizeAllocation: "16.6%",
    walletAddress: "89A1",
    kycProgress: 0,
    status: "Not paid" as const,
  },
  {
    id: "10",
    name: "Beat ChatGPT",
    avatar_url: null,
    challenge: "Arc",
    project: "Arc",
    standing: "2nd Place",
    prizeAllocation: "16.6%",
    walletAddress: "D4E5",
    kycProgress: 0,
    status: "Not paid" as const,
  },
  {
    id: "11",
    name: "Beat ChatGPT",
    avatar_url: null,
    challenge: "Flitzip",
    project: "Flitzip",
    standing: "3rd Place",
    prizeAllocation: "33.3%",
    walletAddress: "E5F6",
    kycProgress: 0,
    status: "Not paid" as const,
  },
  {
    id: "12",
    name: "Beat ChatGPT",
    avatar_url: null,
    challenge: "Flitzip",
    project: "Flitzip",
    standing: "3rd Place",
    prizeAllocation: "33.3%",
    walletAddress: "F607",
    kycProgress: 0,
    status: "Not paid" as const,
  },
  {
    id: "13",
    name: "Beat ChatGPT",
    avatar_url: null,
    challenge: "Flitzip",
    project: "Flitzip",
    standing: "3rd Place",
    prizeAllocation: "33.3%",
    walletAddress: "0789",
    kycProgress: 0,
    status: "Not paid" as const,
  },
];
