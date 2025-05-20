"use client";
import dynamic from "next/dynamic";
import { useParams } from "next/navigation";
import { useMediaQuery } from "@/hooks/useMediaQuery";
const CategorySlider = dynamic(() => import("./CategorySlider"));
const CategoryList = dynamic(() => import("./CategoryList"));
import { useGetPopularCategoriesQuery, useGetCategoriesQuery } from "@/store/api/categoriesAPI";

const PopularCategories = () => {
  const { locale } = useParams();
  const { data: categoriesData } = useGetPopularCategoriesQuery({ locale });
  // const { data: categoriesData } = useGetCategoriesQuery({ locale });
  const popularCategories = categoriesData?.data || [];
  const isMobile = useMediaQuery("(max-width: 767px)");
  return (
    <>
      <div className="container">
        <div className="bestSell-slider  relative">
          {!isMobile ? (
            <CategorySlider categoryList={popularCategories} />
          ) : (
            <CategoryList categories={popularCategories} />
          )}
        </div>
      </div>
    </>
  );
};

export default PopularCategories;
