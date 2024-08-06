import React from "react";
import { FreeMode, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { TfiAngleLeft, TfiAngleRight } from "react-icons/tfi";
import { Link } from "@/navigation";

export default function MegaMenuSlider({ categories }) {
  const className = "px-2 py-3";

  return (
    <>
      <Swiper
        modules={[Navigation, FreeMode]}
        slidesPerView={"auto"}
        slidesPerGroup={1} // Ensure one slide changes at a time
        spaceBetween={10}
        freeMode={true}
        loop={false}
        // navigation={true}
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
              href={`/categories/${category.slug}`}
              className={`${className} whitespace-nowrap min-w-fit`}
            >
              {category?.category_name}
            </Link>
          </SwiperSlide>
        ))}
        {categories?.map((category, index) => (
          <SwiperSlide key={index + 100} style={{ width: "fit-content" }}>
            <Link
              key={index}
              href={`/categories/${category.slug}`}
              className={`${className} whitespace-nowrap min-w-fit`}
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
    </>
  );
}
