import Label from "@/components/common/form/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Spinner } from "@/components/ui/spinner";
import UseModal from "@/hooks/useModal";
import axios from "axios";
import { Info } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const SuggestTagPopover = () => {
  const [tagName, setTagName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { closeModal, isOpen, openModal } = UseModal();

  const handleSubmit = async () => {
    setSubmitting(true);
    const allTags = tagName.split(",");

    await axios.post("/api/technology-tags", {
      tags: allTags,
    });

    setTagName("");

    toast.success("Thank you for the Suggestion", {
      position: "top-right",
    });

    setSubmitting(false);

    closeModal();
  };

  return (
    <Popover
      open={isOpen}
      onOpenChange={(val) => (val ? openModal() : closeModal())}
    >
      <PopoverTrigger asChild>
        <p
          className="font-normal font-roboto text-xs flex relative gap-2 italic items-end justify-end text-white cursor-pointer underline underline-offset-4 duration-200 ease-in-out transition-all hover:underline-offset-8 hover:text-main-primary w-fit justify-self-end self-end"
          aria-label="Tag Modal"
        >
          <Info
            color="#4E52F5"
            className="w-3 h-3 text-gray-400 hover:text-white"
          />
          Suggest a tag?
        </p>
      </PopoverTrigger>

      <PopoverContent
        className="w-full border-none p-0"
        side="bottom"
        align="end"
      >
        <div className="w-[300px] bg-secondary-bg border border-[#2b2b31] rounded-[12px] !z-50 p-4 !font-roboto flex flex-col gap-3 shadow-[0_0_6px_rgba(19,19,26,0.25)]">
          <div className="flex flex-col gap-3 w-full text-sm">
            <Label className="text-xs">Name</Label>

            <Input
              id="full_name"
              name="full_name"
              value={tagName}
              onChange={(e) => setTagName(e.target.value)}
              placeholder="Insert tag name(s), separate multiple with commas"
              className="px-2 h-9 text-xs"
            />
          </div>

          <div className="w-full flex justify-end ">
            <Button
              type="submit"
              className="!min-w-fit gap-2 text-sm"
              onClick={handleSubmit}
              disabled={submitting}
              size="sm"
            >
              {submitting && <Spinner size="tiny" />} Submit
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default SuggestTagPopover;
