"use client";
import React from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useGetFilterOptionsByCategoryQuery } from "@/store/api/filterOptionsAPI";

import BrandFilter from "../filters/BrandFilter";
import ColorFilter from "../filters/ColorFilter";
import CategoryFilter from "../filters/CategoryFilter";
import PriceRangeFilter from "../filters/PriceRangeFilter";

// ** Imoprt icons
// import { IoCloseOutline } from "react-icons/io5";
// import useSelectURLQuery from "@/hooks/useSelectURLQuery";
import SizeFilter from "./SizeFilter";

const Filter = ({ category }) => {
	// const router = useRouter();
	const { locale } = useParams();
	// const { handleSelectChange } = useSelectURLQuery();
	const searchQuery = category?.id ? `category_ids=${category?.id}` : "";
	const { data: filterOptions } = useGetFilterOptionsByCategoryQuery({
		searchQuery,
		locale,
	});

	const searchParams = useSearchParams();
	const params = new URLSearchParams(searchParams);

	//selected brands
	const brandIdsString = params.get("brand_ids");
	let selectedBrandIds = [];
	if (brandIdsString) {
		selectedBrandIds = brandIdsString.split(",");
	}

	//selected colors
	const colorsString = params.get("colors");
	let selectedColors = [];
	if (colorsString) {
		selectedColors = colorsString.split(",");
	}

	//selected sizes
	const sizesString = params.get("sizes");
	let selectedSizes = [];
	if (sizesString) {
		selectedSizes = sizesString.split(",");
	}

	return (
		<div
			className={`min-w-[15rem] lg:max-w-[15rem] min-h-fit pb-4 md:pb-14 filter-sidebar flex flex-col pr-2 gap-y-5`}
		>
			{/* {category || selectedBrandIds.length || selectedColors.length ? (
        <div className="flex items-center flex-wrap gap-2">
          {category && (
            <div className="flex items-center gap-1 bg-slate-100 border-slate-200 rounded px-2 py-1">
              <p className="text-sm text-slate-900">{category.category_name}</p>
              <IoCloseOutline
                size={24}
                className="text-red-500 cursor-pointer"
                onClick={() => router.push("/products?sort_type=new")}
              />
            </div>
          )}
          
          {filterOptions?.brands?.map((brand) =>
            selectedBrandIds.includes(`${brand.id}`) ? (
              <div
                key={brand.id}
                className="flex items-center gap-1 bg-slate-100 border-slate-200 rounded px-2 py-1"
              >
                <p className="text-sm text-slate-900">{brand.brand_name}</p>
                <IoCloseOutline
                  size={24}
                  className="text-red-500 cursor-pointer"
                  onClick={() =>
                    handleSelectChange(
                      "brand_ids",
                      selectedBrandIds
                        .filter((id) => id !== `${brand.id}`)
                        .join(",")
                    )
                  }
                />
              </div>
            ) : null
          )}

          {filterOptions?.colors?.map((color) =>
            selectedColors.includes(`${color.name}`) ? (
              <div
                key={color.id}
                className="flex items-center gap-1 bg-slate-100 border-slate-200 rounded px-2 py-1"
              >
                <span
                  className={`inline-block w-3 h-3 rounded-full`}
                  style={{ background: color.code }}
                ></span>
                <p className="text-sm text-slate-900">{color.name}</p>
                <IoCloseOutline
                  size={24}
                  className="text-red-500 cursor-pointer"
                  onClick={() =>
                    handleSelectChange(
                      "colors",
                      selectedColors
                        .filter((name) => name !== `${color.name}`)
                        .join(",")
                    )
                  }
                />
              </div>
            ) : null
          )}
        </div>
      ) : null} */}

			<CategoryFilter selectedCategory={category} />
			{filterOptions?.max_price ? (
				<PriceRangeFilter
					min_price={filterOptions?.min_price}
					max_price={filterOptions?.max_price}
				/>
			) : null}
			{filterOptions?.brands?.length ? (
				<BrandFilter
					filteredBrands={filterOptions?.brands}
					selectedBrandIds={selectedBrandIds}
				/>
			) : null}
			{filterOptions?.colors?.length ? (
				<ColorFilter
					colors={filterOptions?.colors}
					selectedColors={selectedColors}
				/>
			) : null}
			{filterOptions?.sizes?.length ? (
				<SizeFilter
					sizes={filterOptions?.sizes}
					selectedSizes={selectedSizes}
				/>
			) : null}
		</div>
	);
};

export default Filter;
