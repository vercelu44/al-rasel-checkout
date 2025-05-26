"use client";

import { Link } from "@/navigation";
import Image from "next/image";
import noImage from "@/public/assets/images/no-image.png";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Navigation, Pagination, Grid } from "swiper/modules";
import "swiper/css";
import "swiper/css/grid";
import "./CategoryList.css";

const CategoryList = ({ categories }) => {
  return (
    <Swiper
      modules={[Pagination, FreeMode, Navigation, Grid]}
      spaceBetween={50}
      pagination={{ clickable: true }}
      freeMode={true}
      loop={true}
      slidesPerView={4}
      grid={{ rows: 2, fill: "row" }}
      className="category-list-swiper w-screen relative left-1/2 -translate-x-1/2"
    >
      {categories?.map((category) => (
        <SwiperSlide key={category?.id} className="pl-10">
          <div className="w-[96px] justify-self-center">
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
              className="block text-sm text-center mt-4 "
            >
              <span className="line-clamp-3">{category.category_name}</span>
            </Link>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default CategoryList;
