"use client";

import { Link } from "@/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectFade } from "swiper/modules";

// ** Import Iocns

const IntroSlider = ({ sliders }) => {
  // console.log(sliders);

  return (
    <>
      <Swiper
        modules={[Pagination, Autoplay, EffectFade]}
        slidesPerView={1}
        spaceBetween={0}
        loop={true}
        pagination={{ clickable: true }}
        className="intro-slider [&_.swiper-wrapper]:pb-6"
        autoplay={{ delay: 3000 }}
        effect="fade"
        speed={2000}
      >
        {sliders.map((slide) => {
          const slideContent = (
            <div
              style={{
                backgroundImage: `url(${slide?.image})`,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
                backgroundSize: "cover",
              }}
              className="rounded-2xl !flex items-end w-full h-full min-h-[140px] lg:!h-[354px] bg-cover relative"
            >
              {/* Add overlay or content here if needed */}
            </div>
          );
          return (
            <SwiperSlide key={slide?.id}>
              {slide.url ? (
                <Link
                  href={slide?.url}
                  aria-label="Intro banner link"
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

export default IntroSlider;
