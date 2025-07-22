"use client";

import { TextArea } from "@/components/common/form/textarea";
import { DragIcon } from "@/components/icons/Location";
import { Button } from "@/components/ui/button";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import GenericModal from "@/components/ui/generic-modal";
import { Input } from "@/components/ui/input";
import UseModal from "@/hooks/useModal";

import { Spinner } from "@/components/ui/spinner";
import { Plus, Trash2Icon } from "lucide-react";
import { useEffect, useState } from "react";
import EditProfileIcon from "../profile/EditProfileIcon";

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
  initialFaqs = [],
  onSave,
}: {
  initialFaqs?: HackathonFaqs[];
  onSave?: (faqs: FaqItem[]) => Promise<void>;
}) => {
  const { closeModal: onClose, isOpen, openModal: onOpen } = UseModal();
  const [faqs, setFaqs] = useState<FaqItem[]>([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (initialFaqs.length > 0) {
      setFaqs(
        initialFaqs.map((faq, index) => ({
          id: faq.id,
          question: faq.question,
          answer: faq.answer,
        }))
      );
    }
  }, [initialFaqs]);

  const addNewFaq = () => {
    if (faqs.length <= 0) {
      const newFaq: FaqItem = {
        id: 1,
        question: "",
        answer: "",
      };

      setFaqs([...faqs, newFaq]);
      return;
    }

    const sortedFaqs = [...faqs].sort((a, b) => (a.id || 0) - (b.id || 0));
    const lastCFaq = sortedFaqs[sortedFaqs.length - 1];
    const newId = lastCFaq?.id ? lastCFaq.id + 1 : sortedFaqs.length + 1;
    // const newId = faqs.length + 1;
    const newFaq: FaqItem = {
      id: newId,
      question: "",
      answer: "",
    };
    setFaqs([...faqs, newFaq]);
  };

  const removeFaq = (id: number) => {
    setFaqs(faqs.filter((faq) => faq.id !== id));
  };

  const updateFaq = (id: number, field: keyof FaqItem, value: string) => {
    setFaqs(
      faqs.map((faq) => (faq.id === id ? { ...faq, [field]: value } : faq))
    );
  };

  const handleSave = async () => {
    setSubmitting(true);
    try {
      if (onSave) {
        await onSave(faqs);
      }
      onClose();
    } catch (error) {
      console.log(error);
    } finally {
      setSubmitting(false);
    }
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
      <form className="flex flex-col overflow-y-scroll">
        <p className="text-secondary-text text-sm mb-3 font-roboto">
          Include frequently asked questions about your hackathon.
        </p>
        <div className="h-[520px] overflow-y-scroll">
          {faqs.map((faq) => (
            <div key={faq.id} className="mb-4">
              <div className="space-y-3">
                <div className="flex gap-4 items-center">
                  <DragIcon />
                  <Input
                    value={faq.question}
                    placeholder="Enter your question here..."
                    onChange={(e) =>
                      updateFaq(faq.id, "question", e.target.value)
                    }
                  />
                  <Trash2Icon
                    className="size-5 stroke-[#89898C] cursor-pointer hover:stroke-red-500 transition"
                    onClick={() => removeFaq(faq.id)}
                  />
                </div>
                <div className="flex gap-4 items-start">
                  <div className="w-4"></div>{" "}
                  {/* Spacer to align with drag icon */}
                  <TextArea
                    name={`answer-${faq.id}`}
                    value={faq.answer}
                    placeholder="Enter the answer to this question..."
                    onChange={(e) =>
                      updateFaq(faq.id, "answer", e.target.value)
                    }
                    showMaxLength={false}
                    maxLength={500}
                  />
                  <div className="w-5"></div>{" "}
                  {/* Spacer to align with trash icon */}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-between w-full pt-6">
          <Button
            type="button"
            variant="ghost"
            onClick={addNewFaq}
            className="text-gray-300 hover:text-white px-4 py-2"
          >
            <Plus className="h-4 w-4 mr-2" />
            New FAQ
          </Button>
          <Button
            type="button"
            disabled={submitting}
            onClick={handleSave}
            className="bg-blue-600 hover:bg-blue-700 text-white gap-2"
          >
            {submitting && <Spinner size="small" />} Save
          </Button>
        </div>
      </form>
    </GenericModal>
  );
};
