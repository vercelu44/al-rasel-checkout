"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

// ** Import Util Functions
import getCountDownValues from "../../utils/countdown";

const Timer = ({ targetDate }: { targetDate?: string | number | Date }) => {
  const countDownDate = new Date(targetDate).getTime();

  const [countDown, setCountDown] = useState(
    countDownDate - new Date().getTime()
  );

  const [days, hours, minutes, seconds] = getCountDownValues(countDown);

  useEffect(() => {
    const interval = setInterval(() => {
      setCountDown(countDownDate - new Date().getTime());
    }, 1000);

    return () => clearInterval(interval);
  }, [countDownDate]);

  return (
    <>
      <div className="sale-counter flex gap-3">
        <div className="single-counter flex flex-col justify-center items-center w-14 h-14 bg-[#333]">
          <p
            className="count-num text-base font-semibold font-title text-white"
            suppressHydrationWarning
          >
            {days}
          </p>
          <p className="text-xs text-white">Day</p>
        </div>
        <div className="single-counter flex flex-col justify-center items-center w-14 h-14 bg-[#333]">
          <p
            className="count-num text-base font-semibold font-title text-white"
            suppressHydrationWarning
          >
            {hours}
          </p>
          <p className="text-xs text-white">Hours</p>
        </div>
        <div className="single-counter flex flex-col justify-center items-center w-14 h-14 bg-[#333]">
          <p
            className="count-num text-base font-semibold font-title text-white"
            suppressHydrationWarning
          >
            {minutes}
          </p>
          <p className="text-xs text-white">Minutes</p>
        </div>
        <div className="single-counter flex flex-col justify-center items-center w-14 h-14 bg-[#333]">
          <p
            className="count-num text-base font-semibold font-title text-white"
            suppressHydrationWarning
          >
            {seconds}
          </p>
          <p className="text-xs text-white">Seconds</p>
        </div>
      </div>
    </>
  );
};

export default Timer;
