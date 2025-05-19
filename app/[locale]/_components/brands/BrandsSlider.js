"use client";

import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import BrandCard from "./BrandCard";

// ** Import Icons
import { TfiAngleRight, TfiAngleLeft } from "react-icons/tfi";

const BrandsSlider = ({ brands }) => {
  return (
    <>
      <Swiper
        modules={[Navigation]}
        slidesPerView={8}
        spaceBetween={20}
        loop={false}
        navigation={{
          prevEl: "#brand_prev_btn",
          nextEl: "#brand_next_btn",
        }}
        breakpoints={{
          0: {
            slidesPerView: 3,
          },
          768: {
            slidesPerView: 8,
          },
        }}
      >
        {brands?.map((brand, i) => (
          <SwiperSlide key={i}>
            <BrandCard brand={brand} />
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="slider-arrow hidden lg:block">
        <span
          id="brand_prev_btn"
          className="slider-btn slider-prev slick-arrow custom_prev_br !left-0.5"
        >
          <TfiAngleLeft />
        </span>
        <span
          id="brand_next_btn"
          className="slider-btn slider-next slick-arrow custom_next_br !right-0.5"
        >
          <TfiAngleRight />
        </span>
      </div>
    </>
  );
};

export default BrandsSlider;
