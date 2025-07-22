import { TeamMemberships } from "@/types/entities";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { useState, useRef, useEffect } from "react";
import { cn } from "@/utils/tailwind-merge";

interface AllocationCardProps {
  member: TeamMemberships;
  mode?: "static" | "active";
  onChange?: (value: number) => void;
  className?: string;
}

export default function AllocationCard({
  member,
  mode = "static",
  onChange,
  className,
}: AllocationCardProps) {
  const user = member?.users;
  const initialAllocation = member?.prize_allocation ?? 0;
  const [allocation, setAllocation] = useState(initialAllocation);
  const [isDragging, setIsDragging] = useState(false);
  const progressRef = useRef<HTMLDivElement>(null);

  // Update internal state when prop changes
  useEffect(() => {
    setAllocation(member?.prize_allocation ?? 0);
  }, [member?.prize_allocation]);

  // Handle slider drag
  const handleDrag = (clientX: number) => {
    if (!progressRef.current || mode === "static") return;

    const rect = progressRef.current.getBoundingClientRect();
    const position = clientX - rect.left;
    const width = rect.width;

    // Calculate percentage (0-100)
    let newValue = Math.round((position / width) * 100);
    newValue = Math.max(0, Math.min(100, newValue));

    setAllocation(newValue);
    onChange?.(newValue);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (mode === "static") return;
    setIsDragging(true);
    handleDrag(e.clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      handleDrag(e.clientX);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Handle click on progress bar
  const handleProgressClick = (e: React.MouseEvent) => {
    if (mode === "static") return;
    handleDrag(e.clientX);
  };

  useEffect(() => {
    if (mode === "static") return;

    const handleGlobalMouseUp = () => {
      setIsDragging(false);
    };

    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        handleDrag(e.clientX);
      }
    };

    document.addEventListener("mouseup", handleGlobalMouseUp);
    document.addEventListener("mousemove", handleGlobalMouseMove);

    return () => {
      document.removeEventListener("mouseup", handleGlobalMouseUp);
      document.removeEventListener("mousemove", handleGlobalMouseMove);
    };
  }, [isDragging, mode]);

  if (!user) return null;
  return (
    <div className="flex flex-col p-3 pr-7 bg-secondary-bg border-tertiary-bg border-[2px] rounded-[12px] max-w-[380px]">
      <div className="flex items-center gap-3 mb-1">
        <Avatar className="w-8 h-8 bg-black">
          <AvatarImage
            src={user?.avatar_url || "/default-profile.png"}
            alt={user?.full_name ?? ""}
            className="object-contain"
          />
        </Avatar>
        <h2 className="text-base font-medium text-white">{user?.full_name}</h2>
      </div>

      <div className="flex gap-3 mb-6">
        {user?.roles?.map((role, indx) => (
          <span
            key={indx}
            className="px-4 py-2 rounded-full bg-[#2b2b31] text-[#ffffff]"
          >
            {role?.participant_roles?.name}
          </span>
        ))}
      </div>

      <div className="relative w-full mt-6">
        {/* Percentage label above thumb */}
        <div
          className={cn(
            "absolute -top-12 transform -translate-x-1/2 transition-all duration-150",
            mode === "active" && isDragging && "scale-110"
          )}
          style={{
            left: `${allocation}%`,
          }}
        >
          <div
            className={cn(
              "flex items-center justify-center h-[24px] p-2 rounded-full bg-transparent border border-white"
            )}
          >
            <span className="text-right text-xs text-white">{allocation}%</span>
          </div>
        </div>

        {/* Progress bar */}
        <div
          ref={progressRef}
          className={cn(
            "w-full h-2 rounded-full bg-[#2b2b31] overflow-hidden",
            mode === "active" && "cursor-pointer"
          )}
          onClick={handleProgressClick}
        >
          <div
            className="h-full rounded-full bg-[#4e52f5]"
            style={{
              width: `${allocation}%`,
            }}
          ></div>
        </div>

        {/* Thumb directly on the progress bar */}
        <div
          className={cn(
            "absolute w-5 h-5 rounded-full bg-[#4e52f5] top-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-all",
            mode === "active" && "cursor-grab w-6 h-6 shadow-md",
            mode === "active" &&
              isDragging &&
              "cursor-grabbing scale-110 shadow-lg"
          )}
          style={{
            left: `${allocation}%`,
          }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
        ></div>
      </div>

      {mode === "active" && (
        <div className="mt-4 text-xs text-gray-400 text-center">
          Drag the slider to adjust allocation
        </div>
      )}
    </div>
  );
}
