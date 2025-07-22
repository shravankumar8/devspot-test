import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

import Label from "@/components/common/form/label";
import { TextArea } from "@/components/common/form/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Link, MapPin, Trash2 } from "lucide-react";
import { ScheduleEvent } from "./CustomCalendarEditor";

interface EventEditorProps {
  event: ScheduleEvent;
  onUpdate: (event: ScheduleEvent) => void;
  onDelete: (eventId: string) => void;
  onClose: () => void;
}

const EVENT_TYPES = [
  { value: "milestone", label: "Milestone", color: "bg-red-500" },
  { value: "webinar", label: "Webinar", color: "bg-blue-500" },
  { value: "speaker", label: "Speaker", color: "bg-green-500" },
  { value: "workshop", label: "Workshop", color: "bg-purple-500" },
  { value: "virtual", label: "Virtual", color: "bg-cyan-500" },
  { value: "in-person", label: "In-person", color: "bg-orange-500" },
  { value: "networking", label: "Networking", color: "bg-pink-500" },
];

export const EventEditor = ({
  event,
  onUpdate,
  onDelete,
  onClose,
}: EventEditorProps) => {
  const [formData, setFormData] = useState(event);

  const handleChange = (field: keyof ScheduleEvent, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    onUpdate(formData);
  };

  const handleDelete = () => {
    onDelete(event.id);
  };

  const toggleEventType = (type: string) => {
    handleChange("type", type as ScheduleEvent["type"]);
  };

  return (
    <div className="h-full flex flex-col bg-primary-bg rounded-lg">
      {/* Header */}
      <div className="p-4 border-b border-schedule-border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-schedule-text">
            {event.id === formData.id ? "Edit Event" : "New Event"}
          </h3>
          <button
            onClick={handleDelete}
            className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        {/* Event Type Tags */}
        <div className="flex gap-2 w-[95%] overflow-x-auto flex-nowrap">
          {EVENT_TYPES.map((type) => (
            <Badge
              key={type.value}
              variant={formData.type === type.value ? "default" : "outline"}
              className={`cursor-pointer font-roboto whitespace-nowrap  !bg-transparent !border-white h-6 flex justify-center items-center text-xs ${
                formData.type === type.value
                  ? "!bg-main-primary !text-white !border-main-primary"
                  : "border-schedule-border text-schedule-text-muted hover:bg-schedule-timeline"
              }`}
              onClick={() => toggleEventType(type.value)}
            >
              {type.label}
            </Badge>
          ))}
        </div>
      </div>

      {/* Form Content */}
      <div className="overflow-y-auto p-4 space-y-4 h-[362px]">
        {/* Title */}
        <div className="space-y-2">
          <Input
            value={formData.title}
            onChange={(e) => handleChange("title", e.target.value)}
            className="h-10"
            placeholder="Enter event title"
          />
        </div>

        {/* Time */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Input
              type="time"
              value={formData.startTime}
              onChange={(e) => handleChange("startTime", e.target.value)}
              className="h-10"
            />
          </div>
          <div className="space-y-2">
            <Input
              type="time"
              value={formData.endTime}
              onChange={(e) => handleChange("endTime", e.target.value)}
              className="h-10"
            />
          </div>
        </div>

        {/* Location */}
        <div className="grid grid-cols-2 w-full gap-4">
          <div className="space-y-2">
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-main-primary" />
              <Input
                value={formData.locationName || ""}
                onChange={(e) => handleChange("locationName", e.target.value)}
                className="pl-10 h-10"
                placeholder="Location name"
              />
            </div>
          </div>
          <div className="space-y-2">
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-main-primary" />
              <Input
                value={formData.locationName || ""}
                onChange={(e) =>
                  handleChange("locationAddress", e.target.value)
                }
                className="pl-10 h-10"
                placeholder="Location link address"
              />
            </div>
          </div>
          <div className="space-y-2">
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-main-primary" />
              <Input
                value={formData.locationName || ""}
                onChange={(e) => handleChange("linkName", e.target.value)}
                className="pl-10 h-10"
                placeholder="Link name"
              />
            </div>
          </div>
          <div className="space-y-2">
            <div className="relative">
              <Link className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-main-primary" />
              <Input
                value={formData.linkAddress || ""}
                onChange={(e) => handleChange("linkAddress", e.target.value)}
                className="pl-10 h-10"
                placeholder="Link address"
              />
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <TextArea
            name="description"
            value={formData.description || ""}
            onChange={(e) => handleChange("description", e.target.value)}
            className="resize-none"
            placeholder="Event description..."
            rows={3}
          />
        </div>

        {/* RSVP Toggle */}
        <div className="flex items-center justify-between">
          <Label className="text-white">Include RSVP button</Label>
          <Switch
            checked={formData.includeRSVP}
            onCheckedChange={(checked) => handleChange("includeRSVP", checked)}
          />
        </div>
      </div>

      {/* Footer Actions */}
      <div className="p-4 border-t border-schedule-border">
        <div className="flex gap-3">
          <Button
            size="md"
            variant="secondary"
            onClick={onClose}
            className="flex-1 border-schedule-border text-schedule-text hover:bg-schedule-timeline"
          >
            Cancel
          </Button>
          <Button
            size="md"
            onClick={handleSave}
            className="flex-1 bg-primary hover:bg-primary/90"
          >
            Save Event
          </Button>
        </div>
      </div>
    </div>
  );
};
