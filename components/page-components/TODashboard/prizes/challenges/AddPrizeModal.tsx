"use client";

import {
  Cash,
  CustomPrizeIcon,
  DevTokenIcon,
} from "@/components/icons/Location";
import EditProfileIcon from "@/components/page-components/profile/EditProfileIcon";
import { Button } from "@/components/ui/button";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import GenericModal from "@/components/ui/generic-modal";
import { Input } from "@/components/ui/input";
import UseModal from "@/hooks/useModal";
import { useTechOwnerStore } from "@/state/techOwnerStore";
import { HackathonChallengeBounties } from "@/types/entities";
import { Prize } from "@/types/techowners";
import axios from "axios";
import {
  ChevronDown,
  PencilIcon,
  Plus,
  PlusIcon,
  Trash2Icon,
  UploadIcon,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useSWRConfig } from "swr";

type PrizeType = "usd" | "tokens" | "custom";

interface PrizeEntry {
  type: PrizeType;
  value: string;
}

const AddPrizeModal = ({
  prize,
  mode,
  challengeId,
  hackathonId,
  isPrizePage,
}: {
  prize?: Prize | HackathonChallengeBounties;
  mode: "Edit" | "Add";
  challengeId: number;
  hackathonId: number;
  isPrizePage?: boolean;
}) => {
  const { closeModal, isOpen, openModal } = UseModal();
  const { selectedOrg } = useTechOwnerStore();
  const { mutate } = useSWRConfig();

  const [standing, setStanding] = useState(prize?.rank?.toString() ?? "");
  const [logo, setLogo] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState(
    prize?.company_partner_logo || ""
  );
  const [actionsLoading, setActionsLoading] = useState<{
    delete: boolean;
    save: boolean;
  }>({ delete: false, save: false });

  const [prizes, setPrizes] = useState<PrizeEntry[]>(() => {
    if (mode === "Edit" && prize) {
      if (prize.prize_usd) {
        return [{ type: "usd", value: prize.prize_usd.toString() }];
      }

      if (prize.prize_custom) {
        return [{ type: "custom", value: prize.prize_custom }];
      }
      if (prize.prize_tokens) {
        return [{ type: "tokens", value: prize.prize_tokens.toString() }];
      }
    }
    return [{ type: "usd", value: "" }];
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleRemovePrize = async () => {
    if (!prize?.id) return;
    setActionsLoading({ ...actionsLoading, delete: true });
    try {
      await axios.delete(
        `/api/technology-owners/${selectedOrg?.technology_owner_id}/hackathons/${hackathonId}/prizes/${prize.id}`
      );
      mutate(
        `/api/technology-owners/${selectedOrg?.technology_owner_id}/hackathons/${hackathonId}/prizes/challenges`
      );
      closeModal();
      toast.success(`Prize deleted successfully`);
    } catch (error) {
      toast.error(`An error occured, please try again`);
      console.error("Error deleting prize:", error);
    } finally {
      setActionsLoading({ ...actionsLoading, delete: false });
    }
  };

  useEffect(() => {
    return () => {
      if (logoPreview?.startsWith("blob:")) {
        URL.revokeObjectURL(logoPreview);
      }
    };
  }, [logoPreview]);

  const handleAddPrizeEntry = () => {
    if (prizes.length >= 3) return; // Limit to 3 prize types
    setPrizes([...prizes, { type: "usd", value: "" }]);
  };

  const handleRemovePrizeEntry = (index: number) => {
    if (prizes.length <= 1) return; // Must keep at least one
    setPrizes(prizes.filter((_, i) => i !== index));
  };

  const handlePrizeTypeChange = (index: number, type: PrizeType) => {
    const newPrizes = [...prizes];
    newPrizes[index] = { ...newPrizes[index], type, value: "" };
    setPrizes(newPrizes);
  };

  const handlePrizeValueChange = (index: number, value: string) => {
    const newPrizes = [...prizes];
    newPrizes[index] = { ...newPrizes[index], value };
    setPrizes(newPrizes);
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogo(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {
    try {
      // Create FormData object
      const formData = new FormData();

      if (!logoPreview && !logo) {
        toast.error("Company logo is required");
        return;
      }

      const activePrizes = prizes.filter((p) => p.value.trim());
      if (activePrizes.length === 0) {
        toast.error("At least one prize value is required");
        return;
      }

      // Add basic fields
      if (mode === "Edit" && prize?.id) {
        formData.append("id", prize.id.toString());
      }

      formData.append("challenge_id", challengeId.toString());

      const title = `${standing}${
        standing.endsWith("ST") ||
        standing.endsWith("ND") ||
        standing.endsWith("RD") ||
        standing.endsWith("TH")
          ? ""
          : " PLACE"
      }`;
      formData.append("title", title);

      if (standing && parseInt(standing)) {
        formData.append("rank", standing);
      }

      // Handle logo - append the file if new upload, otherwise the existing URL
      if (logo) {
        formData.append("company_partner_logo", logo);
      }

      // Add prize values based on selected types
      const usdPrize = prizes.find((p) => p.type === "usd");
      const tokensPrize = prizes.find((p) => p.type === "tokens");
      const customPrize = prizes.find((p) => p.type === "custom");

      if (usdPrize?.value) {
        formData.append("prize_usd", usdPrize.value);
      }
      if (tokensPrize?.value) {
        formData.append("prize_tokens", tokensPrize.value);
      }
      if (customPrize?.value) {
        formData.append("prize_custom", customPrize.value);
      }

      setActionsLoading({ ...actionsLoading, save: true });
      const response = await axios.put(
        `/api/technology-owners/${selectedOrg?.technology_owner_id}/hackathons/${hackathonId}/prizes`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success(
        `Prize ${mode == "Add" ? "added" : "updated"} successfully`
      );
      mutate(
        `/api/technology-owners/${selectedOrg?.technology_owner_id}/hackathons/${hackathonId}/prizes/challenges`
      );
      closeModal();
    } catch (error) {
      toast.error(
        `An error occured, unable to ${mode == "Add" ? "add" : "update"} prize`
      );
      console.error("Error saving prize:", error);
    } finally {
      setActionsLoading({ ...actionsLoading, save: false });
    }
  };

  return (
    <GenericModal
      hasSidebar={false}
      hasMinHeight={false}
      controls={{
        isOpen,
        onClose: closeModal,
        onOpen: openModal,
      }}
      trigger={
        mode === "Edit" ? (
          isPrizePage ? (
            <PencilIcon className="size-5 stroke-white cursor-pointer" />
          ) : (
            <button className="absolute top-4 right-4 z-20 cursor-pointer">
              <EditProfileIcon size="lg" />
            </button>
          )
        ) : isPrizePage ? (
          <Button size="sm" className="flex items-center gap-2">
            <PlusIcon className="size-4" />
            Add a prize
          </Button>
        ) : (
          <button className="w-[336px] flex justify-center items-center bg-gradient-to-b from-[#1D1D23] to-[#2B2B31] border rounded-lg border-tertiary-bg text-gray-300 hover:bg-gray-800 h-[330px] font-roboto">
            <Plus className="h-4 w-4 mr-2" />
            New prize card
          </button>
        )
      }
    >
      <DialogHeader className="bg-[#1B1B22] py-2">
        <DialogTitle className="!text-[24px] font-semibold">
          {mode} Prize
        </DialogTitle>
      </DialogHeader>

      <form className="bg-primary-bg p-5 rounded-xl md:min-h-[284px] h-auto my-4 mb-6 flex flex-col gap-4">
        <Input
          type="text"
          placeholder="Standing (e.g., 1, 2, 3 or 1ST, 2ND, 3RD)"
          value={standing}
          name="standing"
          onChange={(e) => setStanding(e.target.value.toUpperCase())}
        />
        {logoPreview ? (
          <div className="flex flex-col items-center gap-3">
            <div className="relative w-20 h-20 rounded-full overflow-hidden border border-tertiary-text">
              <img
                src={logoPreview}
                alt="Company logo preview"
                className="w-full h-full object-cover"
              />
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setLogoPreview("");
                setLogo(null);
                if (fileInputRef.current) {
                  fileInputRef.current.value = "";
                }
              }}
              className="text-red-500 hover:text-red-400"
            >
              Remove Logo
            </Button>
          </div>
        ) : (
          <label
            htmlFor="logo-upload"
            className="border border-dashed border-secondary-text rounded-xl w-full h-20 bg-primary-bg flex flex-col items-center justify-center py-3 px-5 cursor-pointer hover:border-main-primary transition"
          >
            <div className="size-6 flex-shrink-0">
              <UploadIcon className="stroke-main-primary size-6" />
            </div>
            <p className="font-medium text-sm text-secondary-text mt-2 text-center">
              Drag and drop partner company logo here or{" "}
              <span className="text-main-primary underline">
                click to upload
              </span>
            </p>
            <input
              id="logo-upload"
              type="file"
              ref={fileInputRef}
              name="logo"
              accept="image/*"
              onChange={handleLogoChange}
              className="hidden"
            />
          </label>
        )}

        {prizes.map((prizeEntry, index) => (
          <div className="flex gap-4 items-center" key={index}>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="lg"
                  className="!border-tertiary-text !border h-[48px] !text-sm text-secondary-text !font-roboto !font-medium truncate flex justify-between items-center"
                >
                  {prizeEntry.type === "usd" ? (
                    <Cash className="size-5 stroke-main-primary" />
                  ) : prizeEntry.type === "tokens" ? (
                    <DevTokenIcon />
                  ) : (
                    <CustomPrizeIcon className="size-5 stroke-main-primary" />
                  )}
                  <ChevronDown className="size-5 stroke-main-primary ml-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="start"
                className=" !bg-tertiary-bg p-0 max-h-[300px] overflow-y-auto font-roboto text-gray-300 text-sm w-[var(--radix-dropdown-menu-trigger-width)]"
              >
                <DropdownMenuItem
                  onClick={() => handlePrizeTypeChange(index, "usd")}
                >
                  <Cash className="size-4 mr-2" /> USD
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handlePrizeTypeChange(index, "tokens")}
                >
                  <DevTokenIcon />
                  Tokens
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handlePrizeTypeChange(index, "custom")}
                >
                  <CustomPrizeIcon className="size-4 mr-2" /> Custom
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Input
              type={prizeEntry.type === "custom" ? "text" : "number"}
              placeholder={
                prizeEntry.type === "usd"
                  ? "Amount in USD (e.g., 5000)"
                  : prizeEntry.type === "tokens"
                  ? "Token amount"
                  : "Prize description (e.g., Sony Headphones)"
              }
              value={prizeEntry.value}
              onChange={(e) => handlePrizeValueChange(index, e.target.value)}
            />
            {prizes.length > 1 && (
              <Trash2Icon
                onClick={() => handleRemovePrizeEntry(index)}
                className="size-5 stroke-[#89898C] cursor-pointer hover:stroke-red-500 transition"
              />
            )}
          </div>
        ))}

        {prizes.length < 3 && (
          <Button
            onClick={handleAddPrizeEntry}
            type="button"
            size={"md"}
            variant={"secondary"}
            className="mt-2"
          >
            <PlusIcon className="size-6 mr-1" />
            Add Prize Type
          </Button>
        )}
      </form>

      <div
        className={`w-full flex mt-4 gap-6 ${
          mode === "Edit" ? "justify-between" : "justify-end"
        }`}
      >
        {mode === "Edit" && (
          <Button
            loading={actionsLoading.delete}
            type="button"
            onClick={handleRemovePrize}
            className="w-fit font-roboto text-sm gap-2 !bg-[#9A271D] hover:!bg-[#9A271D]/90 !text-white"
            variant={"primary"}
          >
            Delete
          </Button>
        )}
        <Button
          type="button"
          loading={actionsLoading.save}
          className="w-fit font-roboto text-sm gap-2"
          onClick={handleSubmit}
          disabled={!logoPreview || prizes.some((p) => !p.value)}
        >
          Save
        </Button>
      </div>
    </GenericModal>
  );
};

export default AddPrizeModal;
