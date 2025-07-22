import { cn } from "@/utils/tailwind-merge";
import { useEffect } from "react";
import ReactDOM from "react-dom";

const Modal = ({
  isOpen,
  onClose,
  children,
  sidebar = true,
  maxWidth = "600px",
}: {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  sidebar?: boolean;
  maxWidth?: string;
}) => {
  // Close modal on pressing Escape
  useEffect(() => {
    const handleEscape = (event: any) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    } else {
      document.removeEventListener("keydown", handleEscape);
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Close modal when clicking outside the modal content
  const handleOutsideClick = (e: any) => {
    if (e.target.id === "modal-overlay") {
      onClose();
    }
  };

  return ReactDOM.createPortal(
    <div
      id="modal-overlay"
      className="fixed inset-0 bg-[#2B2B31CC] flex p-5 items-center justify-center z-50"
      onClick={handleOutsideClick}
    >
      <div
        className={`bg-[#1B1B22] rounded-[12px] overflow-y-scroll shadow-lg lg:max-w-[850px] w-full relative flex ${cn(
          sidebar
            ? "xl:max-w-[1000px] h-[550px]"
            : `xl:max-w-[${maxWidth}] h-fit`
        )}`}
      >
        <div
          className={`h-[550px] bg-gradient-to-r sticky top-0 bottom-0 left-0 from-[#4075FF] to-[#9667FA] md:w-16 xl:w-24 ${cn(
            sidebar ? "sm:block hidden " : "hidden"
          )}`}
        ></div>
        <button
          onClick={onClose}
          className="absolute z-20 top-5 right-5 text-[#4E52F5]"
          aria-label="Close modal"
        >
          &#10005;
        </button>
        {children}
      </div>
    </div>,
    document.body
  );
};

export default Modal;
