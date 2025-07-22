interface DateTimeState {
  date: Date | undefined | null;
  time: string | null;
}

interface FormValidationError {
  field: string;
  message: string;
}

interface HackathonFormData {
  eventType: "virtual" | "physical";
  hackathonRulesLink: string | null;
  hackathonCommunicationLink: string | null;
  hackathonStart: DateTimeState;
  hackathonEnd: DateTimeState;
  registrationStart: DateTimeState;
  registrationEnd: DateTimeState;
  submissionStart: DateTimeState;
  submissionEnd: DateTimeState;
  winnerAnnouncement: DateTimeState;
  showSubmissionCountdown: boolean;
  showDeadlineCountdown: boolean;
}

interface SubmitResponsePayload {
  type: "virtual" | "physical";
  hackathon_start_date: string;
  hackathon_end_date: string;
  registration_start_date: string;
  deadline_to_join: string;
  submission_start_date: string;
  deadline_to_submit: string;
  showSubmissionCountdown: boolean;
  showDeadlineCountdown: boolean;
  rules: string | null;
  communication_link: string | null;
  winners_announcement_date: string | null;
}

export type {
  DateTimeState,
  FormValidationError,
  HackathonFormData,
  SubmitResponsePayload,
};
