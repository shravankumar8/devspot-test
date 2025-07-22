import { useTechOwnerStore } from "@/state/techOwnerStore";
import axios from "axios";
import { mutate } from "swr";
import { HackathonFormData } from "./types";
import { combineDateAndTime } from "./utils";

export const useHackathonSubmission = (hackathonId: number) => {
  const { selectedOrg } = useTechOwnerStore();

  const submitHackathon = async (values: HackathonFormData) => {
    const submissionData = {
      type: values.eventType,
      hackathon_start_date: combineDateAndTime(
        values.hackathonStart.date,
        values.hackathonStart.time
      ),
      hackathon_end_date: combineDateAndTime(
        values.hackathonEnd.date,
        values.hackathonEnd.time
      ),
      registration_start_date: combineDateAndTime(
        values.registrationStart.date,
        values.registrationStart.time
      ),
      deadline_to_join: combineDateAndTime(
        values.registrationEnd.date,
        values.registrationEnd.time
      ),
      submission_start_date: combineDateAndTime(
        values.submissionStart.date,
        values.submissionStart.time
      ),
      deadline_to_submit: combineDateAndTime(
        values.submissionEnd.date,
        values.submissionEnd.time
      ),
      winners_announcement_date: combineDateAndTime(
        values.winnerAnnouncement.date,
        values.winnerAnnouncement.time
      ),
      showSubmissionCountdown: values.showSubmissionCountdown,
      showDeadlineCountdown: values.showDeadlineCountdown,
      rules: values.hackathonRulesLink,
      communication_link: values.hackathonCommunicationLink,
    };

    const formattedPayload = {
      type: values.eventType,
      hackathon_start_date_time: submissionData.hackathon_start_date,
      hackathon_end_date_time: submissionData.hackathon_end_date,
      registration_start_date_time: submissionData.registration_start_date,
      registration_end_date_time: submissionData.deadline_to_join,
      project_submission_start_date_time: submissionData.submission_start_date,
      project_submission_end_date_time: submissionData.deadline_to_submit,
      rules: submissionData.rules,
      communication_link: submissionData.communication_link,
      winners_announcement_date: submissionData.winners_announcement_date,
      show_submission_deadline_countdown:
        submissionData.showSubmissionCountdown,
      show_registration_deadline_countdown:
        submissionData.showDeadlineCountdown,
    };

    await axios.put(
      `/api/technology-owners/${selectedOrg?.technology_owner_id}/hackathons/${hackathonId}/edit/details`,
      formattedPayload
    );

    mutate(`/api/hackathons/${hackathonId}/overview`);

    return submissionData;
  };

  return { submitHackathon };
};
