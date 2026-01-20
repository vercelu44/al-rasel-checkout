"use client";
import Link from "next/link";
import { useParams } from "next/navigation";
import Timer from "@/components/elements/Timer";
// import ProductSlider from "@/components/ProductSlider";
import { useGetProductFlashSaleQuery } from "@/store/api/productFlashSaleAPI";
import { useSelector } from "react-redux";
import ProductList from "@/components/products/ProductList";

const FlashSale = () => {
	const { locale } = useParams();
	const { translations } = useSelector((state) => state.common);
	const { data: flashSaleData, isLoading } = useGetProductFlashSaleQuery({
		locale,
		searchQuery: `per_page=5`,
	});

	const flashSaleInfo = flashSaleData?.flashSale || {};
	const products = flashSaleData?.data || [];
	if (flashSaleData?.status === false || isLoading || !flashSaleData)
		return null;

	return (
		<div className="relative mt-16">
			<div className="sec-heading absolute top-[-30px] left-0 w-full flex flex-col lg:flex-row justify-center lg:justify-between items-center">
				<div className=" bg-white">
					<h2 className="sec-title">
						{flashSaleInfo?.title}{" "}
						<Link href={`/flash-sale`} className="text-sm hover:text-secondary">
							{translations["see-all"] || "See All"}
						</Link>
					</h2>
				</div>
				<div className="bg-white flex flex-col lg:flex-row justify-center lg:justify-start gap-4 items-center">
					<h3 className="text-xl font-bold">
						{translations["deals-end-in"] || "Deals end in"}
					</h3>
					<Timer targetDate={flashSaleInfo?.expire_time} />
				</div>
			</div>
			<div className="flashSale-slider pt-32 lg:pt-16">
				{/* <ProductSlider
					products={products}
					sliderId="flash-sale"
					isFlashSale
				/> */}
				<ProductList products={products} isFlashSale={true} fixedItems={3}/>
			</div>
		</div>
	);
};

export default FlashSale;
