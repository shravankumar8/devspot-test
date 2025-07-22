import { PlIcon } from "@/components/icons/Account";
import { ComingSoonSvg } from "@/components/icons/ComingSoon";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface EmptyStateProps {
  description: string;
  showButton?: boolean;
}

const EmptyPage = (props: EmptyStateProps) => {
  const { showButton = true, description } = props;

  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="flex flex-col gap-5 items-center justify-center font-roboto">
        <ComingSoonSvg />
        <h3 className="text-white text-base sm:text-xl font-semibold">
          We’re building something amazing for you.
        </h3>
        <p className="text-secondary-text text-[13px] sm:text-sm font-normal">
          {description}
        </p>
        {showButton && (
          <Link href="/hackathons">
            <Button variant="special" className="flex gap-2 items-center">
              <PlIcon />
              Browse Devspot
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
};

export default EmptyPage;
