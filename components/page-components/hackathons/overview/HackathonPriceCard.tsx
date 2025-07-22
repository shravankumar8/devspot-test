import { ReactNode } from "react";
import { Cash, CustomPrizeIcon, DevTokenIcon } from "../../../icons/Location";

interface PrizeCardProps {
  icon: ReactNode;
  amount: number;
  tokens: number;
  company_partner_url: string;
  custom_category: string | null;
  custom_prize: string | null;
  position?: number; // 1, 2, or 3 for first, second, and third prize respectively
}

export default function HackathonPriceCard({
  icon,
  amount,
  tokens,
  position,
  custom_category,
  custom_prize,
  company_partner_url,
}: Readonly<PrizeCardProps>) {
  return (
    <div className="relative w-full md:max-w-[350px] bg-gradient-to-t dark:to-[#13131A] dark:from-[#2B2B31] text-white rounded-lg p-6">
      <div className={`mt-2 w-full`}>
        {amount ? (
          <div className="flex gap-1 items-center text-[18px] md:text-[20px] xl:text-[24px]">
            <Cash />
            <span className="ml-2 text-2xl sm:text-[28px] font-semibold">
              ${amount}
            </span>
            <span className="font-[600] text-2xl sm:text-[28px]">USD</span>
          </div>
        ) : (
          custom_prize && (
            <div className={"text-base font-roboto flex items-center gap-3"}>
              <CustomPrizeIcon className="flex-shrink-0"/> {custom_prize}
            </div>
          )
        )}
        {tokens > 0 && (
          <div className="flex gap-2 items-center mt-4 text-[14px] font-roboto font-[400]">
            <DevTokenIcon width="32px" height="32px" />
            <span className="">{tokens} DevSpot Swag Tokens</span>
          </div>
        )}
        {position && (
          <div className="flex items-center gap-2 font-roboto mt-4">
            {icon}
            <span className="text-[14px]">
              {position == 1
                ? "1ST PLACE"
                : position == 2
                ? "2ND PLACE"
                : position == 3
                ? "3RD PLACE"
                : ""}
            </span>
          </div>
        )}
        {custom_category && (
          <p className="text-xs max-w-[80%] font-roboto mt-5">{custom_category}</p>
        )}
        <div className="w-8 h-8 rounded-lg overflow-hidden  absolute bottom-3 right-3">
          <img
            src={company_partner_url}
            alt="sponsor_logo"
            className="object-contain h-full w-full"
          />
        </div>
      </div>
    </div>
  );
}
