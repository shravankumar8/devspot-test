import { Button } from "@/components/ui/button";
import Link from "next/link";

interface EmptyStateProps {
  title: string;
  description: string;
  buttonLabel?: string;
  href?: string;
}

const EmptyState = (props: EmptyStateProps) => {
  const { buttonLabel, description, title, href } = props;

  return (
    <div className="w-full min-h-[500px] flex items-center justify-center">
      <div className="flex flex-col gap-2.5 items-center justify-center font-roboto">
        <h3 className="text-white leading-[24px] text-xl font-semibold">
          {title}
        </h3>
        <p className="text-secondary-text text-sm font-normal">{description}</p>
        {buttonLabel &&  href &&(
          <Link href={href}>
            <Button>Browse {buttonLabel}</Button>
          </Link>
        )}
      </div>
    </div>
  );
};

export default EmptyState;
