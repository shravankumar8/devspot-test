import { Button } from "@/components/ui/button";
import Link from "next/link";

const AuthButtons = () => {
  return (
    <div className="flex flex-col sm:flex-row w-auto max-w-md items-center justify-end md:gap-3">
      <Link
        href={`${process.env.NEXT_PUBLIC_PROTOCOL}${process.env.NEXT_PUBLIC_BASE_SITE_URL}/sign-up`}
        className="w-auto"
      >
        <Button
          size="lg"
          variant="primary"
          className="px-5 rounded-lg h-10 min-w-fit py-3 font-roboto font-medium text-base"
        >
          Log In
        </Button>
      </Link>
    </div>
  );
};

export default AuthButtons;
