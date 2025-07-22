

type ConsenetDataTypes = {
  id: string;
  title: string;
  description: string;
  linkUrl?: string;
  linkText?: string;
  afterLinkText?: string;
  required: boolean;
};

export const consentItems: ConsenetDataTypes[] = [
  {
    id: "legal-age",
    title: "Confirm You Are of Legal Age to Participate",
    description:
      "By clicking here, you confirm that you meet the minimum legal age requirement as defined in the ",
    linkText: "hackathon's rules",
    linkUrl:
      "https://drive.google.com/file/d/10WhGckc0U3hxhFRLvd5rO7FnFZkresxX/view?usp=sharing",
    afterLinkText: "and are eligible to participate under applicable laws.",
    required: true,
  },
  {
    id: "eligibility",
    title: "Confirm Eligibility Based on Jurisdiction",
    description:
      "By clicking here, you confirm that you are participating from a jurisdiction where participation in the hackathon is legally permissible and not restricted by local laws or regulations.",
    required: true,
  },
  {
    id: "confirm-conflicts",
    title: "Confirm No Conflict of Interest",
    description:
      "By clicking here, you confirm that you are not an employee, sponsor, judge, or representative of any government entity that may be prohibited from participating in this hackathon due to conflict of interest or other restrictions.",
    required: true,
  },
  {
    id: "accept-rule",
    title: "Accept Hackathon Rules and Participation Terms",
    description: "By clicking here, you agree to adhere to the",
    linkText:
      "hackathon’s official rules, code of conduct, and Terms & Conditions ",
    linkUrl: `${process.env.NEXT_PUBLIC_PROTOCOL}${process.env.NEXT_PUBLIC_BASE_SITE_URL}/code-of-conduct`,
    afterLinkText: "as outlined in the hackathon agreement document",
    required: true,
  },
  {
    id: "t-and-c",
    title: "Agree to Terms & Conditions",
    description:
      "By clicking here, you confirm that you have read, understood, and agreed to the hackathon’s ",
    linkText: "Terms & Conditions",
    linkUrl: `${process.env.NEXT_PUBLIC_PROTOCOL}${process.env.NEXT_PUBLIC_BASE_SITE_URL}/terms-and-condition`,
    afterLinkText:
      "including rules related to intellectual property, liability, and eligibility requirements.",
    required: true,
  },
];

