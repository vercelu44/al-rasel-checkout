"use client";
import { cn } from "@/utils";
import Link from "next/link";
import { MdLocalShipping } from "react-icons/md";

const TrackOrderButton = ({ className }) => {
  return (
    <Link
      href="/track-order"
      className={cn(
        "group relative hidden lg:inline-flex items-center gap-1 rounded-full overflow-hidden p-[2px]",
        className,
      )}
    >
      {/* Continuously moving border */}
      <span
        className="
        absolute inset-[-200%] 
        animate-[spin_4s_linear_infinite]
        "
        style={{
          background: `
        conic-gradient(
          from 0deg,
          #111111,
          #ff0080,
          #7928ca,
          #00c6ff,
          #00f2fe,
          #ff0080,
          #111111
        )
      `,
        }}
      />

      {/* Inner background */}
      <span className="relative z-10 inline-flex items-center gap-1 rounded-full bg-white/95 px-3 py-1 font-medium tracking-wide text-black">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-black/10 transition-colors duration-200 group-hover:bg-black/15">
          <MdLocalShipping size={18} />
        </span>

        <span>Order Tracking</span>
      </span>
    </Link>
  );
};

export default TrackOrderButton;
