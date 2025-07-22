import Label from "@/components/common/form/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Hackathons } from "@/types/entities";
import { Form, Formik } from "formik";
import { LinkIcon } from "lucide-react";
import { memo, useMemo } from "react";
import { toast } from "sonner";
import { FormikDateTimeField, FormikEventTypeSelector } from "./formikFields";
import { HackathonFormData, SubmitResponsePayload } from "./types";
import useHackathonValidation from "./useHackathonValidation";
import { parseExistingDateTime } from "./utils";

export interface HackathonFormProps {
  hackathonData: Hackathons;
  onSubmit: (values: HackathonFormData) => Promise<SubmitResponsePayload>;
  onClose: () => void;
}

const HackathonForm = ({ hackathonData, onSubmit }: HackathonFormProps) => {
  const initialValues: HackathonFormData = useMemo(() => {
    return {
      eventType: hackathonData.type,
      hackathonStart: parseExistingDateTime(hackathonData.start_date),
      hackathonEnd: parseExistingDateTime(hackathonData.end_date),
      registrationStart: parseExistingDateTime(
        hackathonData.registration_start_date
      ),
      registrationEnd: parseExistingDateTime(hackathonData.deadline_to_join),
      submissionStart: parseExistingDateTime(
        hackathonData.submission_start_date
      ),
      submissionEnd: parseExistingDateTime(hackathonData.deadline_to_submit),
      showSubmissionCountdown: false,
      showDeadlineCountdown: false,
      hackathonCommunicationLink: hackathonData.communication_link,
      hackathonRulesLink: hackathonData.rules,
      winnerAnnouncement: parseExistingDateTime(
        hackathonData.winners_announcement_date
      ),
    };
  }, [hackathonData]);

  const { validateDates } = useHackathonValidation();

  return (
    <Formik
      initialValues={initialValues}
      validate={validateDates}
      onSubmit={async (values, { resetForm }) => {
        try {
          const response = await onSubmit(values);
          toast.success("Updated Hackathon Details Successfully", {
            position: "top-right",
          });

          resetForm();
        } catch (error: any) {
          console.error("Error updating header information:", error);
          toast.error(`Could not Update Header Information ${error?.message}`, {
            position: "top-right",
          });
        }
      }}
      enableReinitialize
    >
      {({ isValid, isSubmitting, values, handleChange }) => (
        <Form className="space-y-6 p-1 font-roboto">
          <FormikEventTypeSelector />

          <div className="flex flex-col gap-3 w-full">
            <Label>Hackathon Rules</Label>

            <Input
              id="hackathonRulesLink"
              name="hackathonRulesLink"
              onChange={handleChange}
              value={values.hackathonRulesLink ?? ""}
              placeholder="https://drive.google.com/file/d/10WhGckc0U3hxhFRLvd5rO7FnFZkresxX/view?usp=sharing"
              prefixIcon={<LinkIcon className="w-5 h-5 text-main-primary" />}
            />
          </div>

          <div className="flex flex-col gap-3 w-full">
            <Label>Add your hackathon’s Discord, Slack, or Telegram link</Label>

            <Input
              id="hackathonCommunicationLink"
              name="hackathonCommunicationLink"
              onChange={handleChange}
              value={values.hackathonCommunicationLink ?? ""}
              placeholder="https://discord.gg/discordlink"
              prefixIcon={<LinkIcon className="w-5 h-5 text-main-primary" />}
            />
          </div>

          <FormikDateTimeField
            fieldName="hackathonStart"
            label="Hackathon start date"
            description="This is the Date the Hackathon Starts."
          />

          <FormikDateTimeField
            fieldName="hackathonEnd"
            label="Hackathon End date"
            description="This is the Date the Overall Hackathon Ends."
          />
          <FormikDateTimeField
            fieldName="registrationStart"
            label="Registration start date"
            description="If your hackathon is accepting applications, this is the date applications open."
          />

          <FormikDateTimeField
            fieldName="registrationEnd"
            label="Registration end date"
            description="If your hackathon is accepting applications, this is the application deadline."
          />

          <FormikDateTimeField
            fieldName="submissionStart"
            label="Project submission opens"
            hasCountdownToggle
            countdownFieldName="showSubmissionCountdown"
          />

          <FormikDateTimeField
            fieldName="submissionEnd"
            label="Project submission deadline"
            hasCountdownToggle
            countdownFieldName="showDeadlineCountdown"
          />
          <FormikDateTimeField
            fieldName="winnerAnnouncement"
            label="Winners announcement date"
          />

          <div className="w-full flex sm:justify-end justify-center my-4">
            <Button
              type="submit"
              className="w-fit font-roboto text-sm gap-2"
              disabled={!isValid || isSubmitting}
            >
              {isSubmitting && <Spinner size="small" />} Save
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

HackathonForm.displayName = "HackathonForm";

export default memo(HackathonForm);
