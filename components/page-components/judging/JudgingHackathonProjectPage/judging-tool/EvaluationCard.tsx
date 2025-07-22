import { Button } from "@/components/ui/button";
import UseModal from "@/hooks/useModal";
import React, { useState } from "react";
import AnalysisModal from "./AnalysisModal";
import ScoreInput from "./Score";

interface EvaluationCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  category: string;
  fullDescription: string;
  canBeEdited?: boolean; // to control if the card can be edited
  onChange?: (value: string) => void; // callback to parent
  score: number;
  onScoreChange?: (val: number) => void;
  readOnly?: boolean; // to control if the card is editable
}

const EvaluationCard: React.FC<EvaluationCardProps> = ({
  icon,
  title,
  category,
  description,
  fullDescription,
  onChange,
  canBeEdited,
  score,
  onScoreChange,
  readOnly: isReadonly = false, // default to false if not provided
}) => {
  const { openModal } = UseModal(`${category.toLowerCase()}-analysis`);
  const [value, setValue] = useState(description);

  // Note: No longer used
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
    if (onChange) onChange(e.target.value);
  };

  console.log("canBeEdited", canBeEdited);

  return (
    <>
      <div className="col-span-2 lg:col-span-1 flex flex-col gap-3">
        <div
          title="Click on the text to edit"
          className={`${
            canBeEdited ? "bg-white" : "bg-primary-300"
          } px-4 py-3 rounded-xl h-56 overscroll-y-contain`}
        >
          <header
            title="Click on the text to edit"
            className="flex items-center gap-2"
          >
            {icon}
            <h5 className="font-bold text-primary-900 text-sm">{category}</h5>

            {!canBeEdited && (
              <div className="ml-auto">
                <Button onClick={openModal} size={"xs"}>
                  View More
                </Button>
              </div>
            )}
          </header>
          <div className="relative font-roboto">
            <textarea
              value={value}
              disabled={!canBeEdited}
              placeholder={
                canBeEdited
                  ? `Enter notes about the ${category} criteria of this project`
                  : description
              }
              onChange={handleChange}
              className="mt-3 font-normal text-primary-900 text-xs h-40 outline-none overflow-y-auto pr-2 w-full bg-transparent border-none resize-none placeholder:text-primary-400 placeholder:italic"
              spellCheck={false}
            />
            {/* <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-primary-300 to-transparent" /> */}
          </div>
        </div>
        <ScoreInput
          readOnly={isReadonly}
          value={score}
          name={`${category.toLowerCase()}-score`}
          onChange={onScoreChange}
        />
      </div>

      <AnalysisModal
        category={category}
        title={title}
        fullDescription={fullDescription}
      />
    </>
  );
};

export default EvaluationCard;
