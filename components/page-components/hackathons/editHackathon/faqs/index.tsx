"use client";

import { TextArea } from "@/components/common/form/textarea";
import { DragIcon } from "@/components/icons/Location";
import EditProfileIcon from "@/components/page-components/profile/EditProfileIcon";
import { Button } from "@/components/ui/button";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import GenericModal from "@/components/ui/generic-modal";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import UseModal from "@/hooks/useModal";
import { Plus, Trash2Icon } from "lucide-react";
import { useFAQsForm } from "./useFAQs";

interface HackathonFaqs {
  answer: string;
  clicks: number | null;
  created_at: string;
  hackathon_id: number;
  id: number;
  question: string;
  updated_at: string;
}

interface FaqItem {
  id: number;
  question: string;
  answer: string;
}

export const EditFAQsModal = ({
  initialFaqs,
  onSave,
}: {
  initialFaqs?: HackathonFaqs[];
  onSave?: (faqs: FaqItem[]) => Promise<void>;
}) => {
  const { closeModal: onClose, isOpen, openModal: onOpen } = UseModal();

  // console.log(initialFaqs)

  const transformedInitialFAQs = initialFaqs?.map((faq, index) => ({
    id: faq.id || index + 1,
    question: faq.question,
    answer: faq.answer,
  }));

  const { formik, addFAQ, removeFAQ, updateFAQ } = useFAQsForm(
    transformedInitialFAQs
  );

  const handleSave = async () => {
    const result = await formik.submitForm();
    if (formik.isValid && onSave) {
      try {
        await onSave(formik.values.faqs);
        onClose();
      } catch (error) {
        console.error("Error saving FAQs:", error);
      }
    }
  };

  // Helper function to safely access error messages
  const getErrorMessage = (id: number, field: keyof FaqItem) => {
    if (!formik.errors.faqs || !Array.isArray(formik.errors.faqs)) return null;

    const faqIndex = formik.values.faqs.findIndex((f) => f.id === id);
    if (faqIndex === -1) return null;

    const error = formik.errors.faqs[faqIndex];
    if (typeof error === "string") return error;
    if (error && typeof error === "object") {
      return error[field] as string | undefined;
    }
    return null;
  };


  return (
    <GenericModal
      controls={{
        isOpen,
        onClose,
        onOpen,
      }}
      trigger={
        <button className="absolute bottom-4 right-4 z-20 cursor-pointer">
          <EditProfileIcon size="lg" />
        </button>
      }
    >
      <DialogHeader className="bg-[#1B1B22] py-2">
        <DialogTitle className="!text-[24px] font-semibold">
          Edit FAQs
        </DialogTitle>
      </DialogHeader>

      <form
        onSubmit={formik.handleSubmit}
        className="flex flex-col overflow-y-scroll"
      >
        <p className="text-secondary-text text-sm mb-3 font-roboto">
          Include frequently asked questions about your hackathon.
        </p>

        <div className="h-[520px] overflow-y-scroll">
          {formik.values.faqs?.map((faq) => {
            const questionError = getErrorMessage(faq.id, "question");
            const answerError = getErrorMessage(faq.id, "answer");

            return (
              <div key={faq.id} className="mb-4">
                <div className="space-y-3">
                  <div className="flex gap-4 items-center">
                    <DragIcon />
                    <Input
                      name={`faqs[${faq.id}].question`}
                      value={faq.question}
                      placeholder="Enter your question here..."
                      onChange={(e) =>
                        updateFAQ(faq.id, "question", e.target.value)
                      }
                      onBlur={formik.handleBlur}
                    />
                    <Trash2Icon
                      className="size-5 stroke-[#89898C] cursor-pointer hover:stroke-red-500 transition"
                      onClick={() => removeFAQ(faq.id)}
                    />
                  </div>

                  {questionError && (
                    <div className="text-red-500 text-sm ml-10">
                      {questionError}
                    </div>
                  )}

                  <div className="flex gap-4 items-start">
                    <div className="w-4"></div>
                    <TextArea
                      name={`faqs[${faq.id}].answer`}
                      value={faq.answer}
                      placeholder="Enter the answer to this question..."
                      onChange={(e) =>
                        updateFAQ(faq.id, "answer", e.target.value)
                      }
                      onBlur={formik.handleBlur}
                      showMaxLength={false}
                      maxLength={500}
                    />
                    <div className="w-5"></div>
                  </div>

                  {answerError && (
                    <div className="text-red-500 text-sm ml-10">
                      {answerError}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex justify-between w-full pt-6">
          <Button
            type="button"
            variant="ghost"
            onClick={addFAQ}
            className="text-gray-300 hover:text-white px-4 py-2"
          >
            <Plus className="h-4 w-4 mr-2" />
            New FAQ
          </Button>
          <Button
            type="button"
            disabled={formik.isSubmitting}
            onClick={handleSave}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            {formik.isSubmitting && <Spinner size="small" />} Save
          </Button>
        </div>
      </form>
    </GenericModal>
  );
};
