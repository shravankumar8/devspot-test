import { Checkbox } from "@/components/common/Checkbox";
import { Input } from "@/components/ui/input";
import { cn } from "@/utils/tailwind-merge";
import { ChevronDown } from "lucide-react";
import React, { useState, useRef, useEffect } from "react";
import { IoClose } from "react-icons/io5";


interface DropdownProps {
  options: string[];
  selected: string[];
  query: string;
  setQuery: React.Dispatch<React.SetStateAction<string>>;
  setSelected: React.Dispatch<React.SetStateAction<string[]>>;
  placeholder?: string;
  skillType: string;
}

export default function SkillDropdown({
  options,
  selected,
  query,
  setQuery,
  setSelected,
  skillType,
  placeholder = "Add new skill",
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleAddSkill = () => {
    if (query && !selected.includes(query)) {
      setSelected((prev) => [...prev, query]);
    }
    setQuery("");
  };

  const handleSkillToggle = (skill: string) => {
    setSelected((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  // Show all options if query is empty
  const filteredSkills = Array.from(new Set(options))
    .sort((a, b) => a.localeCompare(b))
    .filter((skill) => {
      const trimmedQuery = query.trim().toLowerCase();
      if (trimmedQuery === "") return true;
      
      // Only show skills that match all words in the query
      const queryWords = trimmedQuery.split(/\s+/);
      return queryWords.every(word => 
        skill.toLowerCase().includes(word)
      );
    });

  const removeFromSelected = (skill: string) => {
    setSelected(selected.filter((val) => val !== skill));
    // Focus input after removal
    inputRef.current?.focus();
  };

  const handleInputClick = () => {
    setIsOpen(true);
    inputRef.current?.focus();
  };

  return (
    <div className="w-full" ref={containerRef}>
      <div className="rounded-xl w-full shadow-sm font-roboto relative text-sm">
        <div
          className="flex items-center gap-2 w-full h-12 px-5 py-3 bg-tertiary-bg border border-secondary-text rounded-xl text-sm ring-offset-background placeholder:text-secondary-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 overflow-hidden"
          onClick={handleInputClick}
        >
          <div className="flex gap-2 whitespace-nowrap overflow-x-scroll overflow-y-hidden max-w-[90%]">
            {selected.map((skill) => (
              <span
                key={skill}
                className="bg-transparent text-[#E7E7E8] text-[14px] px-3 py-1 rounded-full flex items-center border border-white gap-2 capitalize"
              >
                {skill}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFromSelected(skill);
                  }}
                  className="focus:outline-none"
                >
                  <IoClose size={18} color="#4E52F5" />
                </button>
              </span>
            ))}
          </div>

          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAddSkill()}
            className="flex-1 min-w-[100px] h-full bg-transparent border-none outline-none placeholder:text-[14px] placeholder:text-secondary-text text-white font-roboto font-normal w-full pr-7"
            placeholder={selected.length === 0 ? placeholder : ""}
          />
        </div>

        <ChevronDown
          className={cn(
            "h-5 w-5 text-[#4e52f5] transition-transform duration-200 absolute top-[14px] right-5",
            isOpen && "rotate-180"
          )}
        />

        {isOpen && (
          <div className="bg-[#2B2B31] border border-[#424248] flex flex-col items-start justify-start rounded-xl mt-2 max-h-40 overflow-auto shadow-sm absolute top-11 right-0 left-0 z-10">
            {filteredSkills.length > 0 ? (
              filteredSkills.map((skill) => (
                <div
                  key={skill}
                  className="flex items-center gap-3 px-5 py-3 w-full hover:bg-[#2B2B31]/10 border-b border-b-[#424248] cursor-pointer"
                >
                  <Checkbox
                    checked={selected.includes(skill)}
                    onCheckedChange={() => handleSkillToggle(skill)}
                    variant="default"
                    className="shrink-0"
                  />
                  <span
                    className="text-sm text-secondary-text hover:text-white"
                    onClick={() => handleSkillToggle(skill)}
                  >
                    {skill}
                  </span>
                </div>
              ))
            ) : (
              <div className="px-4 py-2 text-gray-500">
                No {skillType} found.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
