import { DatePicker } from "@/components/common/DatePicker";
import { DateTimePicker } from "@/components/common/TimePicker";
import { Switch } from "@/components/ui/switch";
import { Info } from "lucide-react";
import { DateTimeState } from "./types";

interface DateTimeFieldProps {
  label: string;
  description?: string;
  dateTime: DateTimeState;
  onDateChange: (date: Date | undefined) => void;
  onTimeChange: (time: string) => void;
  showCountdown?: boolean;
  onCountdownChange?: (show: boolean) => void;
  error?: string;
  hasCountdownToggle?: boolean;
}

const DateTimeField = ({
  label,
  description,
  dateTime,
  onDateChange,
  onTimeChange,
  showCountdown,
  onCountdownChange,
  error,
  hasCountdownToggle = false,
}: DateTimeFieldProps) => (
  <div className="space-y-3">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <label className="text-secondary-text text-sm font-medium">
          {label}
        </label>
        <Info className="w-4 h-4 text-gray-400" />
      </div>
      {hasCountdownToggle && onCountdownChange && (
        <div className="flex items-center gap-2">
          <span className="text-gray-400 text-sm">Display countdown</span>
          <Switch
            checked={showCountdown || false}
            onCheckedChange={onCountdownChange}
          />
        </div>
      )}
    </div>

    {description && (
      <p className="text-secondary-text text-sm">{description}</p>
    )}

    <div className="flex gap-3">
      <DatePicker
        value={dateTime.date}
        onChange={onDateChange}
        placeholder="Select Date"
        className="basis-[50%] text-sm"
      />
      <DateTimePicker
        time={dateTime.time}
        setTime={onTimeChange}
        className="basis-[50%] text-sm"
      />
    </div>

    {error && <p className="text-red-400 text-sm">{error}</p>}
  </div>
);

export default DateTimeField;
