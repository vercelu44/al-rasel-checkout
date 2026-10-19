"use client";

import Image from "next/image"; 
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay, EffectFade } from "swiper/modules";
import Link from "next/link";

const IntroSlider = ({ sliders, settings }) => {
 

  return (
    <Swiper
      modules={[Pagination, Autoplay, EffectFade]}
      slidesPerView={1}
      spaceBetween={0}
      loop={true}
      pagination={{ clickable: true }}
      className="hero-slider"
      autoplay={{ 
        delay: 3000,
        disableOnInteraction: false,
        pauseOnMouseEnter: true, 
      }}
      effect="fade"
      speed={1200}
      lazy={{
        loadPrevNext: true, 
        loadPrevNextAmount: 1,
      }}
    >
      {sliders.map((slide, i) => (
        <SwiperSlide key={i}>
          <div
            className={`relative single-hero-slider overflow-hidden bg-top px-3 lg:px-12 md:py-10 text-center flex justify-center items-center ${
              settings?.offer_massage
                ? "h-[203px] md:h-[353px] lg:h-[85vh]"
                : "h-[213px] md:h-[363px] lg:h-[88vh]"
            }`}
          >
            <Image
              src={slide?.image || '/assets/images/banner/banner-1.png'}
              alt={slide?.title_2 || slide?.title || `Slide ${i + 1}`}
              fill
              priority={i === 0} 
              loading={i === 0 ? "eager" : "lazy"} 
              quality={85} 
              sizes="100vw"
              className="object-cover object-center"
              placeholder="blur"
              blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiNlZWVlZWUiLz48L3N2Zz4=" // ✅ BLUR PLACEHOLDER
            />


            {slide.url && (
              <Link
                href={slide?.url}
                className="absolute inset-0 z-[3]"
                aria-label={slide?.title_2 || slide?.title || `View slide ${i + 1}`}
              >
                <span className="sr-only">
                  {slide?.title_2 || slide?.title || `View slide ${i + 1}`}
                </span>
              </Link>
            )}
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default IntroSlider;