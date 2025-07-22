import {
  Cash,
  CustomPrizeIcon,
  DevTokenIcon,
} from "@/components/icons/Location";
import AddPrizeModal from "@/components/page-components/TODashboard/prizes/challenges/AddPrizeModal";
import { HackathonChallengeBounties } from "@/types/entities";
import { Trophy } from "lucide-react";
import { memo } from "react";


interface PrizeCardProps {
  prize: HackathonChallengeBounties;
  onEdit: () => void;
  hackathonId: number
}

export const PrizeCard = memo<PrizeCardProps>(({ prize, onEdit, hackathonId }) => {
  const renderPrizeItems = () => {
    const items = [];

    // USD Prize (highest priority)
    if (prize.prize_usd !== null && prize.prize_usd > 0) {
      items.push(
        <div key="usd" className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded flex items-center justify-center">
            <Cash className="size-5 stroke-main-primary" />
          </div>
          <span className="text-white text-lg font-semibold">
            ${prize.prize_usd.toLocaleString()} USD
          </span>
        </div>
      );
    }

    // Token Prize
    if (prize.prize_tokens !== null && prize.prize_tokens > 0) {
      items.push(
        <div key="tokens" className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded flex items-center justify-center">
            <DevTokenIcon />
          </div>
          <span className="text-white font-roboto">
            {prize.prize_tokens.toLocaleString()} DevSpot Tokens
          </span>
        </div>
      );
    }

    // Custom Prize
    if (prize.prize_custom !== null && prize.prize_custom.trim() !== "") {
      items.push(
        <div key="custom" className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded flex items-center justify-center">
            <CustomPrizeIcon className="size-5 stroke-main-primary" />
          </div>
          <span className="text-white font-roboto">{prize.prize_custom}</span>
        </div>
      );
    }

    return items;
  };

  return (
    <div className="bg-gradient-to-b from-[#1D1D23] to-[#2B2B31] rounded-lg p-6 space-y-3 relative w-[336px] h-[330px]">
      <div className="space-y-2">{renderPrizeItems()}</div>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Trophy className="h-5 w-5 text-yellow-500" />
          <span className="text-sm text-gray-400 font-roboto">
            {prize.title.toUpperCase()}
          </span>
        </div>
        <AddPrizeModal
          prize={prize}
          mode="Edit"
          challengeId={prize.challenge_id}
          hackathonId={hackathonId}
        />
      </div>
    </div>
  );
});

PrizeCard.displayName = "PrizeCard";
