"use client";

import { TextArea } from "@/components/common/form/textarea";
import { Button } from "@/components/ui/button";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import GenericModal from "@/components/ui/generic-modal";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import UseModal from "@/hooks/useModal";
import { AxiosError } from "axios";
import { ThumbsDown, ThumbsUp } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

type SupportType = "feedback" | "request" | "report";

export interface SupportItem {
  label: string;
  value: SupportType;
  icon: React.ReactNode;
}

export const SupportModal = ({
  supportItems,
}: {
  supportItems: SupportItem[];
}) => {
  const [selectedType, setSelectedType] = useState<SupportType | null>(null);
  const [feedback, setFeedback] = useState("");
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [isSatisfied, setIsSatisfied] = useState<boolean | null>(null);
  const { closeModal: onClose, isOpen, openModal: onOpen } = UseModal();

  const handleSubmit = async () => {
    try {
      setSubmitting(true);

      if (!feedback.trim()) {
        toast.error("Please provide your feedback/request/issue");
        return;
      }

      // Here you would make your API call based on the selected type
      // Example:
      // await axios.post(`/api/support/${selectedType}`, {
      //   content: feedback,
      //   email: email.trim() || undefined
      // });

      toast.success("Thank you for your feedback!", {
        position: "bottom-right",
      });

      // Reset form
      setFeedback("");
      setEmail("");
      setSelectedType(null);
      onClose();
    } catch (error: any) {
      console.error(error);
      if (error instanceof AxiosError) {
        toast.error(
          `Could not submit your ${selectedType}: ${error?.response?.data?.error}`,
          { position: "bottom-right" }
        );
      } else {
        toast.error(`Could not submit your ${selectedType}`, {
          position: "bottom-right",
        });
      }
    } finally {
      setSubmitting(false);
    }
  };

  const getTitle = () => {
    switch (selectedType) {
      case "feedback":
        return "What has your overall experience been like?";
      case "request":
        return "What would you like to see?";
      case "report":
        return "What can we do better?";
      default:
        return "Help us improve DevSpot!";
    }
  };

  const getPlaceholder = () => {
    switch (selectedType) {
      case "feedback":
        return "Additional comments?";
      case "request":
        return "Describe the feature you'd like to request";
      case "report":
        return "Describe the issue you're experiencing";
      default:
        return "Your feedback";
    }
  };

  return (
    <>
      {/* Trigger buttons */}
      <section className="absolute bottom-0 px-3 pb-6">
        {supportItems?.map((item) => (
          <button
            key={item.value}
            className="flex items-center gap-2 mb-3 text-secondary-text hover:text-white transition-colors"
            onClick={() => {
              setSelectedType(item.value);
              onOpen();
            }}
          >
            {item.icon}
            <p className="text-sm whitespace-nowrap">{item.label}</p>
          </button>
        ))}
      </section>

      {/* Modal */}
      <GenericModal
        controls={{
          isOpen,
          onClose,
          onOpen,
        }}
        hasMinHeight={false}
        hasSidebar={false}
      >
        <DialogHeader className="bg-[#1B1B22] py-2">
          <DialogTitle className="!text-[30px] font-semibold">
            Help us improve DevSpot!
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {selectedType && (
            <>
              <div>
                <p className="text-sm font-roboto text-secondary-text mb-2">
                  {getTitle()}
                </p>
                {selectedType === "feedback" && (
                  <div className="flex gap-4 mb-4">
                    <button
                      className={`flex items-center gap-2 w-10 h-10 justify-center rounded-lg bg-tertiary-bg ${
                        isSatisfied === true
                          ? "bg-green-500/20 text-green-500"
                          : "bg-gray-700 hover:bg-gray-600"
                      }`}
                      onClick={() => setIsSatisfied(true)}
                    >
                      <ThumbsUp color="#22c55e" className="h-6 w-6" />
                    </button>
                    <button
                      className={`flex items-center gap-2 w-10 h-10 justify-center bg-tertiary-bg rounded-lg ${
                        isSatisfied === false
                          ? "bg-red-500/20 text-red-500"
                          : "bg-gray-700 hover:bg-gray-600"
                      }`}
                      onClick={() => setIsSatisfied(false)}
                    >
                      <ThumbsDown color="#ef4444" className="h-6 w-6" />
                    </button>
                  </div>
                )}
                <TextArea
                  name="feedback"
                  className="w-full"
                  placeholder={getPlaceholder()}
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                />
              </div>

              <div>
                <p className="text-sm font-roboto text-secondary-text mb-2">
                  If we need to reach out to you about your feedback, please
                  provide your email address.
                </p>
                <Input
                  type="email"
                  className="h-10"
                  placeholder="Your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </>
          )}

          <div className="flex w-full justify-end mt-2 gap-2">
            <Button
              size="lg"
              variant="ghost"
              onClick={() => {
                onClose();
                setSelectedType(null);
              }}
            >
              Cancel
            </Button>
            <Button
              size="lg"
              onClick={handleSubmit}
              disabled={submitting || !feedback.trim()}
              className="bg-[#4F46E5] hover:bg-[#4338CA] text-white"
            >
              {submitting && <Spinner size="small" />} Send feedback
            </Button>
          </div>
        </div>
      </GenericModal>
    </>
  );
};
