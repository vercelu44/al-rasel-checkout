import { useParams } from "next/navigation";
import { useGetPopularCategoriesQuery } from "@/store/api/categoriesAPI";
import React, { useState, useRef } from "react";
import { FreeMode, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { TfiAngleLeft, TfiAngleRight } from "react-icons/tfi";
import { Link } from "@/navigation";
import { cn } from "@/utils";
import Image from "next/image";
import noImage from "@/public/assets/images/no-image.png";

export default function MegaMenuSlider() {
  const { locale } = useParams();
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const { data: PopularCategoriesRes } = useGetPopularCategoriesQuery({
    locale,
  });
  const categories = PopularCategoriesRes?.data || [];

  const className = "px-2 py-3 hover:text-primary ";
  const subMegaMenuRef = useRef(null);

  const closeMenu = () => {
    setMenuOpen(false);
    setSelectedCategory(null);
  };

  const openMenu = () => {
    setMenuOpen(true);
  };

  const handleMouseEnter = (category) => {
    setSelectedCategory(category);
    openMenu();
  };

  const handleMouseLeave = (event) => {
    if (
      subMegaMenuRef.current &&
      !subMegaMenuRef.current.contains(event.relatedTarget)
    ) {
      closeMenu();
    }
  };

  if (!categories?.length) return null;

  return (
    <>
      <div className="relative">
        <Swiper
          modules={[Navigation, FreeMode]}
          slidesPerView={"auto"}
          slidesPerGroup={1}
          spaceBetween={10}
          freeMode={true}
          loop={false}
          navigation={{
            prevEl: ".custom_prev_br",
            nextEl: ".custom_next_br",
          }}
          className="mega-menu-slider"
        >
          {categories?.map((category, index) => (
            <SwiperSlide key={index} style={{ width: "fit-content" }}>
              <Link
                key={index}
                href={`/categories/${category?.slug}`}
                className={`${className} whitespace-nowrap tex-sm`}
                onMouseEnter={() => handleMouseEnter(category)}
                // onMouseLeave={handleMouseLeave}
              >
                {category?.category_name}
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
        <div className="slider-arrow hidden lg:block">
          <span className="slider-btn !w-10 !h-10 slider-prev slick-arrow custom_prev_br !left-0">
            <TfiAngleLeft />
          </span>
          <span className="slider-btn !w-10 !h-10 slider-next slick-arrow custom_next_br !-right-6">
            <TfiAngleRight />
          </span>
        </div>
      </div>

      {menuOpen &&
      (selectedCategory?.child_categories?.length ||
        selectedCategory?.brands?.length) ? (
        <div
          ref={subMegaMenuRef}
          onMouseLeave={handleMouseLeave}
          className={cn("absolute w-full h-fit top-full left-0")}
        >
          <div className="border grid grid-cols-[200px_370px_auto] gap-0.5 container border-slate-300 border-t-0 shadow-lg bg-white z-10 p-4">
            <div className="categories">
              <h3 className="text-slate-900 font-semibold mb-1">Categories</h3>
              <div className="flex flex-col">
                {selectedCategory?.child_categories?.map(
                  (subCategory, index) => (
                    <Link
                      key={index}
                      href={`/categories/${subCategory?.slug}`}
                      className={`py-1.5 hover:text-primary text-sm`}
                      onClick={() => closeMenu()}
                    >
                      {subCategory?.category_name}
                    </Link>
                  )
                )}
              </div>
            </div>
            <div className="top-brands">
              <h3 className="text-slate-900 font-semibold mb-1">Top Brands</h3>
              <div className="grid grid-cols-3 gap-3">
                {selectedCategory?.brands?.slice(0, 9)?.map((brand, index) => (
                  <Link
                    key={index}
                    href={`/products?brand_ids=${brand.id}`}
                    className="inline-block w-fit border-slate-300 hover:border-primary rounded-xl border p-2.5"
                  >
                    <div className="h-[96px] w-[96px] flex items-center justify-center rounded-lg">
                      <Image
                        src={brand.brand_image || noImage}
                        alt={brand.brand_name}
                        width={118}
                        height={118}
                        className="w-full h-full object-contain rounded-lg"
                      />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
            {selectedCategory?.image && (
              <div className="category-banner">
                <div className="pl-10 h-[218px] w-[512px]">
                  <Image
                    src={selectedCategory?.image || noImage}
                    alt={selectedCategory?.category_name}
                    width={218}
                    height={512}
                    className="w-full h-full object-contain object-top"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      ) : null}
    </>
  );
}
