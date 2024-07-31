import React from "react";
import dynamic from "next/dynamic";
const Lottie = dynamic(() => import("lottie-react"));
import empty from "@/public/assets/lottie/empty.json";

function NoItems({ title }) {
  return (
    <div className="flex-center md:mt-28">
      <div className="flex-center flex-col h-[25rem] w-[25rem] rounded-2xl border border-slate-300 mb-5">
        <div className="h-[216px] w-[216px]">
          <Lottie animationData={empty} loop={false} />
        </div>
        <h3 className="font-bold text-lg font-title text-slate-700">
          {title ?? "No items found"}
        </h3>
      </div>
    </div>
  );
}

export default NoItems;
