"use client";

import { Link } from "@/navigation";
import Image from "next/image";
import noImage from "@/public/assets/images/no-image.png";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Navigation, Pagination, Grid } from "swiper/modules";
import "swiper/css";
import "swiper/css/grid";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "./CategoryList.css";

const CategoryList = ({ categories }) => {
  if (!categories?.length) {
    return <></>;
  }

  return (
    <Swiper
      modules={[Pagination, FreeMode, Navigation, Grid]}
      spaceBetween={20} // Reduced for better spacing with 5 items
      pagination={{ clickable: true }}
      freeMode={true}
      loop={true}
      slidesPerView={5} // Set to 5 items per row
      grid={{ rows: 2, fill: "row" }} // 2 rows
      className="category-list-swiper w-screen relative left-1/2 -translate-x-1/2"
    >
      {categories?.map((category) => (
        <SwiperSlide key={category?.id} className="pl-4">
          <div className="w-[60px] justify-self-center mx-auto">
            <Link
              href={`/categories/${category.slug}`}
              className="category-img flex justify-center items-center h-[56px] md:h-[80px] lg:h-[100px] bg-slate-200 rounded-full overflow-hidden"
            >
              <Image
                src={category?.icon || noImage}
                alt={category.category_name}
                width={100}
                height={100}
                className="w-[56px] md:w-[64px] lg:w-[80px] h-[56px] md:h-[64px] lg:h-[80px] object-contain hover:scale-110"
              />
            </Link>
            <Link
              href={`/categories/${category.slug}`}
              className="block text-sm text-center mt-2"
            >
              <span className="line-clamp-2">{category.category_name}</span>
            </Link>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default CategoryList;
