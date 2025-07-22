import { Upload } from "lucide-react";
import React, { memo, useRef, useState } from "react";

interface FileUploadAreaProps {
  onFileUpload: (file: File) => void;
  accept?: string;
  className?: string;
}

const FileUploadArea = memo(
  ({
    onFileUpload,
    accept = "image/*",
    className = "",
  }: FileUploadAreaProps) => {
    const [isDragging, setIsDragging] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);

      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        const file = e.dataTransfer.files[0];
        if (file.type.startsWith("image/")) {
          onFileUpload(file);
        }
      }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
        onFileUpload(e.target.files[0]);
      }
    };

    return (
      <div
        className={`border-2 border-dashed ${
          isDragging ? "border-[#4e52f5] bg-[#4e52f5]/5" : "border-[#2b2b31]"
        } rounded-lg p-8 flex flex-col items-center justify-center cursor-pointer transition-colors duration-200 ${className}`}
        onClick={() => inputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          type="file"
          ref={inputRef}
          className="hidden"
          accept={accept}
          onChange={handleFileChange}
        />
        <div className="bg-[#2b2b31] p-2 rounded-full mb-2">
          <Upload className="h-5 w-5 text-[#4e52f5]" />
        </div>
        <div className="text-[#89898c] text-sm">
          Drag and drop file here or{" "}
          <span className="text-[#4e52f5]">click to upload</span>
        </div>
      </div>
    );
  }
);

FileUploadArea.displayName = "FileUploadArea";

export default FileUploadArea;
