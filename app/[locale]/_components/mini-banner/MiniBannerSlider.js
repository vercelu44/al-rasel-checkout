"use client";

import { Link } from "@/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectFade } from "swiper/modules";
import Image from "next/image";
import img1 from "@/public/assets/1.jpeg";
import img2 from "@/public/assets/2.jpeg";
import img3 from "@/public/assets/3.jpeg";

// ** Import Icons

const miniSlides = [
  {
    id: 1,
    image: img1,
    url: "/",
  },
  {
    id: 2,
    image: img2,
    url: "/",
  },
  {
    id: 3,
    image: img3,
    url: "/",
  },
];

const MiniBannerSlider = ({ sliders }) => {
  return (
    <>
      <Swiper
        modules={[Pagination, Autoplay, EffectFade]}
        slidesPerView={1}
        spaceBetween={0}
        loop={true}
        pagination={{ clickable: true }}
        className="intro-slider [&_.swiper-wrapper]:pb-6"
        autoplay={{ delay: 5000 }}
        effect="fade"
        speed={2000}
      >
        {miniSlides.map((slide) => (
          <SwiperSlide
            key={slide?.id}
            className="rounded-lg !flex items-end !h-[40px] lg:!h-[60px] bg-cover"
          >
            <Image
              src={slide.image}
              alt={`Slide ${slide.id}`}
              layout="fill"
              objectFit="cover"
              className="rounded-lg"
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
