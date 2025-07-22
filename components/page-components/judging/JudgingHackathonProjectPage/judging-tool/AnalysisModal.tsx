import { Button } from "@/components/ui/button";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import GenericModal from "@/components/ui/generic-modal";
import UseModal from "@/hooks/useModal";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface AnalysisModalProps {
  category: string;
  title: string;
  fullDescription: string;
}

const AnalysisModal = ({
  title,
  category,
  fullDescription,
}: AnalysisModalProps) => {
  const {
    closeModal: onClose,
    isOpen,
    openModal: onOpen,
  } = UseModal(`${category.toLowerCase()}-analysis`);

  return (
    <GenericModal
      hasSidebar={false}
      hasMinHeight={false}
      controls={{
        isOpen,
        onClose,
        onOpen,
      }}
    >
      <DialogHeader className="bg-[#1B1B22] py-2">
        <DialogTitle className="!text-[24px] font-semibold">
          {title} Full {category} Analysis
        </DialogTitle>
      </DialogHeader>

      <div className="max-h-[60vh] pb-5 mt-5 overflow-y-scroll">
        {/* <div className="flex flex-col relative pb-5">{fullDescription}</div> */}
        <Markdown remarkPlugins={[remarkGfm]}>{fullDescription}</Markdown>
      </div>

      {/* <form className="flex flex-col gap-5  overflow-y-scroll pb-5 mt-5">
        <textarea
          placeholder={fullDescription}
          className="bg-tertiary-bg border border-tertiary-text rounded-md p-3 text-white placeholder:text-secondary-text text-sm resize-none h-full focus:outline-none focus:border-main-primary"
        />
      </form> */}

      <div className="w-full flex sm:justify-end justify-center mt-4 gap-6">
        <Button
          onClick={onClose}
          type="button"
          className="w-fit font-roboto text-sm gap-2"
        >
          Close
        </Button>
      </div>
    </GenericModal>
  );
};

export default AnalysisModal;
