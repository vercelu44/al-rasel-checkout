"use client";
import type * as React from "react";
import useSelectURLQuery from "@/hooks/useSelectURLQuery";
import type { FilterSize } from "@/types";

interface SizeFilterProps {
  sizes: FilterSize[];
  /** Sizes currently in the URL (`sizes`) */
  selectedSizes: string[];
}

const SizeFilter = ({ sizes, selectedSizes }: SizeFilterProps) => {
  const { handleSelectChange } = useSelectURLQuery();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      handleSelectChange("sizes", [...selectedSizes, e.target.value].join(","));
    } else {
      handleSelectChange(
        "sizes",
        selectedSizes.filter((size) => size !== `${e.target.value}`).join(",")
      );
    }
  };

  return (
    <div id="size-filter" className="border-b border-slate-200 pb-5">
      <h6 className="text-sm font-bold text-slate-900">By Sizes</h6>
      <div className="size-filter flex gap-4 flex-wrap pt-3">
        {sizes?.map((size, i) => (
          <div className="input-grp" key={i}>
            <label
              className="flex items-center gap-2 text-base text-slate-700 cursor-pointer"
              htmlFor={`size-${i}`}
            >
              <input
                type="checkbox"
                id={`size-${i}`}
                checked={selectedSizes.includes(`${size.name}`)}
                value={size.name}
                onChange={handleChange}
                className="hidden"
              />
              <span
                className={`border p-1 min-w-[30px] text-center capitalize ${
                  selectedSizes.includes(`${size.name}`)
                    ? "border-primary"
                    : "border-slate-200"
                } `}
              >
                {size.name}
              </span>
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SizeFilter;

{
  /* <div id="size-filter" className="border-b border-slate-200 pb-5">
      <h6 className="text-sm font-bold text-slate-900">By Sizes</h6>
      <div className="size-filter flex gap-4 flex-wrap mt-3">
        {sizes?.map((size, i) => (
          <button
          key={i}
          // onClick={()=>handleChange()}
            className={`border p-1 min-w-[30px] text-center capitalize ${
              selectedSizes.includes(`${size.name}`)
                ? "border-primary"
                : "border-slate-200"
            } `}
          >
            {size.name}
          </button>
        ))}
      </div>
    </div> */
}
