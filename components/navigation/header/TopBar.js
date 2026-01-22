"use client";
import React from "react";

export default function TopBar({ settings }) {
  const items = settings?.offer_massage
    ?.split(/\s{3,}/)
    .map((item) => item.trim())
    .filter(Boolean);

  if (!items?.length) return null;

  return (
    <div
      className="w-full overflow-hidden py-1.5"
      style={{ background: settings?.colors?.tertiary }}
    >
      <div className="relative flex overflow-hidden">
        <div className="flex shrink-0 py-2 animate-marquee whitespace-nowrap hover:[animation-play-state:paused]">
          {[...items, ...items].map((item, index) => (
            <span
              key={index}
              className="flex items-center pr-7 text-lg font-semibold text-white"
            >
              <span className="w-1.5 h-1.5 bg-white rounded-full mr-7" />
              {item}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
