"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { MdLocalShipping } from "react-icons/md";

export default function TopBar({ settings }) {
  const [isTopBarHidden, setIsTopBarHidden] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        // Adjust the value based on when you want to hide the top bar
        setIsTopBarHidden(true);
      } else {
        setIsTopBarHidden(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div
      className={`${
        isTopBarHidden ? "hidden" : "block"
      } py-1.5  text-center bg-[#2B2D42] w-full`}
      style={{
        background: settings?.colors?.tertiary,
      }}
    >
      <div className="container flex flex-wrap justify-between items-center">
        <h3
          className="hidden md:block text-white text-sm font-normal tracking-widest"
          style={{ color: settings?.colors?.tertiary_text }}
        >
          {settings?.offer_massage}
        </h3>

        <div>
          <Link
            href="/track-order"
            className="inline-flex  gap-2 items-center"
            style={{ color: settings?.colors?.tertiary_text }}
          >
            <MdLocalShipping size={20} />
            Order Tracking
          </Link>
        </div>
      </div>
    </div>
  );
}
