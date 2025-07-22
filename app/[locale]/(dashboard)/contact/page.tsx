"use client";

import { AppHeader } from "@/components/layout/dashboard/AppHeader";
import { DashboardFooter } from "@/components/layout/dashboard/DashboardFooter";
import { toast } from "sonner";

const Contact = () => {
  return (
    <div className=" relative">
      <AppHeader />
      <div className="mt-16 min-h-[calc(100vh-200px)]">
        <div className="">
          <div className="container mx-auto px-4 py-10 flex h-full justify-center items-center w-full md:flex-row">
            <div className="md:w-3/4 lg:w-[60%] mt-5 md:mt-0">
              <h1 className="text-[32px] font-semibold mb-10">Contact</h1>

              {/* Section 1: Acceptance of Terms */}
              <div className="pb-5 font-roboto text-sm flex gap-2 items-center">
                <p>
                  For any questions, please email{" "}
                  <span
                    onClick={() => {
                      navigator.clipboard.writeText('support@devspot.app');
                      toast.success('Email copied to clipboard!');
                    }}
                    className="cursor-pointer text-secondary-text hover:underline"
                  >
                    support@devspot.app
                  </span>.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Contact;
