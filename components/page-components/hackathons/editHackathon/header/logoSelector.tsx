import { HACKATHON_LOGO_TEMPLATES } from "@/components/page-components/projects/constants/bacakground";
import Image from "next/image";
import { memo } from "react";
import FileUploadArea from "./fileUpload";

interface LogoSelectorProps {
  logoPreviewUrl: string | null;
  onLogoTemplateSelect: (url: string) => void;
  onLogoUpload: (file: File) => void;
}

const LogoSelector = memo(
  ({
    logoPreviewUrl,
    onLogoTemplateSelect,
    onLogoUpload,
  }: LogoSelectorProps) => {
    return (
      <div className="mb-6">
        <div className="text-[#89898c] text-sm mb-4">Hackathon logo</div>

        <div className="flex gap-4 flex-wrap mb-2">
          {HACKATHON_LOGO_TEMPLATES.map((template, index) => (
            <button
              key={index}
              type="button"
              className={`aspect-square w-24 h-24 rounded-md flex items-center justify-center ${
                logoPreviewUrl === template ? "ring-2 ring-[#91c152]" : ""
              }`}
              onClick={() => onLogoTemplateSelect(template)}
            >
              <Image
                width={96}
                height={96}
                src={template}
                alt="Logo Template"
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>

        <div className="flex items-center gap-4 my-4">
          <div className="h-px bg-[#2b2b31] flex-grow"></div>
          <div className="text-[#89898c]">or</div>
          <div className="h-px bg-[#2b2b31] flex-grow"></div>
        </div>

        <FileUploadArea onFileUpload={onLogoUpload} />
      </div>
    );
  }
);

LogoSelector.displayName = "LogoSelector";

export default LogoSelector;
