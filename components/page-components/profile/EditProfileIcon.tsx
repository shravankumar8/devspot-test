import { cva } from "class-variance-authority";
import Image from "next/image";
import pencilIcon from "@/public/pencil_edit_icon1.png";

interface EditProfileIconProps {
  size?: "sm" | "base" | "lg";
}

const containerVariants = cva(
  "transition-all duration-200 ease-in-out rounded-full flex items-center justify-center group hover:bg-[#424248]/80 bg-[#424248]",
  {
    variants: {
      size: {
        sm: "w-6 h-6",
        base: "w-7 h-7",
        lg: "sm:w-9 sm:h-9 w-6 h-6",
      },
    },
    defaultVariants: {
      size: "base",
    },
  }
);

const imageVariants = cva(
  "transition-all duration-200 ease-in-out rotate-0 group-hover:rotate-6",
  {
    variants: {
      size: {
        sm: "w-[14px] h-[14px]",
        base: "w-[18px] h-[18px]",
        lg: "sm:w-[22px] sm:h-[22px] h-4 w-4",
      },
    },
    defaultVariants: {
      size: "base",
    },
  }
);

const EditProfileIcon = ({ size = "base" }: EditProfileIconProps) => {
  return (
    <button className={containerVariants({ size })}>
      <Image
        src={pencilIcon}
        alt="Edit Profile Picture"
        width={18}
        height={18}
        className={imageVariants({ size })}
      />
    </button>
  );
};

export default EditProfileIcon;
