"use client";

import { useTransition } from "react";
import { signOutAction } from "@/app/[locale]/(authRoutes)/sign-up/actions";
import { useAuthStore } from "@/state";
import { CiLogout } from "react-icons/ci";
import { useRouter } from "next/navigation";

export default function SignOutButton() {
  const [isPending, startTransition] = useTransition();
  const { setSession } = useAuthStore();
  const router = useRouter();

  const handleClickSignOutButton = () => {
    startTransition(async () => {
      const { errorMessage } = await signOutAction();
      setSession(null);
      router.push("/login");
      console.log(errorMessage);
    });
  };

  return (
    <form className="flex flex-col items-center !z-50 relative">
      <button
        className="w-full bg-inherit flex items-center gap-2 text-[#89898C] hover:text-[#FFFFFF] profile  transition-all ease-in-out duration-200"
        onClick={() => handleClickSignOutButton()}
        disabled={isPending}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          className="person-profile"
        >
          <path
            d="M10.2 20.1C10.2 19.8613 10.1052 19.6324 9.93642 19.4636C9.76763 19.2948 9.53872 19.2 9.30002 19.2H5.70002C5.46133 19.2 5.2324 19.1052 5.06362 18.9364C4.89483 18.7676 4.80002 18.5387 4.80002 18.3L4.80002 5.7C4.80002 5.4613 4.89483 5.23239 5.06362 5.0636C5.2324 4.89482 5.46133 4.8 5.70002 4.8L9.30002 4.8C9.53872 4.8 9.76763 4.70518 9.93642 4.5364C10.1052 4.36761 10.2 4.1387 10.2 3.9C10.2 3.66131 10.1052 3.43239 9.93642 3.2636C9.76763 3.09482 9.53872 3 9.30002 3L5.70002 3C4.98394 3 4.29716 3.28446 3.79081 3.79081C3.28446 4.29716 3 4.98392 3 5.7L3 18.3C3 19.0161 3.28446 19.7028 3.79081 20.2092C4.29716 20.7155 4.98394 21 5.70002 21H9.30002C9.53872 21 9.76763 20.9052 9.93642 20.7364C10.1052 20.5676 10.2 20.3387 10.2 20.1Z"
            fill="#89898C"
          />
          <path
            d="M20.9274 11.6617C20.8845 11.5512 20.8203 11.4503 20.7384 11.3647L17.1384 7.76468C17.0545 7.68077 16.9548 7.6142 16.8452 7.56879C16.7356 7.52338 16.618 7.5 16.4994 7.5C16.3807 7.5 16.2632 7.52338 16.1535 7.56879C16.0439 7.6142 15.9443 7.68077 15.8604 7.76468C15.7765 7.8486 15.7099 7.94822 15.6645 8.05786C15.6191 8.1675 15.5957 8.28501 15.5957 8.40368C15.5957 8.52236 15.6191 8.63987 15.6645 8.74951C15.7099 8.85915 15.7765 8.95877 15.8604 9.04268L17.9304 11.1037H9.29937C9.06067 11.1037 8.83175 11.1985 8.66297 11.3673C8.49419 11.5361 8.39937 11.765 8.39937 12.0037C8.39937 12.2424 8.49419 12.4713 8.66297 12.6401C8.83175 12.8089 9.06067 12.9037 9.29937 12.9037L17.9304 12.9037L15.8604 14.9647C15.6909 15.1342 15.5957 15.364 15.5957 15.6037C15.5957 15.8434 15.6909 16.0732 15.8604 16.2427C16.0298 16.4122 16.2597 16.5074 16.4994 16.5074C16.739 16.5074 16.9689 16.4122 17.1384 16.2427L20.7384 12.6427C20.8203 12.5571 20.8845 12.4562 20.9274 12.3457C20.975 12.238 20.9996 12.1215 20.9996 12.0037C20.9996 11.8859 20.975 11.7694 20.9274 11.6617Z"
            fill="#89898C"
          />
        </svg>
        {isPending ? "Signing out..." : "Sign Out"}
      </button>
    </form>
  );
}
