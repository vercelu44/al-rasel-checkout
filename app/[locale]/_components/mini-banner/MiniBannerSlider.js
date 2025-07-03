"use client";

import { Link } from "@/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade } from "swiper/modules";
import Image from "next/image";

const MiniBannerSlider = ({ sliders }) => {
  return (
    <>
      <Swiper
        modules={[Autoplay, EffectFade]}
        slidesPerView={1}
        spaceBetween={0}
        loop={true}
        pagination={{ clickable: true }}
        className="intro-slider "
        autoplay={{ delay: 2000 }}
        effect="fade"
        speed={2000}
      >
        {sliders.map((slide, i) => (
          <SwiperSlide
            key={i}
            className="rounded-lg !flex items-end !h-[20px] lg:!h-[60px] bg-cover"
          >
            <Image
              src={slide.image}
              alt={`Slide ${slide.id}`}
              width={100}
              height={40}
              className="rounded-lg object-cover w-full h-full"
            />
            {slide.url && (
              <Link
                href={slide?.url}
                className="h-full w-full flex items-center justify-center"
              ></Link>
            )}
          </SwiperSlide>
        ))}
      </Swiper>
    </>
  );
};

export default MiniBannerSlider;
