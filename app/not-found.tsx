import { PlIcon } from "@/components/icons/Account";
import { NotFoundSvg } from "@/components/icons/ComingSoon";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const NotFound = () => {
  return (
    <div className="w-full h-screen flex items-center justify-center">
      <div className="flex flex-col gap-2.5 items-center justify-center font-roboto">
        <NotFoundSvg />
        <h3 className="text-white text-xl font-semibold">
          We all get lost sometimes!
        </h3>
        <p className="text-secondary-text text-sm font-normal">
          Is a hackathon really a hackathon if something isn’t broken?
        </p>
        <Link href="/hackathons">
          <Button variant="special" className="flex gap-2 items-center">
            <PlIcon />
            Browse Devspot
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
