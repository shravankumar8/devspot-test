import { HACKATHON_BACKGROUND_TEMPLATES } from "@/components/page-components/projects/constants/bacakground";
import Image from "next/image";
import { memo } from "react";
import FileUploadArea from "./fileUpload";

interface BackgroundSelectorProps {
  backgroundPreviewUrl: string | null;
  onBackgroundTemplateSelect: (url: string) => void;
  onBackgroundUpload: (file: File) => void;
}

const BackgroundSelector = memo(
  ({
    backgroundPreviewUrl,
    onBackgroundTemplateSelect,
    onBackgroundUpload,
  }: BackgroundSelectorProps) => {
    return (
      <div className="mb-6">
        <div className="text-[#89898c] text-sm mb-4">Header background</div>

        <div className="grid grid-cols-8 gap-4 mb-2">
          {HACKATHON_BACKGROUND_TEMPLATES.map((color, index) => (
            <button
              key={index}
              type="button"
              className={`aspect-square w-24 h-24 rounded-md shadow-xl ${
                backgroundPreviewUrl === color ? "ring-2 ring-[#91c152]" : ""
              }`}
              style={{ backgroundColor: color }}
              onClick={() => onBackgroundTemplateSelect(color)}
            >
              <Image
                width={96}
                height={96}
                src={color}
                alt="Background Template"
                className="w-full h-full object-cover rounded-md"
              />
            </button>
          ))}
        </div>

        <div className="flex items-center gap-4 my-4">
          <div className="h-px bg-[#2b2b31] flex-grow"></div>
          <div className="text-[#89898c]">or</div>
          <div className="h-px bg-[#2b2b31] flex-grow"></div>
        </div>

        <FileUploadArea onFileUpload={onBackgroundUpload} />
      </div>
    );
  }
);

BackgroundSelector.displayName = "BackgroundSelector";

export default BackgroundSelector;
