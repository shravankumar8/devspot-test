import { cn } from "@/utils/tailwind-merge";

interface EventTypeSelectorProps {
  eventType: "virtual" | "physical";
  onChange: (type: "virtual" | "physical") => void;
}

const EventTypeSelector = ({ eventType, onChange }: EventTypeSelectorProps) => (
  <div className="space-y-3">
    <label className="text-secondary-text text-sm font-medium">
      Virtual or in-person?
    </label>
    <div className="flex gap-2">
      {(["virtual", "physical"] as const).map((type) => (
        <button
          key={type}
          type="button"
          onClick={() => onChange(type)}
          className={cn(
            "px-4 h-7 flex justify-center items-center rounded-lg text-sm font-medium transition-colors",
            eventType === type
              ? "bg-main-primary text-white"
              : "bg-[#424248] text-secondary-text hover:bg-gray-600"
          )}
        >
          {type === "virtual" ? "Virtual" : "In-person"}
        </button>
      ))}
    </div>
  </div>
);

export default EventTypeSelector;
