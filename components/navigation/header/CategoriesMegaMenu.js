"use client";
import Link from "next/link";
import React, { useRef, useState, useEffect } from "react";
import { BsChevronDown, BsChevronUp } from "react-icons/bs";

export default function CategoriesMegaMenu({ settings, categories }) {
  const [selectedCategory, setSelectedCategory] = useState({});
  const [isOverflowing, setIsOverflowing] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const checkOverflow = () => {
      if (containerRef.current) {
        setIsOverflowing(
          containerRef.current.scrollWidth > containerRef.current.clientWidth
        );
      }
    };

    checkOverflow();
    window.addEventListener("resize", checkOverflow);

    return () => window.removeEventListener("resize", checkOverflow);
  }, [categories]);

  // console.log("settings in mega menu", settings);

  return (
    <div
      className="hidden lg:block shadow-sm"
      style={{
        backgroundColor: settings?.colors?.primary,
        color: settings?.colors?.primary_text,
      }}
      onMouseLeave={() => setSelectedCategory({})}
    >
      <div className="container">
        <div
          className="border-t border-white !opacity-10"
          style={{ borderColor: settings?.colors?.primary_text }}
        ></div>

        <div className="py-3 grid grid-cols-[1fr_124px]">
          <div
            className="w-full flex items-center gap-4 text-sm font-semibold !opacity-90 overflow-hidden line-clamp-1 whitespace-nowrap"
            ref={containerRef}
          >
            {/* CATEGORY LIST */}
            {categories?.map((category, mainIndex) => (
              <Link
                href={`/categories/${category.slug}?sort_type=new`}
                key={mainIndex}
                title={category.category_name}
                onMouseEnter={() => setSelectedCategory(category)}
                className={`uppercase ${
                  category?.child_categories?.length
                    ? "flex items-center gap-1.5"
                    : ""
                }`}
                style={{ flexShrink: 0 }}
              >
                {category.category_name}
                {category?.child_categories?.length ? (
                  selectedCategory?.slug === category.slug ? (
                    <BsChevronUp />
                  ) : (
                    <BsChevronDown />
                  )
                ) : null}
              </Link>
            ))}
            {/* HEADER PAGES (Your Requested Section) */}
            {settings?.header_page?.map((extraPage, idx) => (
              <Link
                href={extraPage.path}
                key={idx}
                title={extraPage.name}
                className={`uppercase`}
                style={{ flexShrink: 0 }}
              >
                {extraPage.name}
              </Link>
            ))}

            {/* Overflow Indicator */}
            {isOverflowing && (
              <span className="text-sm font-semibold !opacity-90">...</span>
            )}
          </div>

          {/* RIGHT SIDE BUTTONS */}
          <div className="flex items-center gap-3">
            {isOverflowing && (
              <>
                <span className="text-sm font-semibold !opacity-90">...</span>
                <Link
                  href="/categories"
                  className="text-sm font-semibold !opacity-90"
                >
                  All Categories
                </Link>
              </>
            )}
          </div>
        </div>

        {/* DROPDOWN MEGA MENU */}
        {selectedCategory?.child_categories?.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 pt-4">
            {selectedCategory?.child_categories?.map((subCategory, index) => (
              <div key={index} className="mb-2">
                <div className="transform hover:translate-x-1 transition-transform ease-in-out duration-300">
                  <Link
                    href={`/categories/${subCategory.slug}?sort_type=new`}
                    className="font-medium text-xs uppercase"
                  >
                    {subCategory?.category_name}
                  </Link>
                </div>

                {subCategory.child_categories &&
                  subCategory.child_categories.length > 0 &&
                  subCategory.child_categories.map(
                    (childCategory, subIndex) => (
                      <div
                        key={subIndex}
                        className="transform hover:translate-x-1 transition-transform ease-in-out duration-300"
                      >
                        <Link
                          href={`/categories/${childCategory.slug}?sort_type=new`}
                          className="mt-2 font-light text-xs opacity-90 uppercase"
                        >
                          {childCategory?.category_name}
                        </Link>
                      </div>
                    )
                  )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
