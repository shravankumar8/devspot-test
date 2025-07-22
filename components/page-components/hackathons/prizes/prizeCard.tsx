import {
  Cash,
  CustomPrizeIcon,
  DevTokenIcon,
  FirstPrize,
  SecondPrize,
  ThirdPrize,
} from "@/components/icons/Location";
import { PrizeCardProps } from "@/types/hackathons";
import { cn } from "@/utils/tailwind-merge";



export const PrizeCard: React.FC<PrizeCardProps> = ({ prize }) => {



  return (
    <div className="rounded-xl p-5 shadow-sm space-y-2 border-[0.5px] border-transparent prize-card bg-gradient-to-b from-[#1D1D23] to-[#2B2B31] font-roboto relative">
      {prize.cash && (
        <div className="flex items-center gap-3">
          <Cash />
          <p className="text-[28px] font-semibold">${prize.cash} USD</p>
        </div>
      )}
      {prize.tokens && (
        <div
          className={cn(
            prize.cash ? `text-base font-roboto` : "text-2xl font-raleway",
            "flex items-center gap-3"
          )}
        >
          <DevTokenIcon width="32px" height="32px" /> {prize.tokens} DevSpot
          Swag Tokens
        </div>
      )}
      {prize.custom_prize && (
        <div
          className={cn(
            prize.cash || prize.tokens
              ? "text-base font-roboto"
              : "text-lg font-raleway",
            "flex items-center gap-3"
          )}
        >
          <CustomPrizeIcon className="flex-shrink-0" /> {prize.custom_prize}
        </div>
      )}
      <div className="flex w-full items-center justify-between">
        <div className="w-full">
          {prize.position && (
            <p className="mb-3">
              {prize.position == 1 ? (
                <span className="flex items-center gap-2 font-medium text-sm">
                  <FirstPrize /> 1ST PLACE
                </span>
              ) : prize.position == 2 ? (
                <span className="flex items-center gap-2 text-sm">
                  <SecondPrize />
                  2ND PLACE
                </span>
              ) : prize.position == 3 ? (
                <span className="flex items-center gap-2 text-sm">
                  <ThirdPrize />
                  3RD PLACE
                </span>
              ) : (
                ""
              )}
            </p>
          )}
          {prize.custom_category && (
            <p className="text-xs max-w-[80%]">{prize.custom_category}</p>
          )}
        </div>
        <div className="w-8 h-8 rounded-lg overflow-hidden absolute bottom-3 right-3 flex-shrink-0">
          <img
            src={prize.company_partner_url}
            alt={prize.sponsor.name}
            className="object-contain h-full w-full"
          />
        </div>
      </div>
    </div>
  );
};
