"use client";

import { Link } from "@/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectFade } from "swiper/modules";

// ** Import Iocns

const MiniBannerSlider = ({ sliders }) => {
	// console.log(sliders);

	return (
		<>
			<Swiper
				modules={[Pagination, Autoplay, EffectFade]}
				slidesPerView={1}
				spaceBetween={0}
				loop={true}
				pagination={{ clickable: true }}
				className="intro-slider [&_.swiper-wrapper]:pb-6"
				autoplay={{ delay: 3000 }}
				effect="fade"
				speed={2000}
			>
				{sliders.map((slide) => (
					<SwiperSlide
						key={slide?.id}
						style={{
							backgroundImage: `url(${slide?.image})`,
							backgroundRepeat: "no-repeat",
							backgroundPosition: "center",
						}}
						className="rounded-xl !flex items-end  lg:!h-[60px] bg-cover"
					>
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
