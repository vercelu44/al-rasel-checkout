"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import ProductCard from "@/components/cards/ProductCard";
import { TfiAngleRight, TfiAngleLeft } from "react-icons/tfi";
import { siteConfig } from "@/config/site";
import type { Product } from "@/types";
import type { Swiper as SwiperClass } from "swiper";
import type { NavigationOptions } from "swiper/types";

const BestSellSlider = ({ bestProducts }: { bestProducts: Product[] }) => {
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
        onBeforeInit={(swiper: SwiperClass) => {
          const navigation = swiper.params.navigation as NavigationOptions;
          navigation.prevEl = ".custom_prev_b";
          navigation.nextEl = ".custom_next_b";
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

    
        <button type="button" aria-label="Previous" className="slider-btn slider-prev slick-arrow !left-0 md:-left-2 custom_prev_b">
          <TfiAngleLeft />
        </button>
        <button type="button" aria-label="Next" className="slider-btn slider-next slick-arrow !right-0 md:-right-2 custom_next_b">
          <TfiAngleRight />
        </button>
    
    </div>
  );
};

export default BestSellSlider;

