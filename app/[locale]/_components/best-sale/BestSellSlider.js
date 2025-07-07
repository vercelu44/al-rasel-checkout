"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, FreeMode, Navigation, Pagination } from "swiper/modules";
import ProductCard from "@/components/cards/ProductCard";

// ** Import Icons
import { TfiAngleRight, TfiAngleLeft } from "react-icons/tfi";
import { useMediaQuery } from "@/hooks/useMediaQuery";

const BestSellSlider = ({ bestProducts, translations }) => {
  const isTablet = useMediaQuery("(max-width: 992px)");
  return (
    <>
      <Swiper
        modules={[Pagination, Autoplay, FreeMode, Navigation]}
        slidesPerView={isTablet ? 2 : 5}
        spaceBetween={24}
        freeMode={true}
        loop={true}
        // pagination={{ clickable: true }}
        autoplay={{ delay: 3000 }}
        speed={500}
        navigation={{
          prevEl: ".custom_prev_best_sell_btn",
          nextEl: ".custom_next_best_sell_btn",
        }}
      >
        {bestProducts?.map((product, i) => (
          <SwiperSlide key={i}>
            <ProductCard
              product={product}
              isBestSale={true}
              translations={translations}
            />
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="slider-arrow hidden lg:block">
        <span className="slider-btn slider-prev slick-arrow custom_prev_best_sell_btn">
          <TfiAngleLeft />
        </span>
        <span className="slider-btn slider-next slick-arrow custom_next_best_sell_btn">
          <TfiAngleRight />
        </span>
      </div>
    </>
  );
};

export default BestSellSlider;
