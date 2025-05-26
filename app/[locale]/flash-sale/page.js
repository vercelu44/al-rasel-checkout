import { Suspense } from "react";
import SortSelect from "@/components/elements/SortSelect";
import ProductList from "@/components/products/ProductList";

// ** Imoprt icons
import Timer from "@/components/elements/Timer";
import { fetchData } from "@/lib/fetch-data";
import { notFound } from "next/navigation";
import PaginationWithSummery from "@/components/PaginationWithSummery";
import Image from "next/image";

// ** Search Fallback
function SearchBarFallback() {
	return <>placeholder</>;
}

const FlashSellingProducts = async ({ searchParams }) => {
	const params = new URLSearchParams(searchParams);
	// console.log(searchParams);

	const [flashRes, tranRes] = await Promise.allSettled([
		fetchData({ api: `product-flash-sale?per_page=20&${params.toString()}` }),
		fetchData({ api: `translations` }),
	]);

	const flashSaleData =
		flashRes.status === "fulfilled" ? flashRes.value || {} : {};
	const translations =
		tranRes.status === "fulfilled" ? tranRes.value?.data || {} : {};

	const flashSaleInfo = flashSaleData?.flashSale || {};
	const products = flashSaleData?.data || [];
	const meta = flashSaleData?.meta || {};
	if (flashSaleData?.status === false) return notFound();

	return (
		<>
			<div
				className="bg-no-repeat bg-cover w-full h-[166px] lg:h-[240px] breadcrumb"
				style={{
					backgroundImage: `url(${flashSaleInfo?.banner_image})`,
				}}
			>
				<div className="container flex items-center justify-center lg:gap-x-10 py-3">
					<div className="flex flex-col items-center">
						<h3 className="text-2xl lg:text-4xl font-bold font-title text-slate-900 mb-2">
							{flashSaleInfo?.title}
						</h3>
						<p className="text-base lg:text-lg/6 text-slate-600 mb-3 lg:mb-4">
							{translations["the-offer-will-only-last"] || "অফার চলবে আর মাত্র"}
						</p>
						<Timer targetDate={flashSaleInfo?.expire_time} />
					</div>
					{/* <div className="hidden lg:block">
						<Image
							src={`/assets/images/banner/robot.png`}
							alt="image"
							width={307}
							height={211}
							className="h-full w-[307px] object-contain"
						/>
					</div> */}
				</div>
			</div>

			<div className="container lg:mb-20 pt-5 lg:pt-0">
				<div className="toolbar hidden lg:flex justify-between items-center bg-slate-50 rounded-xl px-4 py-3 my-5">
					<p>
						{`${products?.length} ${translations["items"]}` ||
							`এখানে ${products?.length} টি প্রডাক্ট আছে`}
					</p>
					<Suspense fallback={<SearchBarFallback />}>
						<SortSelect />
					</Suspense>
				</div>
				<ProductList
					products={products}
					isFlashSale
					translations={translations}
				/>
				<PaginationWithSummery
					meta={meta}
					totalItemsShowing={products?.length}
					className={"px-3"}
				/>
			</div>
		</>
	);
};

export default FlashSellingProducts;
