interface FeedbackData {
  eventTitle: string;
  sponsor: string;
  sponsorType: string;
  overallHackathonExperience: number;
  likelinessToRecommendHackathon: number;
  overallDevSpotExperience: number;
  likelinessToRecommendDevSpot: number;
  overallExperience: number;
  docsExperience: number;
  supportExperience: number;
  likelinessToRecommendChallenge: number;
  testimonials: string[];
}

export const exportToCSV = (data: FeedbackData[]) => {
  const headers = [
    "Event Title",
    "Sponsor",
    "Sponsor Type",
    "Overall Hackathon Experience",
    "Likeliness to Recommend Hackathon",
    "Overall DevSpot Experience",
    "Likeliness to Recommend DevSpot",
    "Overall Experience",
    "Docs Experience",
    "Support Experience",
    "Likeliness to Recommend Challenge",
    "Testimonials",
  ];

  const csvContent = [
    headers.join(","),
    ...data.map((row) =>
      [
        `"${row.eventTitle}"`,
        `"${row.sponsor}"`,
        `"${row.sponsorType}"`,
        row.overallHackathonExperience,
        row.likelinessToRecommendHackathon,
        row.overallDevSpotExperience,
        row.likelinessToRecommendDevSpot,
        row.overallExperience,
        row.docsExperience,
        row.supportExperience,
        row.likelinessToRecommendChallenge,
        `"${row.testimonials.join("; ")}"`,
      ].join(",")
    ),
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);

  link.setAttribute("href", url);
  link.setAttribute("download", "feedback-data.csv");
  link.style.visibility = "hidden";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
