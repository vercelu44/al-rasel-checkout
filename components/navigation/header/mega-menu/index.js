"use client";
import { Link } from "@/navigation";
import React, { useState, useRef } from "react";
import { BsArrowRight, BsChevronDown, BsChevronUp } from "react-icons/bs";
import { useSelector } from "react-redux";
import { useParams } from "next/navigation";
import {
  useGetCategoriesQuery,
  useGetPopularCategoriesQuery,
} from "@/store/api/categoriesAPI";
import { cn } from "@/utils";
import MegaMenuSlider from "./MegaMenuSlider";

export default function MegaMenu({ settings }) {
  const { locale } = useParams();
  const { data: categoriesData } = useGetCategoriesQuery({ locale });
  const categories = categoriesData?.data || [];

  const { data: PopularCategoriesRes } = useGetPopularCategoriesQuery({
    locale,
  });
  const popularCategories = PopularCategoriesRes?.data || [];

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);

  const [menuOpen, setMenuOpen] = useState(false);
  const { translations } = useSelector((state) => state.common);
  const megaMenuRef = useRef(null);

  const closeMenu = () => {
    setMenuOpen(false);
    setSelectedCategory(null);
    setSelectedSubCategory(null);
  };

  const openMenu = () => {
    setMenuOpen(true);
  };

  const handleMouseEnter = () => {
    openMenu();
  };

  const handleMouseLeave = (event) => {
    if (
      megaMenuRef.current &&
      !megaMenuRef.current.contains(event.relatedTarget)
    ) {
      closeMenu();
    }
  };

  const handleMainCategorySelection = (category) => {
    if (category?.child_categories?.length > 0) {
      setSelectedCategory(category);
      setSelectedSubCategory(null);
    } else {
      setSelectedCategory(null);
      setSelectedSubCategory(null);
    }
  };

  const className = "px-2 py-3 rounded-sm flex items-center gap-1";

  return (
    <>
      <div className="container nav-men flex items-center gap-2 bg-[#FCFBF4]">
        <div
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className={cn(
            `relative menuBtn w-[213px] border-r border-slate-300 px-5 cursor-pointer`,
            className
          )}
        >
          <div className="text-primary flex justify-between items-center w-full">
            <span>ALL Categories</span>
            {menuOpen ? <BsChevronUp /> : <BsChevronDown />}
          </div>
          {menuOpen && (
            <div
              ref={megaMenuRef}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              className={cn(
                "cursor-default absolute z-30 left-0 top-full flex shadow-lg"
              )}
            >
              {/* Main Categories  */}
              <div className="bg-[#FCFBF4] min-w-[213px] border border-slate-300 border-t-0">
                <div className="container h-full p-4">
                  <div className="grid grid-cols-1 gap-0.5">
                    {categories?.map((category, i) => (
                      <Link
                        key={i}
                        href={`/categories/${category.slug}`}
                        onClick={closeMenu}
                        className={cn(
                          "py-1.5 hover:text-primary text-sm line-clamp-1",
                          selectedCategory?.id === category?.id &&
                            "text-primary"
                        )}
                        onMouseEnter={() =>
                          handleMainCategorySelection(category)
                        }
                      >
                        {category.category_name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
              {/* Sub Categories */}
              {selectedCategory && (
                <div className="bg-white min-w-[213px] border border-slate-300 border-l-0">
                  <div className="222 container h-full p-4 pt-2">
                    <div className="border-b border-slate-300 w-full mb-1 pb-1">
                      <h3 className="font-semibold">
                        {selectedCategory.category_name}
                      </h3>
                    </div>
                    <div className="grid grid-cols-1 gap-0.5">
                      {selectedCategory?.child_categories.map(
                        (subCategory, i) => (
                          <Link
                            key={i}
                            href={`/categories/${subCategory.slug}`}
                            onClick={closeMenu}
                            className={cn(
                              "py-1.5 hover:text-primary text-sm line-clamp-1",
                              selectedSubCategory?.id === subCategory?.id &&
                                "text-primary"
                            )}
                            onMouseEnter={() =>
                              subCategory?.child_categories?.length > 0
                                ? setSelectedSubCategory(subCategory)
                                : setSelectedSubCategory(null)
                            }
                          >
                            {subCategory.category_name}
                          </Link>
                        )
                      )}
                    </div>
                  </div>
                </div>
              )}
              {/* Child Categories  */}
              {selectedSubCategory && (
                <div className="bg-white min-w-[213px] border border-slate-300 border-l-0">
                  <div className="222 container h-full p-4 pt-2">
                    <div className="border-b border-slate-300 w-full mb-1 pb-1">
                      <h3 className="font-semibold">
                        {selectedSubCategory.category_name}
                      </h3>
                    </div>
                    <div className="grid grid-cols-1 gap-0.5">
                      {selectedSubCategory?.child_categories.map(
                        (childCategory, i) => (
                          <Link
                            key={i}
                            href={`/categories/${childCategory.slug}`}
                            onClick={closeMenu}
                            className={cn(
                              "py-1.5 hover:text-primary text-sm line-clamp-1"
                            )}
                          >
                            {childCategory.category_name}
                          </Link>
                        )
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="hidden lg:block w-[80%] relative">
          <MegaMenuSlider categories={popularCategories} />
        </div>
      </div>

      {/* can be shift here to take available width */}
    </>
  );
}
