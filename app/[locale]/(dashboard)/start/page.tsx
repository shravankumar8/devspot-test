"use server";

import { getI18n } from "@/locales/server";

import { Button } from "@/components/ui/button";
import { Step, VerticalSteps } from "@/components/ui/vertical-steps";
import LogInButton from "@/components/ui/login-provider-button";

const steps: Step[] = [
  { index: 0, link: "/", completed: false, current: true },
  { index: 1, link: "/", completed: false, current: false },
  { index: 2, link: "/", completed: false, current: false },
  { index: 3, link: "/", completed: false, current: false },
];

export default async function Home() {
  const t = await getI18n();

  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <div className="mx-auto max-w-7xl py-24  sm:py-32 ">
        <div className="flex border border-slate-100/20 dark:border-none">
          <div className="hidden sm:flex">
            <VerticalSteps steps={steps} />
          </div>

          <div className="relative isolate overflow-hidden dark:bg-slate-400   lg:gap-x-20 ">
            <div className="mx-auto max-w-lg text-left lg:mx-0 lg:flex-auto  lg:text-left px-14 lg:px-12 pt-12">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                {t("createAccount")}
              </h2>
              <p className="mt-6 text-lg leading-8 ">
                {t("communicateWithYou")}
              </p>
            </div>

            <div className="relative mt-6">
              <div
                className="absolute inset-0 flex items-center"
                aria-hidden="true"
              >
                <div className="w-full border-t border-gray-200  dark:border-blue-400/10" />
              </div>
              <div className="relative flex justify-center text-sm font-medium leading-6">
                <span className="bg-white px-2 dark:bg-slate-400 ">
                  Connect with
                </span>
              </div>
            </div>
            <LogInButton provider="GitHub" image_src="/github.png" />
            <div className="mt-10 flex items-center justify-between gap-x-6 px-14 lg:px-12 dark:bg-black-terciary bg-neutral-200 py-8">
              <Button>Login</Button>
              <Button disabled>Next</Button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
