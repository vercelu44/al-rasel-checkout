"use client";

import { useMediaQuery } from "@/hooks/useMediaQuery";
import dynamic from "next/dynamic";
const CategorySlider = dynamic(() =>
  import("../../_components/popular-categories/CategorySlider")
);
const CategoryList = dynamic(() =>
  import("../../_components/popular-categories/CategoryList")
);
const ResponsiveSlider = ({ categories }) => {
  const isMobile = useMediaQuery("(max-width: 767px)");
  return (
    <>
      <div className="container">
        <div className="bestSell-slider  relative">
          {!isMobile ? (
            <CategorySlider categoryList={categories} />
          ) : (
            <CategoryList categories={categories} />
            // <></>
          )}
        </div>
      </div>
    </>
  );
};

export default ResponsiveSlider;
