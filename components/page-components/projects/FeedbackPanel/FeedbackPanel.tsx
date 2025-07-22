import { ProjectChallenges } from "@/types/entities";
import { Form, Formik, FormikProps } from "formik";
import { useState } from "react";
import * as Yup from "yup";
import { ChallengeFeedbackData, ChallengeForm } from "./ChallengeForm";
import { CollapsibleCard } from "./CollapsibleCard";
import { HackathonFeedbackData, HackathonForm } from "./HackathonForm";
import { NavigationControls } from "./NavigationControls";
import { StepHeader } from "./StepHeader";

export interface FormData {
  challengeFeedbacks: ChallengeFeedbackData[];
  hackathonFeedback: HackathonFeedbackData;
}

interface FeedbackPanelProps {
  selectedChallenges: ProjectChallenges[];
  hackathonId: number;
  initialFeedbackValues?: FormData;
  onSubmit: (data: FormData) => Promise<void>;
}

const challengeSchema = Yup.object().shape({
  overall_rating: Yup.number().required().min(1).max(5),
  docs_rating: Yup.number().required().min(1).max(5),
  support_rating: Yup.number().required().min(1).max(5),
  challenge_recommendation_rating: Yup.number().required().min(1).max(5),
  comments: Yup.string().required(),
});

const hackathonSchema = Yup.object().shape({
  question1_rating: Yup.number().required().min(1).max(5),
  question2_rating: Yup.number().required().min(1).max(5),
  question3_rating: Yup.number().required().min(1).max(5),
  question4_rating: Yup.number().required().min(1).max(5),
  comments: Yup.string().required(),
});

export default function FeedbackPanel(props: FeedbackPanelProps) {
  const { selectedChallenges, hackathonId, initialFeedbackValues, onSubmit } =
    props;
  const [currentStep, setCurrentStep] = useState(0);
  const [collapsed, setCollapsed] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const totalSteps = selectedChallenges.length + 1;
  const isLast = currentStep === totalSteps - 1;
  const isHackathon = currentStep === selectedChallenges.length;

  const getInit = () =>
    initialFeedbackValues ?? {
      challengeFeedbacks: selectedChallenges.map((c) => ({
        challenge_id: c.hackathon_challenges?.id ?? 0,
        overall_rating: null,
        docs_rating: null,
        support_rating: null,
        challenge_recommendation_rating:null,
        comments: null,
      })),
      hackathonFeedback: {
        hackathon_id: hackathonId,
        question1_rating: null,
        question2_rating: null,
        question3_rating: null,
        question4_rating: null,
        comments: null,
      },
    };

  const validationSchema = Yup.object().shape({
    challengeFeedbacks: Yup.array().of(challengeSchema).required(),
    hackathonFeedback: hackathonSchema,
  });

  return (
    <Formik
      initialValues={getInit()}
      validationSchema={validationSchema}
      onSubmit={async (values) => {}}
    >
      {(fm: FormikProps<FormData>) => {
        const disableNext = Boolean(
          isHackathon
            ? fm.errors.hackathonFeedback
            : fm.errors.challengeFeedbacks?.[currentStep]
        );

        return (
          <Form>
            <CollapsibleCard collapsed={collapsed}>
              <StepHeader
                collapsed={collapsed}
                onToggle={() => setCollapsed(!collapsed)}
                label={
                  isHackathon
                    ? "your overall hackathon experience"
                    : `the technologies you used for ${selectedChallenges[currentStep].hackathon_challenges?.challenge_name}`
                }
              />

              {!collapsed && (
                <>
                  {isHackathon ? (
                    <HackathonForm
                      values={fm.values.hackathonFeedback}
                      setFieldValue={fm.setFieldValue}
                    />
                  ) : (
                    <ChallengeForm
                      index={currentStep}
                      values={fm.values.challengeFeedbacks[currentStep]}
                      setFieldValue={fm.setFieldValue}
                    />
                  )}

                  <NavigationControls
                    currentStep={currentStep}
                    totalSteps={totalSteps}
                    isLast={isLast}
                    onPrevious={() => setCurrentStep((s) => s - 1)}
                    onNext={() => {
                      // validate current step before
                      fm.validateForm().then((err) => {
                        const hasErrors = isHackathon
                          ? !!err.hackathonFeedback
                          : !!err.challengeFeedbacks?.[currentStep];

                        if (!hasErrors) {
                          if (!isHackathon) {
                            fm.setFieldValue(
                              `challengeFeedbacks.${currentStep}.challenge_id`,
                              selectedChallenges[currentStep]
                                ?.hackathon_challenges.id
                            );
                          }
                          setCurrentStep((s) => s + 1);
                        }
                      });
                    }}
                    onSubmit={async () => {
                      try {
                        setSubmitting(true);
                        await onSubmit(fm.values);
                        setSubmitting(false);
                      } catch (error) {
                        setSubmitting(false);
                      }
                    }}
                    submitting={submitting}
                    disableNext={disableNext}
                  />
                </>
              )}
            </CollapsibleCard>
          </Form>
        );
      }}
    </Formik>
  );
}
