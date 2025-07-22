"use client";

import { Checkbox } from "@/components/common/Checkbox";
import { RightArrow } from "@/components/icons/Location";
import { ProgressStep } from "@/components/page-components/auth/ProgressStep";
import { Button } from "@/components/ui/button";
import { consentItems } from "@/mocked_data/data-helpers/hackathons/legal-data";
import { useUserStore } from "@/state";
import { useHackathonStore } from "@/state/hackathon";
import { Hackathons } from "@/types/entities";
import axios, { AxiosError } from "axios";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import useSWR from "swr";

type Question = {
  id: number;
  question: string;
  order: number;
};

const Applications = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [consents, setConsents] = useState<Record<string, boolean>>({});
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<number, string>>({});

  const params = useParams();
  const id = params.hackathon as string;

  const router = useRouter();
  const { updateUserHackathon } = useUserStore();
  const { selectedHackathon } = useHackathonStore();

  const fetchHackathonInformation = async (url: string) => {
    try {
      const response = await axios.get(url);
      return response.data?.data;
    } catch (error) {
      console.log(error);
    }
  };

  const {
    data: fetchedHackathon,
    error: fetchHackathonError,
    isLoading,
    mutate,
  } = useSWR(`/api/hackathons/${id}`, fetchHackathonInformation, {
    revalidateOnMount: false,
  });

  if (fetchHackathonError || !id) {
    toast.error("Invalid Hackathon");
    router.push("/hackathons");
  }

  useEffect(() => {
    if (!selectedHackathon) {
      mutate();
    }
  }, [selectedHackathon]);

  const hackathonInformation: Hackathons = useMemo(() => {
    return selectedHackathon ?? fetchedHackathon;
  }, [fetchedHackathon, selectedHackathon]);

  useEffect(() => {
    if (!id) {
      toast.error("Invalid Hackathon");
      router.push("/hackathons");
    }
  }, [id]);

  const fetchData = async (url: string) => {
    try {
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  };
  const { data: profileCompletion } = useSWR<{
    completionPercentage: number;
  }>("/api/profile/profile-completion", fetchData);

  useEffect(() => {
    // Simulate API fetch
    const fetchQuestions = async () => {
      const res = await axios.get(
        `/api/hackathons/${id}/apply/additional-questions`
      );
      setQuestions(res.data.data);
      // Initialize empty answers
      const initialAnswers: Record<number, string> = {};
      res.data.data.forEach((q: Question) => {
        initialAnswers[q.id] = "";
      });
      setAnswers(initialAnswers);
    };

    fetchQuestions();
  }, []);

  const { data: profileData } = useSWR("/api/profile", fetchPersonalInfo);

  async function fetchPersonalInfo(url: string) {
    try {
      const response = await axios.get(url);
      console.log(response);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }

  const handleConsentChange = (id: string) => {
    console.log(id);
    setConsents((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleContinue = () => {
    updateUserHackathon(id, {
      applicationProgress: 66, // 2/3 of the way through
    });

    setCurrentStep(3);
  };

  const handleExit = () => {
    router.push(`/hackathons/${id}`);
  };

  const handleInputChange = (field: keyof typeof answers, value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [field]: value,
    }));
  };
  const handleAnswerChange = (id: number, value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const allAnswered = Object.values(answers).every((val) => val.trim() !== "");

  const allRequiredConsentsChecked = consentItems
    .filter((item) => item.required)
    .every((item) => consents[item.id]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleProgression = async () => {
    if (!allRequiredConsentsChecked || !hackathonInformation) return;

    updateUserHackathon(id, {
      applicationProgress: 100,
      status: "pending",
    });

    setIsSubmitting(true);
    try {
      const payload = Object.entries(answers).map(([key, value]) => ({
        questionId: Number(key),
        answer: value,
      }));
      // Submit Answers

      const response = await axios.post(
        `/api/hackathons/${id}/apply/answer-questionnaire`,
        payload
      );

      if (!response) throw new Error("Could not Submit Answers");

      const res = await axios.post(`/api/hackathons/${id}/join`, {
        joinType: "apply_additional",
      });

      router.push(`/hackathons/${id}`);

      setIsSubmitting(false);
    } catch (error) {
      console.log(error);
      if (error instanceof AxiosError) {
        toast.error(
          `Could not Submit Answers: ${error?.response?.data?.error}`
        );
        return;
      }
      toast.error(`Could not Submit Answers`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepContent = () => {
    if (currentStep === 1) {
      return (
        <div className="w-full relative p-5 sm:mt-0 mt-12">
          <div>
            <h2 className="text-[20px] sm:text-[24px] sticky left-6 top-0 font-semibold font-inter">
              Apply to attend
            </h2>
            <p className="font-inter text-[16px] mt-6">
              We will complete your application based on your profile and send
              it to the organizers.
            </p>
          </div>

          <div className="flex items-center gap-16 w-full justify-center mt-8">
            <img
              src={profileData?.avatar_url}
              alt={profileData?.full_name}
              className="w-24 h-24 sm:w-40 sm:h-40 rounded-full object-cover mb-4"
            />

            <RightArrow />

            <img
              src="/microsoft-placeholder.jpg"
              className="w-24 h-24 sm:w-32 sm:h-32 object-cover mb-4"
              alt="organizer logo"
            />
          </div>

          <div>
            <p className="font-inter text-[16px] mt-6">
              Your profile is {profileCompletion?.completionPercentage}%
              complete. For a better chance of getting accepted, complete your
              profile before <br /> applying.
            </p>
          </div>

          <div className="flex w-full justify-between sm:items-center mt-10 sm:flex-row flex-col sm:gap-0 gap-3">
            <Button
              onClick={handleExit}
              variant="tertiary"
              className="w-fit"
              size="lg"
            >
              Exit
            </Button>
            <div className="w-full flex sm:justify-end gap-3">
              <Link href={`/profile?profileTabSelected=hackathons`}>
                <Button variant="secondary">Edit my profile</Button>
              </Link>
              <Button onClick={() => setCurrentStep(2)}>Continue</Button>
            </div>
          </div>
        </div>
      );
    }

    if (currentStep === 2) {
      return (
        <div className="max-w-[1100px] sm:px-0 px-2 sm:mt-6 mt-12">
          <div className="mx-auto w-full lg:min-w-[750px]">
            <button
              onClick={() => setCurrentStep(1)}
              className="inline-flex items-center text-[#4e52f5] mb-8"
            >
              <ArrowLeft className="mr-2 h-5 w-5" />
            </button>

            <h1 className="text-3xl font-bold mb-8">
              Answer some additional questions
            </h1>

            <div className="flex-1 space-y-8 font-roboto">
              {questions.length > 0 ? (
                questions.map((q) => (
                  <div key={q.id}>
                    <p className="font-semibold mb-2">
                      {q.order}. {q.question}
                    </p>
                    <textarea
                      value={answers[q.id]}
                      onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                      placeholder="Type your response here"
                      className="w-full bg-[#1b1b22] border border-[#2b2b31] rounded-md p-4 text-white min-h-[100px] font-inter placeholder:text-[#89898C]"
                      rows={4}
                    />
                  </div>
                ))
              ) : (
                <div className="h-[200px] flex justify-center items-center">
                  <p className="text-base font-roboto text-secondary-text">
                    No questions found
                  </p>
                </div>
              )}
            </div>

            <div className="flex justify-between mt-12 items-center">
              <Button
                onClick={handleExit}
                variant="tertiary"
                className="w-fit"
                size="lg"
              >
                Exit
              </Button>

              <Button onClick={handleContinue} disabled={!allAnswered}>
                Continue
              </Button>
            </div>
          </div>
        </div>
      );
    }

    if (currentStep === 3) {
      return (
        <div className="max-w-[1100px] sm:px-0 px-2 sm:mt-6 mt-12">
          <div className="mx-auto w-full lg:min-w-[750px]">
            <button
              onClick={() => setCurrentStep(2)}
              className="inline-flex items-center text-[#4e52f5] mb-8"
            >
              <ArrowLeft className="mr-2 h-5 w-5" />
            </button>

            <h1 className="text-3xl font-bold mb-2">Legal Opt-ins</h1>

            <div className="flex-1 space-y-8 font-roboto">
              <p className="text-[#89898c] mb-2 font-roboto text-[16px]">
                Please agree to the following legal terms.
              </p>

              <div className="max-w-3xl mx-auto space-y-3">
                {consentItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between gap-4 p-3 rounded-lg bg-tertiary-bg text-gray-300"
                  >
                    <div className="space-y-2 basis-[80%]">
                      <h3 className="text-[16px] font-roboto font-medium text-white">
                        {item?.title}
                      </h3>
                      <p className="text-sm text-secondary-text">
                        {item?.description}{" "}
                        {item?.linkUrl && (
                          <>
                            <Link
                              href={item?.linkUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-white hover:underline"
                            >
                              {item?.linkText}
                            </Link>{" "}
                            {item?.afterLinkText}
                          </>
                        )}
                      </p>
                    </div>

                    <div className="">
                      <Checkbox
                        checked={!!consents[item.id]}
                        onCheckedChange={() => handleConsentChange(item.id)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-between mt-12 items-center">
              <Button
                onClick={handleExit}
                variant="tertiary"
                className="w-fit"
                size="lg"
              >
                Exit
              </Button>

              <Button
                loading={isSubmitting}
                disabled={!allRequiredConsentsChecked || isSubmitting}
                onClick={handleProgression}
                className="bg-[#424248] hover:bg-[#4e52f5] text-white px-6"
              >
                Submit
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="relative">
      <div className="absolute md:left-12 lg:left-48 md:top-[34%] top-4 left-1/2 -translate-x-1/2">
        <ProgressStep activeStep={currentStep} stepsNumber={3} />
      </div>
      <main className="min-h-screen grid place-content-center px-5">
        {renderStepContent()}
      </main>
    </div>
  );
};

export default Applications;
