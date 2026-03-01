import Link from "next/link";
import { fetchData } from "@/lib/fetch-data";
import ProductList from "@/components/products/ProductList";
import { cn } from "@/utils";

const HomeCategoryProducts = async () => {
	const [transRes,settingsRes] = await Promise.allSettled([
		fetchData({ api: "translations" }),
		fetchData({ api: `info/basic` }),
	]);
	const translations =
		transRes.status === "fulfilled" ? transRes.value?.data || {} : {};
	const data = await fetchData({
		api: "homepage-category?no_child=1",
	});
	const categoryWiseProducts = data?.data || [];

	const settings =
		settingsRes.status === "fulfilled" ? settingsRes.value?.data || {} : {};

	return categoryWiseProducts?.length
		? categoryWiseProducts.map(({ category, products }, index) => (
				<div key={index} className="container">
					<div className="py-10 flex items-center justify-between">
						<h2 className="sec-title pb-3">{category?.category_name}</h2>
						<Link
							href={`/categories/${category?.slug}?sort_type=${process.env.NEXT_PUBLIC_SORT_TYPE || 'new'}`}
							className={cn("text-lg  capitalize", 
								"hover:text-[var(--primary-hover)]"
							)}
							style={{
								"--primary-hover": settings?.colors?.primary,
							}}
						>
							{translations["see-all"] || "See All"}{" "}
						</Link> 
					</div>
					{/* <div className="">
            <ProductSlider products={products} sliderId={index} />
          </div> */}
					<ProductList products={products?.slice(0, 5)} fixedItems={3} />
				</div>
		  ))
		: null;
};

export default HomeCategoryProducts;
