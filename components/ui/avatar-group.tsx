import * as React from "react";
import { Avatar, AvatarImage, AvatarFallback } from "./avatar"; // Importing the Avatar components

interface AvatarGroupProps {
  children: React.ReactNode;
  limit?: number;
  className?: string;
}

const AvatarGroup: React.FC<AvatarGroupProps> = ({
  children,
  limit = 4,
  className,
}) => {
  const avatars = React.Children.toArray(children);

  // If the number of avatars exceeds the limit, show the remaining avatars count
  const overflowCount = avatars.length - limit;

  return (
    <div className={`flex space-x-[-8px] ${className}`}>
      {/* Render the avatars */}
      {avatars.slice(0, limit)}

      {/* Render the +N if there are extra avatars */}
      {overflowCount > 0 && (
        <Avatar className="flex justify-center items-center bg-primary-bg text-secondary-text">
          <span className="font-semibold text-xs">+{overflowCount}</span>
        </Avatar>
      )}
    </div>
  );
};

// Adding displayName for debugging
AvatarGroup.displayName = "AvatarGroup";

export default AvatarGroup;
