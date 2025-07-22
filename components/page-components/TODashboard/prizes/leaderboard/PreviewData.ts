export const mockProject: MockProjectType[] = [
  {
    id: 1,
    name: "AI-Powered Fitness Coach",
    description:
      "“A well-built, high-impact tool with good UX and a clear use case. Needs more market validation but shows strong execution.”",
    created_at: "2025-06-01T12:00:00Z",
    updated_at: "2025-06-08T10:30:00Z",
    submitted: true,
    accepting_participants: false,
    demo_url: "https://demo.fitness-ai.app",
    project_url: "https://github.com/fakeuser/fitness-ai",
    video_url: "https://www.youtube.com/watch?v=demo_fitness_ai",
    header_url: "/images/fitness-header.png",
    logo_url: "/amazons.png",
    technologies: ["React Native", "Supabase", "TensorFlow.js"],

    is_owner: true,
    project_completion_rate: 85,

    hackathons: {
      id: 101,
      name: "AI x Health Hackathon 2025",
      description: "Build AI solutions to improve physical and mental health.",
      avatar_url: "/images/ai-health.png",
      banner_url: "/images/banner-aihealth.png",
      created_at: "2025-05-15T08:00:00Z",
      updated_at: "2025-05-30T08:00:00Z",
      application_method: "apply",
      deadline_to_join: "2025-06-01T23:59:00Z",
      deadline_to_submit: "2025-06-10T23:59:00Z",
      start_date: "2025-06-01T00:00:00Z",
      end_date: "2025-06-15T23:59:00Z",
      location: "Online",
      status: "live",
      subdomain: "ai-health-2025",
      sponsors: [],
      tags: ["AI", "Healthcare"],
      team_limit: 4,
      technologies: ["Python", "TensorFlow", "React Native"],
      type: "virtual",
      organizer_id: 201,
      organizer: {
        id: 201,
        name: "HealthTech Foundation",
        user_id: "org123",
        created_at: "2023-01-01T00:00:00Z",
        updated_at: "2023-01-02T00:00:00Z",
      },
    },

    project_challenges: [
      {
        id: 1001,
        challenge_id: 301,
        project_id: 1,
        created_at: "2025-06-01T12:00:00Z",
        updated_at: "2025-06-08T10:30:00Z",
        rank: 1,
        challenge: {
          id: 301,
          challenge_name: "Fitness Tracking with AI",
          description: "Build a solution that tracks fitness data using AI.",
          prizes: [],
          created_at: "2025-05-10T10:00:00Z",
          updated_at: "2025-05-20T10:00:00Z",
          hackathon_id: 101,
        },
        hackathon_challenges: {
          id: 301,
          challenge_name: "Fitness Tracking with AI",
          description: "Build a solution that tracks fitness data using AI.",
          prizes: [],
          created_at: "2025-05-10T10:00:00Z",
          updated_at: "2025-05-20T10:00:00Z",
          hackathon_id: 101,
        },
      },
    ],

    project_challenge: {
      id: 1001,
      challenge_id: 301,
      project_id: 1,
      created_at: "2025-06-01T12:00:00Z",
      updated_at: "2025-06-08T10:30:00Z",
      rank: 1,
      challenge: {
        id: 301,
        challenge_name: "Fitness Tracking with AI",
        description: "Build a solution that tracks fitness data using AI.",
        prizes: [],
        created_at: "2025-05-10T10:00:00Z",
        updated_at: "2025-05-20T10:00:00Z",
        hackathon_id: 101,
      },
      hackathon_challenges: {
        id: 301,
        challenge_name: "Fitness Tracking with AI",
        description: "Build a solution that tracks fitness data using AI.",
        prizes: [],
        created_at: "2025-05-10T10:00:00Z",
        updated_at: "2025-05-20T10:00:00Z",
        hackathon_id: 101,
      },
    },

    project_team_members: [
      {
        id: 401,
        created_at: "2025-06-01T14:00:00Z",
        project_id: 1,
        user_id: "user123",
        updated_at: "2025-06-01T14:30:00Z",
        users: {
          id: "user123",
          full_name: "Jane Doe",
          email: "jane@example.com",
          avatar_url: "https://randomuser.me/api/portraits/women/1.jpg",
          created_at: "2024-01-01T00:00:00Z",
          updated_at: "2024-01-01T00:00:00Z",
          role_id: 1,
          main_role: "Developer",
          profile_header_url: null,
          terms_accepted: true,
          notification_preferences: [],
          roles: null,
          project_team_members: [],
        },
      },
      {
        id: 402,
        created_at: "2025-06-01T14:05:00Z",
        project_id: 1,
        user_id: "user124",
        updated_at: "2025-06-01T14:35:00Z",
        users: {
          id: "user124",
          full_name: "John Smith",
          email: "john@example.com",
          avatar_url: "https://randomuser.me/api/portraits/men/2.jpg",
          created_at: "2024-01-02T00:00:00Z",
          updated_at: "2024-01-02T00:00:00Z",
          role_id: 2,
          main_role: "Designer",
          profile_header_url: null,
          terms_accepted: true,
          notification_preferences: [],
          roles: null,
          project_team_members: [],
        },
      },
    ],
  },
  {
    id: 2,
    name: "AI-Powered Fitness Coach",
    description:
      "“A well-built, high-impact tool with good UX and a clear use case. Needs more market validation but shows strong execution.”",
    created_at: "2025-06-01T12:00:00Z",
    updated_at: "2025-06-08T10:30:00Z",
    submitted: true,
    accepting_participants: false,
    demo_url: "https://demo.fitness-ai.app",
    project_url: "https://github.com/fakeuser/fitness-ai",
    video_url: "https://www.youtube.com/watch?v=demo_fitness_ai",
    header_url: "/images/fitness-header.png",
    logo_url: "/cloudera.png",
    technologies: ["React Native", "Supabase", "TensorFlow.js"],

    is_owner: true,
    project_completion_rate: 85,

    hackathons: {
      id: 101,
      name: "AI x Health Hackathon 2025",
      description: "Build AI solutions to improve physical and mental health.",
      avatar_url: "/images/ai-health.png",
      banner_url: "/images/banner-aihealth.png",
      created_at: "2025-05-15T08:00:00Z",
      updated_at: "2025-05-30T08:00:00Z",
      application_method: "apply",
      deadline_to_join: "2025-06-01T23:59:00Z",
      deadline_to_submit: "2025-06-10T23:59:00Z",
      start_date: "2025-06-01T00:00:00Z",
      end_date: "2025-06-15T23:59:00Z",
      location: "Online",
      status: "live",
      subdomain: "ai-health-2025",
      sponsors: [],
      tags: ["AI", "Healthcare"],
      team_limit: 4,
      technologies: ["Python", "TensorFlow", "React Native"],
      type: "virtual",
      organizer_id: 201,
      organizer: {
        id: 201,
        name: "HealthTech Foundation",
        user_id: "org123",
        created_at: "2023-01-01T00:00:00Z",
        updated_at: "2023-01-02T00:00:00Z",
      },
    },

    project_challenges: [
      {
        id: 1001,
        challenge_id: 301,
        project_id: 1,
        created_at: "2025-06-01T12:00:00Z",
        updated_at: "2025-06-08T10:30:00Z",
        rank: 1,
        challenge: {
          id: 301,
          challenge_name: "Fitness Tracking with AI",
          description: "Build a solution that tracks fitness data using AI.",
          prizes: [],
          created_at: "2025-05-10T10:00:00Z",
          updated_at: "2025-05-20T10:00:00Z",
          hackathon_id: 101,
        },
        hackathon_challenges: {
          id: 301,
          challenge_name: "Fitness Tracking with AI",
          description: "Build a solution that tracks fitness data using AI.",
          prizes: [],
          created_at: "2025-05-10T10:00:00Z",
          updated_at: "2025-05-20T10:00:00Z",
          hackathon_id: 101,
        },
      },
    ],

    project_challenge: {
      id: 1001,
      challenge_id: 301,
      project_id: 1,
      created_at: "2025-06-01T12:00:00Z",
      updated_at: "2025-06-08T10:30:00Z",
      rank: 1,
      challenge: {
        id: 301,
        challenge_name: "Fitness Tracking with AI",
        description: "Build a solution that tracks fitness data using AI.",
        prizes: [],
        created_at: "2025-05-10T10:00:00Z",
        updated_at: "2025-05-20T10:00:00Z",
        hackathon_id: 101,
      },
      hackathon_challenges: {
        id: 301,
        challenge_name: "Fitness Tracking with AI",
        description: "Build a solution that tracks fitness data using AI.",
        prizes: [],
        created_at: "2025-05-10T10:00:00Z",
        updated_at: "2025-05-20T10:00:00Z",
        hackathon_id: 101,
      },
    },

    project_team_members: [
      {
        id: 401,
        created_at: "2025-06-01T14:00:00Z",
        project_id: 1,
        user_id: "user123",
        updated_at: "2025-06-01T14:30:00Z",
        users: {
          id: "user123",
          full_name: "Jane Doe",
          email: "jane@example.com",
          avatar_url: "https://randomuser.me/api/portraits/women/3.jpg",
          created_at: "2024-01-01T00:00:00Z",
          updated_at: "2024-01-01T00:00:00Z",
          role_id: 1,
          main_role: "Developer",
          profile_header_url: null,
          terms_accepted: true,
          notification_preferences: [],
          roles: null,
          project_team_members: [],
        },
      },
      {
        id: 402,
        created_at: "2025-06-01T14:05:00Z",
        project_id: 1,
        user_id: "user124",
        updated_at: "2025-06-01T14:35:00Z",
        users: {
          id: "user124",
          full_name: "John Smith",
          email: "john@example.com",
          avatar_url: "https://randomuser.me/api/portraits/men/4.jpg",
          created_at: "2024-01-02T00:00:00Z",
          updated_at: "2024-01-02T00:00:00Z",
          role_id: 2,
          main_role: "Designer",
          profile_header_url: null,
          terms_accepted: true,
          notification_preferences: [],
          roles: null,
          project_team_members: [],
        },
      },
    ],
  },
  {
    id: 3,
    name: "AI-Powered Fitness Coach",
    description:
      "“A well-built, high-impact tool with good UX and a clear use case. Needs more market validation but shows strong execution.”",
    created_at: "2025-06-01T12:00:00Z",
    updated_at: "2025-06-08T10:30:00Z",
    submitted: true,
    accepting_participants: false,
    demo_url: "https://demo.fitness-ai.app",
    project_url: "https://github.com/fakeuser/fitness-ai",
    video_url: "https://www.youtube.com/watch?v=demo_fitness_ai",
    header_url: "/images/fitness-header.png",
    logo_url: "/default-img.png",
    technologies: ["React Native", "Supabase", "TensorFlow.js"],

    is_owner: true,
    project_completion_rate: 85,

    hackathons: {
      id: 101,
      name: "AI x Health Hackathon 2025",
      description: "Build AI solutions to improve physical and mental health.",
      avatar_url: "/images/ai-health.png",
      banner_url: "/images/banner-aihealth.png",
      created_at: "2025-05-15T08:00:00Z",
      updated_at: "2025-05-30T08:00:00Z",
      application_method: "apply",
      deadline_to_join: "2025-06-01T23:59:00Z",
      deadline_to_submit: "2025-06-10T23:59:00Z",
      start_date: "2025-06-01T00:00:00Z",
      end_date: "2025-06-15T23:59:00Z",
      location: "Online",
      status: "live",
      subdomain: "ai-health-2025",
      sponsors: [],
      tags: ["AI", "Healthcare"],
      team_limit: 4,
      technologies: ["Python", "TensorFlow", "React Native"],
      type: "virtual",
      organizer_id: 201,
      organizer: {
        id: 201,
        name: "HealthTech Foundation",
        user_id: "org123",
        created_at: "2023-01-01T00:00:00Z",
        updated_at: "2023-01-02T00:00:00Z",
      },
    },

    project_challenges: [
      {
        id: 1001,
        challenge_id: 301,
        project_id: 1,
        created_at: "2025-06-01T12:00:00Z",
        updated_at: "2025-06-08T10:30:00Z",
        rank: 1,
        challenge: {
          id: 301,
          challenge_name: "Fitness Tracking with AI",
          description: "Build a solution that tracks fitness data using AI.",
          prizes: [],
          created_at: "2025-05-10T10:00:00Z",
          updated_at: "2025-05-20T10:00:00Z",
          hackathon_id: 101,
        },
        hackathon_challenges: {
          id: 301,
          challenge_name: "Fitness Tracking with AI",
          description: "Build a solution that tracks fitness data using AI.",
          prizes: [],
          created_at: "2025-05-10T10:00:00Z",
          updated_at: "2025-05-20T10:00:00Z",
          hackathon_id: 101,
        },
      },
    ],

    project_challenge: {
      id: 1001,
      challenge_id: 301,
      project_id: 1,
      created_at: "2025-06-01T12:00:00Z",
      updated_at: "2025-06-08T10:30:00Z",
      rank: 1,
      challenge: {
        id: 301,
        challenge_name: "Fitness Tracking with AI",
        description: "Build a solution that tracks fitness data using AI.",
        prizes: [],
        created_at: "2025-05-10T10:00:00Z",
        updated_at: "2025-05-20T10:00:00Z",
        hackathon_id: 101,
      },
      hackathon_challenges: {
        id: 301,
        challenge_name: "Fitness Tracking with AI",
        description: "Build a solution that tracks fitness data using AI.",
        prizes: [],
        created_at: "2025-05-10T10:00:00Z",
        updated_at: "2025-05-20T10:00:00Z",
        hackathon_id: 101,
      },
    },

    project_team_members: [
      {
        id: 401,
        created_at: "2025-06-01T14:00:00Z",
        project_id: 1,
        user_id: "user123",
        updated_at: "2025-06-01T14:30:00Z",
        users: {
          id: "user123",
          full_name: "Jane Doe",
          email: "jane@example.com",
          avatar_url: "https://randomuser.me/api/portraits/women/6.jpg",
          created_at: "2024-01-01T00:00:00Z",
          updated_at: "2024-01-01T00:00:00Z",
          role_id: 1,
          main_role: "Developer",
          profile_header_url: null,
          terms_accepted: true,
          notification_preferences: [],
          roles: null,
          project_team_members: [],
        },
      },
      {
        id: 402,
        created_at: "2025-06-01T14:05:00Z",
        project_id: 1,
        user_id: "user124",
        updated_at: "2025-06-01T14:35:00Z",
        users: {
          id: "user124",
          full_name: "John Smith",
          email: "john@example.com",
          avatar_url: "https://randomuser.me/api/portraits/men/8.jpg",
          created_at: "2024-01-02T00:00:00Z",
          updated_at: "2024-01-02T00:00:00Z",
          role_id: 2,
          main_role: "Designer",
          profile_header_url: null,
          terms_accepted: true,
          notification_preferences: [],
          roles: null,
          project_team_members: [],
        },
      },
    ],
  },
  {
    id: 4,
    name: "AI-Powered Fitness Coach",
    description:
      "“A well-built, high-impact tool with good UX and a clear use case. Needs more market validation but shows strong execution.”",
    created_at: "2025-06-01T12:00:00Z",
    updated_at: "2025-06-08T10:30:00Z",
    submitted: true,
    accepting_participants: false,
    demo_url: "https://demo.fitness-ai.app",
    project_url: "https://github.com/fakeuser/fitness-ai",
    video_url: "https://www.youtube.com/watch?v=demo_fitness_ai",
    header_url: "/images/fitness-header.png",
    logo_url: "/default-robot-1.png",
    technologies: ["React Native", "Supabase", "TensorFlow.js"],

    is_owner: true,
    project_completion_rate: 85,

    hackathons: {
      id: 101,
      name: "AI x Health Hackathon 2025",
      description: "Build AI solutions to improve physical and mental health.",
      avatar_url: "/images/ai-health.png",
      banner_url: "/images/banner-aihealth.png",
      created_at: "2025-05-15T08:00:00Z",
      updated_at: "2025-05-30T08:00:00Z",
      application_method: "apply",
      deadline_to_join: "2025-06-01T23:59:00Z",
      deadline_to_submit: "2025-06-10T23:59:00Z",
      start_date: "2025-06-01T00:00:00Z",
      end_date: "2025-06-15T23:59:00Z",
      location: "Online",
      status: "live",
      subdomain: "ai-health-2025",
      sponsors: [],
      tags: ["AI", "Healthcare"],
      team_limit: 4,
      technologies: ["Python", "TensorFlow", "React Native"],
      type: "virtual",
      organizer_id: 201,
      organizer: {
        id: 201,
        name: "HealthTech Foundation",
        user_id: "org123",
        created_at: "2023-01-01T00:00:00Z",
        updated_at: "2023-01-02T00:00:00Z",
      },
    },

    project_challenges: [
      {
        id: 1001,
        challenge_id: 301,
        project_id: 1,
        created_at: "2025-06-01T12:00:00Z",
        updated_at: "2025-06-08T10:30:00Z",
        rank: 1,
        challenge: {
          id: 301,
          challenge_name: "Fitness Tracking with AI",
          description: "Build a solution that tracks fitness data using AI.",
          prizes: [],
          created_at: "2025-05-10T10:00:00Z",
          updated_at: "2025-05-20T10:00:00Z",
          hackathon_id: 101,
        },
        hackathon_challenges: {
          id: 301,
          challenge_name: "Fitness Tracking with AI",
          description: "Build a solution that tracks fitness data using AI.",
          prizes: [],
          created_at: "2025-05-10T10:00:00Z",
          updated_at: "2025-05-20T10:00:00Z",
          hackathon_id: 101,
        },
      },
    ],

    project_challenge: {
      id: 1001,
      challenge_id: 301,
      project_id: 1,
      created_at: "2025-06-01T12:00:00Z",
      updated_at: "2025-06-08T10:30:00Z",
      rank: 1,
      challenge: {
        id: 301,
        challenge_name: "Fitness Tracking with AI",
        description: "Build a solution that tracks fitness data using AI.",
        prizes: [],
        created_at: "2025-05-10T10:00:00Z",
        updated_at: "2025-05-20T10:00:00Z",
        hackathon_id: 101,
      },
      hackathon_challenges: {
        id: 301,
        challenge_name: "Fitness Tracking with AI",
        description: "Build a solution that tracks fitness data using AI.",
        prizes: [],
        created_at: "2025-05-10T10:00:00Z",
        updated_at: "2025-05-20T10:00:00Z",
        hackathon_id: 101,
      },
    },

    project_team_members: [
      {
        id: 401,
        created_at: "2025-06-01T14:00:00Z",
        project_id: 1,
        user_id: "user123",
        updated_at: "2025-06-01T14:30:00Z",
        users: {
          id: "user123",
          full_name: "Jane Doe",
          email: "jane@example.com",
          avatar_url: "https://randomuser.me/api/portraits/women/2.jpg",
          created_at: "2024-01-01T00:00:00Z",
          updated_at: "2024-01-01T00:00:00Z",
          role_id: 1,
          main_role: "Developer",
          profile_header_url: null,
          terms_accepted: true,
          notification_preferences: [],
          roles: null,
          project_team_members: [],
        },
      },
      {
        id: 402,
        created_at: "2025-06-01T14:05:00Z",
        project_id: 1,
        user_id: "user124",
        updated_at: "2025-06-01T14:35:00Z",
        users: {
          id: "user124",
          full_name: "John Smith",
          email: "john@example.com",
          avatar_url: "https://randomuser.me/api/portraits/men/3.jpg",
          created_at: "2024-01-02T00:00:00Z",
          updated_at: "2024-01-02T00:00:00Z",
          role_id: 2,
          main_role: "Designer",
          profile_header_url: null,
          terms_accepted: true,
          notification_preferences: [],
          roles: null,
          project_team_members: [],
        },
      },
      {
        id: 402,
        created_at: "2025-06-01T14:05:00Z",
        project_id: 1,
        user_id: "user124",
        updated_at: "2025-06-01T14:35:00Z",
        users: {
          id: "user124",
          full_name: "John Smith",
          email: "john@example.com",
          avatar_url: "https://randomuser.me/api/portraits/men/11.jpg",
          created_at: "2024-01-02T00:00:00Z",
          updated_at: "2024-01-02T00:00:00Z",
          role_id: 2,
          main_role: "Designer",
          profile_header_url: null,
          terms_accepted: true,
          notification_preferences: [],
          roles: null,
          project_team_members: [],
        },
      },
      {
        id: 402,
        created_at: "2025-06-01T14:05:00Z",
        project_id: 1,
        user_id: "user124",
        updated_at: "2025-06-01T14:35:00Z",
        users: {
          id: "user124",
          full_name: "John Smith",
          email: "john@example.com",
          avatar_url: "https://randomuser.me/api/portraits/women/3.jpg",
          created_at: "2024-01-02T00:00:00Z",
          updated_at: "2024-01-02T00:00:00Z",
          role_id: 2,
          main_role: "Designer",
          profile_header_url: null,
          terms_accepted: true,
          notification_preferences: [],
          roles: null,
          project_team_members: [],
        },
      },
    ],
  },
  {
    id: 5,
    name: "AI-Powered Fitness Coach",
    description:
      "“A well-built, high-impact tool with good UX and a clear use case. Needs more market validation but shows strong execution.”",
    created_at: "2025-06-01T12:00:00Z",
    updated_at: "2025-06-08T10:30:00Z",
    submitted: true,
    accepting_participants: false,
    demo_url: "https://demo.fitness-ai.app",
    project_url: "https://github.com/fakeuser/fitness-ai",
    video_url: "https://www.youtube.com/watch?v=demo_fitness_ai",
    header_url: "/images/fitness-header.png",
    logo_url: "/CodeFundi.jpg",
    technologies: ["React Native", "Supabase", "TensorFlow.js"],

    is_owner: true,
    project_completion_rate: 85,

    hackathons: {
      id: 101,
      name: "AI x Health Hackathon 2025",
      description: "Build AI solutions to improve physical and mental health.",
      avatar_url: "/images/ai-health.png",
      banner_url: "/images/banner-aihealth.png",
      created_at: "2025-05-15T08:00:00Z",
      updated_at: "2025-05-30T08:00:00Z",
      application_method: "apply",
      deadline_to_join: "2025-06-01T23:59:00Z",
      deadline_to_submit: "2025-06-10T23:59:00Z",
      start_date: "2025-06-01T00:00:00Z",
      end_date: "2025-06-15T23:59:00Z",
      location: "Online",
      status: "live",
      subdomain: "ai-health-2025",
      sponsors: [],
      tags: ["AI", "Healthcare"],
      team_limit: 4,
      technologies: ["Python", "TensorFlow", "React Native"],
      type: "virtual",
      organizer_id: 201,
      organizer: {
        id: 201,
        name: "HealthTech Foundation",
        user_id: "org123",
        created_at: "2023-01-01T00:00:00Z",
        updated_at: "2023-01-02T00:00:00Z",
      },
    },

    project_challenges: [
      {
        id: 1001,
        challenge_id: 301,
        project_id: 1,
        created_at: "2025-06-01T12:00:00Z",
        updated_at: "2025-06-08T10:30:00Z",
        rank: 1,
        challenge: {
          id: 301,
          challenge_name: "Fitness Tracking with AI",
          description: "Build a solution that tracks fitness data using AI.",
          prizes: [],
          created_at: "2025-05-10T10:00:00Z",
          updated_at: "2025-05-20T10:00:00Z",
          hackathon_id: 101,
        },
        hackathon_challenges: {
          id: 301,
          challenge_name: "Fitness Tracking with AI",
          description: "Build a solution that tracks fitness data using AI.",
          prizes: [],
          created_at: "2025-05-10T10:00:00Z",
          updated_at: "2025-05-20T10:00:00Z",
          hackathon_id: 101,
        },
      },
    ],

    project_challenge: {
      id: 1001,
      challenge_id: 301,
      project_id: 1,
      created_at: "2025-06-01T12:00:00Z",
      updated_at: "2025-06-08T10:30:00Z",
      rank: 1,
      challenge: {
        id: 301,
        challenge_name: "Fitness Tracking with AI",
        description: "Build a solution that tracks fitness data using AI.",
        prizes: [],
        created_at: "2025-05-10T10:00:00Z",
        updated_at: "2025-05-20T10:00:00Z",
        hackathon_id: 101,
      },
      hackathon_challenges: {
        id: 301,
        challenge_name: "Fitness Tracking with AI",
        description: "Build a solution that tracks fitness data using AI.",
        prizes: [],
        created_at: "2025-05-10T10:00:00Z",
        updated_at: "2025-05-20T10:00:00Z",
        hackathon_id: 101,
      },
    },

    project_team_members: [
      {
        id: 401,
        created_at: "2025-06-01T14:00:00Z",
        project_id: 1,
        user_id: "user123",
        updated_at: "2025-06-01T14:30:00Z",
        users: {
          id: "user123",
          full_name: "Jane Doe",
          email: "jane@example.com",
          avatar_url: "https://randomuser.me/api/portraits/women/4.jpg",
          created_at: "2024-01-01T00:00:00Z",
          updated_at: "2024-01-01T00:00:00Z",
          role_id: 1,
          main_role: "Developer",
          profile_header_url: null,
          terms_accepted: true,
          notification_preferences: [],
          roles: null,
          project_team_members: [],
        },
      },
      {
        id: 402,
        created_at: "2025-06-01T14:05:00Z",
        project_id: 1,
        user_id: "user124",
        updated_at: "2025-06-01T14:35:00Z",
        users: {
          id: "user124",
          full_name: "John Smith",
          email: "john@example.com",
          avatar_url: "https://randomuser.me/api/portraits/men/1.jpg",
          created_at: "2024-01-02T00:00:00Z",
          updated_at: "2024-01-02T00:00:00Z",
          role_id: 2,
          main_role: "Designer",
          profile_header_url: null,
          terms_accepted: true,
          notification_preferences: [],
          roles: null,
          project_team_members: [],
        },
      },
    ],
  },
  {
    id: 6,
    name: "AI-Powered Fitness Coach",
    description:
      "“A well-built, high-impact tool with good UX and a clear use case. Needs more market validation but shows strong execution.”",
    created_at: "2025-06-01T12:00:00Z",
    updated_at: "2025-06-08T10:30:00Z",
    submitted: true,
    accepting_participants: false,
    demo_url: "https://demo.fitness-ai.app",
    project_url: "https://github.com/fakeuser/fitness-ai",
    video_url: "https://www.youtube.com/watch?v=demo_fitness_ai",
    header_url: "/images/fitness-header.png",
    logo_url: "/cisco.png",
    technologies: ["React Native", "Supabase", "TensorFlow.js"],

    is_owner: true,
    project_completion_rate: 85,

    hackathons: {
      id: 101,
      name: "AI x Health Hackathon 2025",
      description: "Build AI solutions to improve physical and mental health.",
      avatar_url: "/images/ai-health.png",
      banner_url: "/images/banner-aihealth.png",
      created_at: "2025-05-15T08:00:00Z",
      updated_at: "2025-05-30T08:00:00Z",
      application_method: "apply",
      deadline_to_join: "2025-06-01T23:59:00Z",
      deadline_to_submit: "2025-06-10T23:59:00Z",
      start_date: "2025-06-01T00:00:00Z",
      end_date: "2025-06-15T23:59:00Z",
      location: "Online",
      status: "live",
      subdomain: "ai-health-2025",
      sponsors: [],
      tags: ["AI", "Healthcare"],
      team_limit: 4,
      technologies: ["Python", "TensorFlow", "React Native"],
      type: "virtual",
      organizer_id: 201,
      organizer: {
        id: 201,
        name: "HealthTech Foundation",
        user_id: "org123",
        created_at: "2023-01-01T00:00:00Z",
        updated_at: "2023-01-02T00:00:00Z",
      },
    },

    project_challenges: [
      {
        id: 1001,
        challenge_id: 301,
        project_id: 1,
        created_at: "2025-06-01T12:00:00Z",
        updated_at: "2025-06-08T10:30:00Z",
        rank: 1,
        challenge: {
          id: 301,
          challenge_name: "Fitness Tracking with AI",
          description: "Build a solution that tracks fitness data using AI.",
          prizes: [],
          created_at: "2025-05-10T10:00:00Z",
          updated_at: "2025-05-20T10:00:00Z",
          hackathon_id: 101,
        },
        hackathon_challenges: {
          id: 301,
          challenge_name: "Fitness Tracking with AI",
          description: "Build a solution that tracks fitness data using AI.",
          prizes: [],
          created_at: "2025-05-10T10:00:00Z",
          updated_at: "2025-05-20T10:00:00Z",
          hackathon_id: 101,
        },
      },
    ],

    project_challenge: {
      id: 1001,
      challenge_id: 301,
      project_id: 1,
      created_at: "2025-06-01T12:00:00Z",
      updated_at: "2025-06-08T10:30:00Z",
      rank: 1,
      challenge: {
        id: 301,
        challenge_name: "Fitness Tracking with AI",
        description: "Build a solution that tracks fitness data using AI.",
        prizes: [],
        created_at: "2025-05-10T10:00:00Z",
        updated_at: "2025-05-20T10:00:00Z",
        hackathon_id: 101,
      },
      hackathon_challenges: {
        id: 301,
        challenge_name: "Fitness Tracking with AI",
        description: "Build a solution that tracks fitness data using AI.",
        prizes: [],
        created_at: "2025-05-10T10:00:00Z",
        updated_at: "2025-05-20T10:00:00Z",
        hackathon_id: 101,
      },
    },

    project_team_members: [
      {
        id: 401,
        created_at: "2025-06-01T14:00:00Z",
        project_id: 1,
        user_id: "user123",
        updated_at: "2025-06-01T14:30:00Z",
        users: {
          id: "user123",
          full_name: "Jane Doe",
          email: "jane@example.com",
          avatar_url: "https://randomuser.me/api/portraits/women/5.jpg",
          created_at: "2024-01-01T00:00:00Z",
          updated_at: "2024-01-01T00:00:00Z",
          role_id: 1,
          main_role: "Developer",
          profile_header_url: null,
          terms_accepted: true,
          notification_preferences: [],
          roles: null,
          project_team_members: [],
        },
      },
      {
        id: 402,
        created_at: "2025-06-01T14:05:00Z",
        project_id: 1,
        user_id: "user124",
        updated_at: "2025-06-01T14:35:00Z",
        users: {
          id: "user124",
          full_name: "John Smith",
          email: "john@example.com",
          avatar_url: "https://randomuser.me/api/portraits/men/7.jpg",
          created_at: "2024-01-02T00:00:00Z",
          updated_at: "2024-01-02T00:00:00Z",
          role_id: 2,
          main_role: "Designer",
          profile_header_url: null,
          terms_accepted: true,
          notification_preferences: [],
          roles: null,
          project_team_members: [],
        },
      },
    ],
  },
];

