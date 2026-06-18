"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import ProductCard from "@/components/cards/ProductCard";
import { TfiAngleRight, TfiAngleLeft } from "react-icons/tfi";
import { siteConfig } from "@/config/site";

const BestSellSlider = ({ bestProducts }) => {
  return (
    <div className="relative">
      <Swiper
        modules={[Navigation]}
        slidesPerView={4}
        breakpoints={{
          0: {
            slidesPerView: 1,
          },
          640: {
            slidesPerView: 2,
          },
          768: {
            slidesPerView: 3,
          },
          1024: {
            slidesPerView: 4,
          },
        }}
        spaceBetween={20}
        loop={false}
        navigation={{
          prevEl: ".custom_prev_b",
          nextEl: ".custom_next_b",
        }}
        onBeforeInit={(swiper) => {
          swiper.params.navigation.prevEl = ".custom_prev_b";
          swiper.params.navigation.nextEl = ".custom_next_b";
        }}
      >
        {bestProducts?.map((product, i) => (
          <SwiperSlide key={i}>
            <ProductCard
              product={product}
              isSquareImage={siteConfig.isSquareImage}
            />
          </SwiperSlide>
        ))}
      </Swiper>

    
        <button type="button" className="slider-btn slider-prev slick-arrow !left-0 md:-left-2 custom_prev_b">
          <TfiAngleLeft />
        </button>
        <button type="button" className="slider-btn slider-next slick-arrow !right-0 md:-right-2 custom_next_b">
          <TfiAngleRight />
        </button>
    
    </div>
  );
};

export default BestSellSlider;

