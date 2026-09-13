'use client';
import React from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay, EffectFade } from "swiper/modules";

const ProductSlider = ({ photos }) => {
  return (
    
      <div className="">
        <Swiper
          modules={[Pagination, Autoplay, EffectFade]}
          slidesPerView={1}
          spaceBetween={20}
          loop={photos?.length > 1}
          pagination={{ clickable: true }}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
           breakpoints={{
          768: { slidesPerView: 1 },
          992: { slidesPerView: 2 },
          1100: { slidesPerView: 3 },
        }}
          speed={1200}
          lazy={{
            loadPrevNext: true,
            loadPrevNextAmount: 1,
          }}
        >
          {photos?.map((slide, i) => (
            <SwiperSlide key={i}>
              <div
                className="relative rounded-2xl px-3 lg:px-12 md:py-10 h-[213px] md:h-[363px] lg:h-[400px] xl:h-[500px]"
              >
                <Image
                  src={slide?.image || "/assets/images/banner/banner-1.png"}
                  alt={slide?.title_2 || slide?.title || `Slide ${i + 1}`}
                  fill
                  className="object-contain object-center"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 60vw"
                  priority={i === 0}
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

  );
};

export default ProductSlider;