"use client";
import type * as React from "react";
import useSelectURLQuery from "@/hooks/useSelectURLQuery";
import type { FilterColor } from "@/types";

interface ColorFilterProps {
  colors: FilterColor[];
  /** Colours currently in the URL (`colors`) */
  selectedColors: string[];
}

const ColorFilter = ({ colors, selectedColors }: ColorFilterProps) => {
  const { handleSelectChange } = useSelectURLQuery();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      handleSelectChange(
        "colors",
        [...selectedColors, e.target.name].join(",")
      );
    } else {
      handleSelectChange(
        "colors",
        selectedColors.filter((color) => color !== `${e.target.name}`).join(",")
      );
    }
  };

  return (
    <div id="color-filter" className="border-b border-slate-200 pb-5">
      <h6 className="text-sm font-bold text-slate-900">By Colors</h6>
      {/* <div className="category-filter"> */}
      <div className="category-filter flex gap-4 flex-wrap pt-3">
        {/* bg-blue-500 */}
        {colors?.map((color, i) => (
          <div className="input-grp" key={i}>
            <label
              className="flex items-center gap-2 text-base text-slate-700 cursor-pointer"
              htmlFor={`clr-${i}`}
            >
              <input
                type="checkbox"
                id={`clr-${i}`}
                checked={selectedColors.includes(`${color.name}`)}
                name={color.name}
                value={color.code}
                onChange={handleChange}
                className="hidden"
              />
              <span
                // className={`inline-block w-3 h-3 rounded-full`}
                className={`border-2 h-[30px] w-[30px] text-center capitalize ${
                  selectedColors.includes(`${color.name}`)
                    ? "border-primary p-1"
                    : "border-slate-200"
                } `}
                style={{ background: color.code }}
              ></span>
              {/* <span className="pt-1 capitalize">{color.name}</span> */}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ColorFilter;
