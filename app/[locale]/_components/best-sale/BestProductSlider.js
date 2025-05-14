"use client";

import { Link } from "@/navigation";
import Image from "next/image";
import { Autoplay, FreeMode } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import noImage from "@/public/assets/images/no-image.png";
const BestProductSlider = ({ categoryList }) => {

  return (
    <>
      <Swiper
        modules={[ Autoplay, FreeMode]}
        spaceBetween={50}
        slidesPerGroup={1}
        slidesPerView={"auto"}
        freeMode={true}
        loop={true}
        autoplay={{ delay: 4000 }}
        speed={2000}
        className="category-slider !static "
      >
        {categoryList.map((category) => (
          <SwiperSlide key={category?.id} style={{ width: "fit-content" }}>
            <div className="mb-5 lg:mb-10 w-[92px] md:w-[100px] lg:w-[116px] relative">
              <Link
                href="/products/[slug]"
                as={`/products/${category.slug}`}
                className="category-img flex justify-center items-center h-[92px] md:h-[100px] lg:h-[116px] bg-slate-200 rounded-full overflow-hidden"
              >
                <Image
                  src={category?.image || noImage}
                  alt={category?.product_name || "Category"}
                  width={116}
                  height={116}
                  className="w-[76px] md:w-[84px] lg:w-[92px] h-[76px] md:h-[84px] lg:h-[92px] object-contain hover:scale-110 transition-transform duration-300"
                />
              </Link>
              <Link
                href="/products/[slug]"
                as={`/products/${category.slug}`}
                className="block text-sm text-center mt-4 line-clamp-1"
              >
                {category.product_name}
              </Link>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

    </>
  );
};

export default BestProductSlider;
