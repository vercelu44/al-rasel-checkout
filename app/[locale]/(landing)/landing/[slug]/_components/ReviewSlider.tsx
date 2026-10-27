"use client";
import Image from "next/image";
import { useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay, EffectFade } from "swiper/modules";
import type { LandingPageProduct } from "@/types";

export default function ReviewSlider({ product }: { product: LandingPageProduct }) {
  const images =
    product?.product_review_sses?.map((review) => review.image) || [];

  return (
    <div className="py-3">
      <Swiper
        modules={[Pagination, Autoplay, EffectFade]}
        slidesPerView={1}
        spaceBetween={20}
        loop={images?.length > 1}
        pagination={{ clickable: true }}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        speed={1200}
        breakpoints={{
          768: { slidesPerView: 1 },
          992: { slidesPerView: 2 },
          1100: { slidesPerView: 3 },
        }}
      >
        {images?.map((slide, i) => (
          <SwiperSlide key={i} className="">
            <div className="relative rounded-2xl border  px-3 lg:px-12 md:py-10 h-[213px] md:h-[363px] lg:h-[400px] xl:h-[500px]">
              <Image
                src={slide || "/assets/images/banner/banner-1.png"}
                alt={`Slide ${i + 1}`}
                fill
                className="object-contain object-center"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 60vw"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
