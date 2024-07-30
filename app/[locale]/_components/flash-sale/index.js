"use client";
import { Link } from "@/navigation";
import { useParams } from "next/navigation";
import Timer from "@/components/elements/Timer";
import { HiArrowLongRight } from "react-icons/hi2";
import { useGetProductFlashSaleQuery } from "@/store/api/productFlashSaleAPI";
import FlashSaleSlider from "./FlashSaleSlider";
import { SeeAll } from "@/components/elements/buttons";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import ProductCard from "@/components/cards/ProductCard";
import HorizontalScrollView from "@/components/elements/HorizontalScrollView";

const FlashSale = ({ translations }) => {
	const { locale } = useParams();
	const isMobile = useMediaQuery("(max-width: 768px)");

	const { data: flashSaleData, isLoading } = useGetProductFlashSaleQuery({
		locale,
	});

	const flashSaleInfo = flashSaleData?.flashSale || {};
	const saleProducts = flashSaleData?.data || [];
	if (flashSaleData?.status === false || isLoading || !flashSaleData)
		return null;

	return (
		<section className="flash-sale mt-28">
			<div className="container">
				<div className="relative">
					<div className="sec-heading absolute top-[-95px] lg:top-[-30px] left-0 w-full flex justify-center lg:justify-between items-center px-4">
						<div className="flex flex-col lg:flex-row gap-4 bg-white px-3">
							<div className="text-center lg:text-left">
								<h2 className="sec-title">{flashSaleInfo?.title}</h2>
								<p>
									{translations["the-offer-will-only-last"] ||
										"অফার চলবে আর মাত্র"}
								</p>
							</div>
							<Timer targetDate={flashSaleInfo?.expire_time} />
						</div>
						<Link
							href="/flash-sale"
							className="all-btn bg-white !hidden lg:!block px-3"
						>
							{translations["see-all"]} <HiArrowLongRight className="rtl:rotate-180" size={24} />{" "}
						</Link>
					</div>

					<div className="flashSale-slider border border-primary rounded-2xl lg:p-6 pt-8 lg:pt-16">
						{isMobile ? (
							<HorizontalScrollView className={"space-x-2 p-2"}>
								{saleProducts.map((product, index) => (
									<ProductCard
										key={index}
										product={product}
										isFlashSale
										isLarge
										translations={translations}
									/>
								))}
							</HorizontalScrollView>
						) : (
							<FlashSaleSlider
								saleProducts={saleProducts}
								translations={translations}
							/>
						)}
					</div>
					<SeeAll href="/flash-sale" buttonText={translations["see-all"]} />
				</div>
			</div>
		</section>
	);
};

export default FlashSale;
