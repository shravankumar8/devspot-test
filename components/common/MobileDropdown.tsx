import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/utils/tailwind-merge";
import { ChevronDown } from "lucide-react";
import { Button } from "../ui/button";

type Option = {
  value: string | number;
  label: string;
};

type MobileDropdownProps = {
  selectedTab: string | number;
  handleDropdownChange: (event: { target: { value: string } }) => void;
  options: Option[];
  className?: string;
  placeholder?: string;
};

const MobileDropdown: React.FC<MobileDropdownProps> = ({
  selectedTab,
  handleDropdownChange,
  options,
  className,
  placeholder,
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className={cn(
            "flex items-center justify-between px-4 py-2 rounded-[0.625rem] gap-2",
            className
          )}
        >
          <span className="capitalize">{selectedTab.toString().length > 0 ? selectedTab :  placeholder}</span>
          <ChevronDown color="#4E52F5" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="font-roboto max-h-[200px] overflow-y-scroll !border-tertiary-text min-w-[10rem] !bg-tertiary-bg ">
        {options.map((option) => (
          <DropdownMenuItem
            key={option.value}
            className="cursor-pointer p-3 text-secondary-text bg-tertiary-bg border-b border-b-tertiary-text "
            onSelect={() =>
              handleDropdownChange({ target: { value: option.value.toString() } })
            }
          >
            {option.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default MobileDropdown;
