"use client";

import { Link } from "@/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectFade } from "swiper/modules";

const HomeCategoryBannerSlider = ({ sliders, url }) => {
  return (
    <>
      <Swiper
        modules={[Pagination, Autoplay, EffectFade]}
        slidesPerView={1}
        spaceBetween={0}
        loop={true}
        pagination={{ clickable: true }}
        className="intro-slider"
        autoplay={{ delay: 2000 }}
        effect="fade"
        speed={2000}
      >
        {sliders.map((slide, index) => (
          <SwiperSlide
            key={index}
            style={{
              backgroundImage: `url(${slide})`,
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
              backgroundSize: "contain"
            }}
            className="rounded-2xl !flex items-end h-full min-h-[100px] lg:!h-[250px] bg-cover"
          >
            {url && (
              <Link
                href={url}
                className="h-full w-full flex items-center justify-center"
              ></Link>
            )}
          </SwiperSlide>
        ))}
      </Swiper>
    </>
  );
};

export default HomeCategoryBannerSlider;
