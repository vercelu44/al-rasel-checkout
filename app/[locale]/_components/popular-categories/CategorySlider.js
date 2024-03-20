"use client";

import { Link } from "@/navigation";
import Image from "next/image";
import { Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import noImage from "@/public/assets/images/no-image.png";

const CategorySlider = ({ categoryList }) => {
	return (
		<>
			<Swiper
				modules={[Pagination]}
				spaceBetween={50}
				slidesPerView={6}
				loop={false}
				pagination={{ clickable: true }}
				className="category-slider !static"
			>
				{categoryList?.map((category, i) => (
					<SwiperSlide key={i}>
						<div
							key={category?.id}
							className="mb-5 lg:mb-0 w-[116px] lg:w-[164px]"
						>
							<Link
								href={`/categories/${category.slug}`}
								className="category-img flex justify-center items-center h-[116px] lg:h-[164px] bg-white rounded-full"
							>
								<Image
									src={category?.icon || noImage}
									alt={category.category_name}
									width={116}
									height={78}
									className="w-[92px] lg:w-[116px] h-[62px] lg:h-[78px] object-contain hover:scale-110"
								/>
							</Link>
							<Link
								href={`/categories/${category.slug}`}
								className="block text-sm lg:text-lg text-white text-center mt-4"
							>
								{category.category_name}
							</Link>
						</div>
					</SwiperSlide>
				))}
			</Swiper>
		</>
	);
};

export default CategorySlider;