export type MockProjectType = {
  id: number;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
  submitted: boolean;
  accepting_participants: boolean;
  demo_url: string;
  project_url: string;
  video_url: string;
  header_url: string;
  logo_url: string;
  technologies: string[];
  is_owner: boolean;
  project_completion_rate: number;

  hackathons: {
    id: number;
    name: string;
    description: string;
    avatar_url: string;
    banner_url: string;
    created_at: string;
    updated_at: string;
    application_method: string;
    deadline_to_join: string;
    deadline_to_submit: string;
    start_date: string;
    end_date: string;
    location: string;
    status: string;
    subdomain: string;
    sponsors: any[];
    tags: string[];
    team_limit: number;
    technologies: string[];
    type: string;
    organizer_id: number;
    organizer: {
      id: number;
      name: string;
      user_id: string;
      created_at: string;
      updated_at: string;
    };
  };

  project_challenges: {
    id: number;
    challenge_id: number;
    project_id: number;
    created_at: string;
    updated_at: string;
    rank: number;
    challenge: {
      id: number;
      challenge_name: string;
      description: string;
      prizes: any[];
      created_at: string;
      updated_at: string;
      hackathon_id: number;
    };
    hackathon_challenges: {
      id: number;
      challenge_name: string;
      description: string;
      prizes: any[];
      created_at: string;
      updated_at: string;
      hackathon_id: number;
    };
  }[];

  project_challenge: {
    id: number;
    challenge_id: number;
    project_id: number;
    created_at: string;
    updated_at: string;
    rank: number;
    challenge: {
      id: number;
      challenge_name: string;
      description: string;
      prizes: any[];
      created_at: string;
      updated_at: string;
      hackathon_id: number;
    };
    hackathon_challenges: {
      id: number;
      challenge_name: string;
      description: string;
      prizes: any[];
      created_at: string;
      updated_at: string;
      hackathon_id: number;
    };
  };

  project_team_members: {
    id: number;
    created_at: string;
    project_id: number;
    user_id: string;
    updated_at: string;
    users: {
      id: string;
      full_name: string;
      email: string;
      avatar_url: string;
      created_at: string;
      updated_at: string;
      role_id: number;
      main_role: string;
      profile_header_url: string | null;
      terms_accepted: boolean;
      notification_preferences: any[];
      roles: any | null;
      project_team_members: any[];
    };
  }[];
};
