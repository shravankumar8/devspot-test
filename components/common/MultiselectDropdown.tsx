"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { ChevronDown, ChevronUp, Info } from "lucide-react";
import React, { useState } from "react";
import { useSWRConfig } from "swr";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { cn } from "@/utils/tailwind-merge";

type MultiSelectDropdownProps = {
  options: string[];
  onChange: (selectedValues: string[]) => void;
  selectedValues: string[];
  setSelectedValues?: (description: string[]) => void;
  placeholder?: string;
  setDoubleClickedItems?: (value: string) => void;
  doublyClickedItem?: string;
};

const MultiSelectDropdown: React.FC<MultiSelectDropdownProps> = ({
  options = [],
  onChange,
  selectedValues,
  setSelectedValues,
  placeholder = "What is your role?",
  setDoubleClickedItems,
  doublyClickedItem,
}) => {
  const [open, setOpen] = useState(false);

  const { mutate } = useSWRConfig();

  const handleSelect = (value: string) => {
    if (
      value?.toLocaleLowerCase() === doublyClickedItem?.toLocaleLowerCase() &&
      selectedValues.includes(value)
    ) {
      setDoubleClickedItems?.("");
    }

    const newSelectedValues = selectedValues.includes(value)
      ? selectedValues.filter((v) => v !== value)
      : [...selectedValues, value];

    setSelectedValues &&setSelectedValues(newSelectedValues);
    onChange(newSelectedValues);
  };

  const handleDoubleSelect = (value: string) => {
    const newSelectedValues = selectedValues.includes(value)
      ? selectedValues
      : [...selectedValues, value];
    setSelectedValues &&setSelectedValues(newSelectedValues);
    onChange(newSelectedValues);
    setDoubleClickedItems?.(value);
  };

  return (
    <TooltipProvider>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild className="!bg-[#2B2B31]">
          <Button
            variant="ghost"
            role="combobox"
            aria-expanded={open}
            className="w-[inherit] overflow-x-scroll items-center justify-between bg-[rgba(27,27,34,1)] text-[#89898C]  text-sm"
          >
            {selectedValues?.length > 0 ? (
              <div className="flex flex-wrap gap-1 mt-2">
                {selectedValues?.map((value) => {
                  const option = options.find((o) => o === value);
                  return (
                    <Badge
                      key={value}
                      variant="secondary"
                      className="bg-[rgba(45,45,60,1)] text-white flex gap-2"
                    >
                      {option?.toLocaleLowerCase() ===
                        doublyClickedItem?.toLocaleLowerCase() && (
                        <div className="bg-[#91C152] w-3 h-3 rounded-full"></div>
                      )}

                      {option}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="ml-1 h-auto p-0 text-white hover:bg-transparent"
                        onClick={() => handleSelect(value)}
                      >
                        ✕
                      </Button>
                    </Badge>
                  );
                })}
              </div>
            ) : (
              placeholder
            )}
            {open ? (
              <ChevronUp
                className="ml-2 h-4 w-4 shrink-0 opacity-50"
                color="#4E52F5"
              />
            ) : (
              <ChevronDown
                className="ml-2 h-4 w-4 shrink-0 opacity-50"
                color="#4E52F5"
              />
            )}
            {/* <ChevronsUpDown /> */}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="md:w-[500px] p-0 !bg-[#2B2B31]">
          <Command className="!bg-[#2B2B31] !border-[#424248]">
            <CommandInput
              placeholder="Search options..."
              className="text-white"
            />
            <CommandList>
              <CommandEmpty>No options found.</CommandEmpty>
              <CommandGroup>
                {options?.map((option, index) => (
                  <CommandItem
                    key={option}
                    onSelect={() => handleSelect(option)}
                    onDoubleClick={() => handleDoubleSelect(option)}
                    className={`text-white hover:bg-[rgba(45,45,60,1)] flex items-center justify-between p-3 ${cn(
                      options.length - index != 1 &&
                        "border-b border-b-[#424248]"
                    )}  `}
                  >
                    <div className="flex items-center gap-2">
                      {selectedValues?.includes(option) ? (
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <rect
                            x="2"
                            y="2"
                            width="20"
                            height="20"
                            rx="4.14286"
                            fill="#4E52F5"
                            stroke="#4E52F5"
                            stroke-width="2"
                          />
                          <path
                            fill-rule="evenodd"
                            clip-rule="evenodd"
                            d="M7.94735 10.9519C7.78921 10.7882 7.60005 10.6576 7.3909 10.5677C7.18175 10.4779 6.9568 10.4306 6.72918 10.4286C6.50156 10.4267 6.27582 10.47 6.06514 10.5562C5.85446 10.6424 5.66306 10.7697 5.5021 10.9307C5.34114 11.0916 5.21385 11.283 5.12766 11.4937C5.04146 11.7044 4.99809 11.9301 5.00006 12.1578C5.00204 12.3854 5.04933 12.6103 5.13918 12.8195C5.22902 13.0286 5.35962 13.2178 5.52335 13.3759L8.95192 16.8045C9.2734 17.1259 9.70936 17.3064 10.1639 17.3064C10.6185 17.3064 11.0544 17.1259 11.3759 16.8045L18.2331 9.94735C18.3968 9.78921 18.5274 9.60005 18.6172 9.3909C18.7071 9.18175 18.7544 8.9568 18.7564 8.72918C18.7583 8.50156 18.715 8.27582 18.6288 8.06515C18.5426 7.85447 18.4153 7.66306 18.2543 7.5021C18.0934 7.34115 17.902 7.21385 17.6913 7.12766C17.4806 7.04146 17.2549 6.99809 17.0272 7.00006C16.7996 7.00204 16.5747 7.04933 16.3655 7.13918C16.1564 7.22902 15.9672 7.35962 15.8091 7.52335L10.1639 13.1685L7.94735 10.9519Z"
                            fill="white"
                          />
                        </svg>
                      ) : (
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <rect
                            x="2"
                            y="2"
                            width="20"
                            height="20"
                            rx="4.14286"
                            fill="#2B2B31"
                            stroke="#4E52F5"
                            stroke-width="2"
                          />
                        </svg>
                      )}

                      {option}

                      {option.toLocaleLowerCase() ===
                        doublyClickedItem?.toLocaleLowerCase() && (
                        <div className="bg-[#91C152] w-3 h-3 rounded-full"></div>
                      )}
                    </div>

                    {option === "Builder" && (
                      <Tooltip>
                        <TooltipTrigger>
                          <Info
                            color="#4E52F5"
                            className="ml-2 w-4 h-4 text-gray-400 hover:text-white"
                          />
                        </TooltipTrigger>
                        <TooltipContent className="bg-[#424248] text-white text-[13px] px-4 py-2 font-[500] rounded-md shadow-md font-roboto max-w-[300px]">
                          An entrepreneurial problem-solver who combines diverse
                          skills, creativity, and collaboration to conceptualize
                          and execute impactful solutions and technologies
                        </TooltipContent>
                      </Tooltip>
                    )}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </TooltipProvider>
  );
};

export default MultiSelectDropdown;
