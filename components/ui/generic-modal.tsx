import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/utils/tailwind-merge";
import { X } from "lucide-react";

export interface ModalControls {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

interface GenericModalProps {
  children: React.ReactNode;
  trigger?: React.ReactNode;
  hasSidebar?: boolean;
  controls?: ModalControls;
  hasMinHeight?: boolean;
}

const GenericModal = ({
  children,
  hasSidebar = true,
  trigger,
  controls,
  hasMinHeight = true,
}: GenericModalProps) => {
  const handleOpenChange = (isOpen: boolean) => {
    isOpen ? controls?.onOpen() : controls?.onClose();
  };
  return (
    <Dialog open={controls?.isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent
        className={`p-0 !gap-0 overflow-hidden flex w-[90vw] max-w-[700px] lg:max-w-[900px]  ${cn(
          hasSidebar ? "xl:max-w-[1200px]" : "xl:max-w-[900px]",
          hasMinHeight ? "h-[80vh] xl:h-[758px] md:h-[714px]" : "h-fit"
        )}`}
      >
        <div
          className={`bg-gradient-to-r sticky top-0 bottom-0 left-0 from-[#4075FF] to-[#9667FA] w-[100px] h-full ${cn(
            hasSidebar ? "lg:block hidden " : "hidden"
          )}`}
        />

        {controls?.isOpen && (
          <div
            className={cn(
              "overflow-auto w-full ",
              hasSidebar ? "sm:p-10 p-5" : "p-6"
            )}
          >
            {children}
          </div>
        )}

        <DialogClose className="absolute right-10 top-8 sm:top-10 rounded-sm opacity-70 ring-offset-white transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-neutral-950 focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-neutral-100 data-[state=open]:text-neutral-500 dark:ring-offset-neutral-950 dark:focus:ring-neutral-300 dark:data-[state=open]:bg-neutral-800 dark:data-[state=open]:text-neutral-400 text-[#4E52F5]">
          <X className="h-5 w-5" />
          <span className="sr-only">Close</span>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
};
export default GenericModal;
