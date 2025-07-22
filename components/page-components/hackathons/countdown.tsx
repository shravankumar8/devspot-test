"use client";

import { useEffect, useState } from "react";

interface CountdownTimerProps {
  targetDate: Date;
  title?: string;
}

export function CountdownTimer({
  targetDate,
  title = "COUNTDOWN TO SUBMISSION DEADLINE",
}: Readonly<CountdownTimerProps>) {
  // Update the timeLeft state to include days
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    // Update the calculateTimeLeft function to calculate days
    const calculateTimeLeft = () => {
      const difference = targetDate.getTime() - new Date().getTime();

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  // Update the JSX to include days in the display
  return (
    <div className="relative w-full max-w-md text-white rounded-lg font-roboto">
      <h2 className="text-[13px] font-roboto font-medium mb-2">{title}</h2>
      <div className="flex justify-center items-start gap-2 sm:gap-4">
        {timeLeft.days > 0 && (
          <>
            <div className="flex flex-col items-center">
              <span className="lg:text-[32px] sm:text-[24px] text-[20px] font-bold">
                {String(timeLeft.days).padStart(2, "0")}
              </span>
              <span className="text-xs">DAYS</span>
            </div>
            <span className="lg:text-[32px] sm:text-[24px] text-[20px] font-bold">
              :
            </span>
          </>
        )}
        <div className="flex flex-col items-center">
          <span className="lg:text-[32px] sm:text-[24px] text-[20px] font-bold">
            {String(timeLeft.hours).padStart(2, "0")}
          </span>
          <span className="text-xs ">HOURS</span>
        </div>
        <span className="lg:text-[32px] sm:text-[24px] text-[20px] font-bold">
          :
        </span>
        <div className="flex flex-col items-center">
          <span className="lg:text-[32px] sm:text-[24px] text-[20px] font-bold">
            {String(timeLeft.minutes).padStart(2, "0")}
          </span>
          <span className="text-xs ">MINUTES</span>
        </div>
        <span className="lg:text-[32px] sm:text-[24px] text-[20px] font-bold">
          :
        </span>
        <div className="flex flex-col items-center">
          <span className="lg:text-[32px] sm:text-[24px] text-[20px] font-bold">
            {String(timeLeft.seconds).padStart(2, "0")}
          </span>
          <span className="text-xs ">SECONDS</span>
        </div>
      </div>
    </div>
  );
}
