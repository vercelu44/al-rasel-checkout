"use client";

import { Link } from "@/navigation";
import Image from "next/image";
import { Autoplay, FreeMode, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import noImage from "@/public/assets/images/no-image.png";
import { TfiAngleRight, TfiAngleLeft } from "react-icons/tfi";
const CategorySlider = ({ categoryList }) => {
  return (
    <>
      <Swiper
        modules={[Pagination, Autoplay, FreeMode, Navigation]}
        navigation={{
          prevEl: ".custom_prev_category_btn",
          nextEl: ".custom_next_category_btn",
        }}
        spaceBetween={10}
        slidesPerGroup={1}
        slidesPerView={"auto"}
        freeMode={true}
        loop={true}
        pagination={{ clickable: true }}
        autoplay={{ delay: 4000 }}
        speed={500}
        className="category-slider !static "
      >
        {categoryList?.map((category, i) => (
          <SwiperSlide key={i} style={{ width: "fit-content" }}>
            <div
              key={category?.id}
              className="mb-5 lg:mb-10 w-[92px] md:w-[100px] lg:w-[118px] relative"
            >
              <Link
                href={`/categories/${category.slug}`}
                className="category-img flex justify-center items-center h-[92px] md:h-[100px] lg:h-[116px] bg-slate-200 rounded-full overflow-hidden"
              >
                <Image
                  src={category?.icon || noImage}
                  alt={category.category_name}
                  width={116}
                  height={116}
                  className="w-[76px] md:w-[84px] lg:w-[92px] h-[76px] md:h-[84px] lg:h-[92px] object-contain hover:scale-110"
                />
              </Link>
              <Link
                href={`/categories/${category.slug}`}
                className="block text-sm text-center mt-4 line-clamp-1"
              >
                {category.category_name}
              </Link>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      <div className="slider-arrow hidden lg:block container absolute top-14">
        <span className="slider-btn slider-prev slick-arrow custom_prev_category_btn">
          <TfiAngleLeft />
        </span>
        <span className="slider-btn slider-next slick-arrow custom_next_category_btn">
          <TfiAngleRight />
        </span>
      </div>
    </>
  );
};

export default CategorySlider;
