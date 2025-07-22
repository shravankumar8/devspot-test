import React from "react";

interface FeedbackCardProps {
  title: string;
  rating: number;
  className?: string;
}

const FeedbackCard: React.FC<FeedbackCardProps> = ({
  title,
  rating,
  className = "",
}) => {
  return (
    <div
      className={`bg-dark-card border-2 border-blue-border gradient-border !rounded-2xl px-5 py-4 ${className}`}
    >
      <div className="text-secondary-text text-sm mb-2 font-roboto">{title}</div>
      <div className="text-white text-[24px] font-meduim font-roboto">{rating}</div>
    </div>
  );
};

export default FeedbackCard;
