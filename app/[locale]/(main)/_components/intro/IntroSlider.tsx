"use client";

import Image from "next/image"; 
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay, EffectFade } from "swiper/modules";
import Link from "next/link";
import { cn } from "@/utils";
import type { Banner, SiteSettings } from "@/types";

interface IntroSliderProps {
  sliders: Banner[];
  settings: SiteSettings;
}

const IntroSlider = ({ sliders, settings }: IntroSliderProps) => {
  /** Show the dark overlay only when the slide has text on it */
  const isBackdrop = (slide: Banner) =>
    !!(slide?.title || slide?.title_2 || slide?.text);

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
              // First slide is the LCP image: load it right away with high priority
              loading={i === 0 ? "eager" : "lazy"}
              fetchPriority={i === 0 ? "high" : "auto"}
              quality={85} 
              sizes="100vw"
              className="object-cover object-center"
              placeholder="blur"
              blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiNlZWVlZWUiLz48L3N2Zz4=" // ✅ BLUR PLACEHOLDER
            />

            {isBackdrop(slide) && (
              <div className="absolute inset-0 bg-black/20 z-[1]" />
            )}

            <div className="relative z-[2]">
              <div
                className={cn(
                  "hero-slider-content p-4 lg:px-12 py-6 transition-all duration-300"
                )}
                style={{
                  color: settings?.colors?.primary_text,
                }}
              >
                {slide?.title && (
                  <p className="text-sm lg:text-lg/[24px] font-normal font-body lg:mb-4 animate-fade-in">
                    {slide?.title}
                  </p>
                )}
                {slide?.title_2 && (
                  <h1 className="text-xl lg:text-5xl font-bold font-title animate-fade-in-delay">
                    {slide?.title_2}
                  </h1>
                )}
                {slide?.text && (
                  <h2 className="text-lg lg:text-4xl/[48px] font-bold font-title mb-2 lg:my-5 animate-fade-in-delay-2">
                    {slide?.text}
                  </h2>
                )}
              </div>
            </div>


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