"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import ProductCard from "@/components/cards/ProductCard";

// ** Import Icons
import { TfiAngleRight, TfiAngleLeft } from "react-icons/tfi";

const ProductSlider = ({ products, sliderId = "slider", isFlashSale }) => {
	return (
		<div className="relative">
			<Swiper
				modules={[Navigation]}
				slidesPerView={5}
				breakpoints={{
					0: {
						slidesPerView: 2,
					},
					540: {
						slidesPerView: 2,
					},
					768: {
						slidesPerView: 3,
					},
					1024: {
						slidesPerView: 5,
					},
				}}
				spaceBetween={20}
				loop={false}
				navigation={{
					prevEl: `.custom_prev_${sliderId}`,
					nextEl: `.custom_next_${sliderId}`,
				}}
				// centeredSlides={true}
			>
				{products?.map((product, i) => (
					<SwiperSlide key={i}>
						<ProductCard product={product} isFlashSale={isFlashSale} />
					</SwiperSlide>
				))}
			</Swiper>

			<div className="slider-arrow">
				<span
					className={`slider-btn slider-prev slick-arrow custom_prev_${sliderId}`}
				>
					<TfiAngleLeft />
				</span>
				<span
					className={`slider-btn slider-next slick-arrow custom_next_${sliderId}`}
				>
					<TfiAngleRight />
				</span>
			</div>
		</div>
	);
};

export default ProductSlider;