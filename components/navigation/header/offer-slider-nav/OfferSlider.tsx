"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade } from "swiper/modules";

/** A short promo text shown in the top offer slider. */
export interface OfferSlide {
  title: string;
  text?: string;
}

const OfferSlider = ({ sliders }: { sliders: OfferSlide[] }) => {
  return (
    <>
      <Swiper
        modules={[EffectFade, Autoplay]}
        // effect={"fade"}
        slidesPerView={3}
        breakpoints={{
          0: {
            slidesPerView: 1,
          },
          1024: {
            slidesPerView: 3,
          },
        }}
        spaceBetween={0}
        loop={true}
        // pagination={{ clickable: true }}
        className="mySwiper"
        autoplay={{ delay: 3000 }}
      >
        {sliders.map((slide, i) => (
          <SwiperSlide key={i}>
            <div className="item text-center lg:text-start">
              <h5 className="text-slate-700 font-bold">{slide.title}</h5>
              <p className="text-slate-600 text-sm">{slide.text}</p>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </>
  );
};

export default OfferSlider;
