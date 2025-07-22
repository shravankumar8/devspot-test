"use client";

import { CompletedIcon } from "@/components/icons/Location";

export const ProgressStep = ({
  activeStep,
  stepsNumber,
}: {
  activeStep: number;
  stepsNumber: number;
}) => {
  const steps = Array.from({ length: stepsNumber }, (_, i) => i + 1);

  return (
    <div className="flex md:flex-col flex-row gap-6">
      {steps?.map((step) => (
        <div key={step}>
          {activeStep > step ? (
            <CompletedIcon width="28px" height="28px"/>
          ) : activeStep === step ? (
            <div className="relative">
              <div className="absolute md:-left-7 md:bottom-0 bg-main-primary md:h-full h-1 md:w-[2.8px] w-full -bottom-4"></div>

              <p className="h-7 w-7 rounded-full bg-main-primary flex text-xs justify-center items-center text-white font-roboto">
                {step}
              </p>
            </div>
          ) : (
            <div className="border-[2.8px] border-main-primary text-xs text-main-primary h-7 w-7 rounded-full bg-transparent flex justify-center items-center font-roboto">
              {step}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
