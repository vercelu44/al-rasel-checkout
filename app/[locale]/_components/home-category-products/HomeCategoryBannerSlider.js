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
        {sliders.map((slide, index) => {
          const slideContent = (
            <div
              style={{
                backgroundImage: `url(${slide})`,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
                backgroundSize: "contain"
              }}
              className="rounded-2xl !flex items-end h-full min-h-[100px] lg:!h-[250px] bg-cover relative mt-0 md:mt-2"
            >
              {/* You can add overlay content here if needed */}
            </div>
          );
          return (
            <SwiperSlide key={index}>
              {url ? (
                <Link
                  href={url}
                  aria-label="Category banner link"
                  className="block h-full w-full"
                >
                  {slideContent}
                </Link>
              ) : (
                slideContent
              )}
            </SwiperSlide>
          );
        })}
      </Swiper>
    </>
  );
};

export default HomeCategoryBannerSlider;
