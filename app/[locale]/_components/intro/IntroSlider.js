"use client";

import { Link } from "@/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectFade } from "swiper/modules";

// ** Import Iocns

const IntroSlider = ({ sliders }) => {
	// console.log(sliders);

	return (
		<>
			<Swiper
				modules={[Pagination, Autoplay, EffectFade]}
				slidesPerView={1}
				spaceBetween={0}
				loop={true}
				pagination={{ clickable: true }}
				className="intro-slider [&_.swiper-wrapper]:pb-3"
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
						className="rounded-2xl !flex items-end !h-[200px] lg:!h-[354px] bg-cover"
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

export default IntroSlider;
