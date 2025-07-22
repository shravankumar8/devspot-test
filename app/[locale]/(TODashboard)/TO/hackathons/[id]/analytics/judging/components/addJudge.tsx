"use client";

import { MultiSelect } from "@/components/common/form/select/multi";
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
import { Spinner } from "@/components/ui/spinner";
import UseModal from "@/hooks/useModal";
import { useTechOwnerStore } from "@/state/techOwnerStore";
import { HackathonChallenges } from "@/types/entities";
import { cn } from "@/utils/tailwind-merge";
import { getInitials } from "@/utils/url-validator";
import axios, { AxiosError } from "axios";
import { ChevronDown, Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import useSWR, { useSWRConfig } from "swr";
import { JudgeDataType } from "../page";

interface JudgeDropdownProps {
  judgesData?: JudgeDataType[];
  selectedJudge?: JudgeDataType | null;
  onSelectJudge: (judge: JudgeDataType | null) => void;
}

function JudgeDropdown({
  judgesData,
  selectedJudge,
  onSelectJudge,
}: JudgeDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild className="w-full">
        <button
          className={cn(
            "flex flex-shrink-0 items-center justify-between text-secondary-text hover:text-white text-sm font-normal transition-colors",
            "whitespace-nowrap bg-tertiary-bg border border-tertiary-text h-10 rounded-xl px-4"
          )}
        >
          {selectedJudge?.name ? (
            <label className="text-secondary-text text-sm flex items-center gap-3 cursor-pointer">
              {selectedJudge?.avatar_url ? (
                <img
                  src={selectedJudge?.avatar_url}
                  alt="judge"
                  className="w-6 h-6 rounded-full object-cover"
                />
              ) : (
                <div className="w-6 h-6 rounded-full bg-gray-300 border-2 border-gray-200 flex items-center justify-center text-xs font-normal text-gray-700">
                  {getInitials(selectedJudge?.name)}
                </div>
              )}
              {selectedJudge?.name}
            </label>
          ) : (
            "Select a judge"
          )}
          <ChevronDown className="h-4 w-4 ml-2" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        className="!bg-tertiary-bg text-gray-300 p-0 left-0 max-h-[200px] overflow-y-auto text-sm border-gray-600 font-roboto w-[var(--radix-dropdown-menu-trigger-width)]"
        onCloseAutoFocus={(e) => e.preventDefault()}
      >
        {judgesData?.map((judge) => (
          <DropdownMenuItem
            key={judge.id}
            className={cn(
              "border-b p-3 border-b-tertiary-text hover:bg-gray-700",
              selectedJudge?.id === judge.id && "bg-gray-700"
            )}
            onSelect={(e) => {
              e.preventDefault();
              if (selectedJudge?.id === judge.id) {
                onSelectJudge(null); // Deselect if same judge clicked
              } else {
                onSelectJudge(judge);
              }
              setIsOpen(false);
            }}
          >
            <label className="text-secondary-text text-sm flex items-center gap-3 cursor-pointer">
              {judge?.avatar_url ? (
                <img
                  src={judge?.avatar_url}
                  alt="judge"
                  className="w-6 h-6 rounded-full object-cover"
                />
              ) : (
                <div className="w-6 h-6 rounded-full bg-gray-300 border-2 border-gray-200 flex items-center justify-center text-xs font-normal text-gray-700">
                  {getInitials(judge.name)}
                </div>
              )}
              {judge?.name}
            </label>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export const AddJudgeModal = ({ hackathonId }: { hackathonId: string }) => {
  const [selectedChallenges, setSelectedChallenges] = useState<number[]>([]);
  const [selectedJudge, setSelectedJudge] = useState<JudgeDataType | null>(
    null
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { closeModal: onClose, isOpen, openModal: onOpen } = UseModal();
  const { selectedOrg } = useTechOwnerStore();

  const fetchChallengesData = async (url: string) => {
    const resp = await axios.get(url);
    return resp.data;
  };
  const { mutate } = useSWRConfig();

  const { data: challengesData, isLoading: isChallengeDataLoading } = useSWR<
    HackathonChallenges[]
  >(`/api/hackathons/${hackathonId}/challenges/search`, fetchChallengesData);

  const { data: judgesData, isLoading: isJudgesDataLoading } = useSWR<
    JudgeDataType[]
  >(
    `/api/technology-owners/${selectedOrg?.technology_owner_id}/hackathons/${hackathonId}/judgings`,
    fetchChallengesData
  );

  const transformChallengesForDropdown = (
    challenges: Array<{
      id?: number;
      challenge_name: string;
      [key: string]: any; // Other properties we don't need
    }>
  ): Array<{ label: string; value: number }> => {
    return challenges.map((challenge) => ({
      label: challenge.challenge_name,
      value: challenge?.id ?? challenge?.challenge_id,
    }));
  };

  const addJudgeToChallenges = async () => {
    try {
      setSubmitting(true);
      if (selectedJudge) {
        const res = await axios.put(
          `/api/technology-owners/${selectedOrg?.technology_owner_id}/hackathons/${hackathonId}/judgings/${selectedJudge?.judging_id}/challenges`,
          {
            challenge_ids: selectedChallenges,
          }
        );
        setSubmitting(false);
        onClose();
        setSelectedJudge(null);
        setSelectedChallenges([]);
        toast.success(`${selectedJudge?.name} added Successfully`, {
          position: "bottom-right",
        });
        mutate(
          `/api/technology-owners/${selectedOrg?.technology_owner_id}/hackathons/${hackathonId}/judgings`
        );
      }

      if (searchQuery) {
        const res = await axios.post(
          `/api/technology-owners/${selectedOrg?.technology_owner_id}/hackathons/${hackathonId}/judgings`,
          {
            email: searchQuery,
          }
        );
        setSubmitting(false);
        onClose();
        setSelectedJudge(null);
        setSelectedChallenges([]);
        toast.success(`${searchQuery} invited Successfully`, {
          position: "bottom-right",
        });
        mutate(
          `/api/technology-owners/${selectedOrg?.technology_owner_id}/hackathons/${hackathonId}/judgings`
        );
      }
    } catch (error: any) {
      console.log(error);
      if (error instanceof AxiosError) {
        toast.error(
          `Could not Add ${selectedJudge?.name} ${error?.response?.data?.error}`,
          {
            position: "bottom-right",
          }
        );

        return;
      }

      toast.error(`Could not Add ${selectedJudge?.name} ${error?.message}`, {
        position: "bottom-right",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const dropdownOptions = transformChallengesForDropdown(challengesData ?? []);

  return (
    <GenericModal
      controls={{
        isOpen,
        onClose,
        onOpen,
      }}
      hasMinHeight={false}
      hasSidebar={false}
      trigger={
        <Button
          size="md"
          className="bg-[#4F46E5] hover:bg-[#4338CA] text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add judges
        </Button>
      }
    >
      <DialogHeader className="bg-[#1B1B22] py-2">
        <DialogTitle className="!text-[30px] font-semibold">
          Add a new judge
        </DialogTitle>
      </DialogHeader>
      <div className="space-y-4 mt-4">
        <div className="w-full">
          <p className="text-sm font-roboto text-secondary-text mb-2">
            Search for a judge on DevSpot
          </p>
          <JudgeDropdown
            judgesData={judgesData}
            selectedJudge={selectedJudge}
            onSelectJudge={setSelectedJudge}
          />
        </div>

        <div>
          <p className="text-sm font-roboto text-secondary-text mb-2">
            Can’t find your judge?
          </p>
          <Input
            type="text"
            className="h-10"
            placeholder="Enter their email and we’ll send them an invite"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div>
          <p className="text-sm font-roboto text-secondary-text mb-2">
            Assign this judge to challenges
          </p>

          <MultiSelect
            options={dropdownOptions}
            placeholder="What challenge(s) are you submitting this project for?"
            isLoading={isChallengeDataLoading}
            height="150px"
            isAsync
            value={selectedChallenges}
            onChange={(selectedValues) =>
              setSelectedChallenges(selectedValues as number[])
            }
          />
        </div>
        <div className="flex w-full justify-end mt-2">
          <Button
            size="lg"
            onClick={addJudgeToChallenges}
            disabled={submitting}
            className="bg-[#4F46E5] hover:bg-[#4338CA] text-white gap-2"
          >
            {submitting && <Spinner size="small" />} Save
          </Button>
        </div>
      </div>
    </GenericModal>
  );
};
