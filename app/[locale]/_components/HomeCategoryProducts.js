import Link from "next/link";
import { fetchData } from "@/lib/fetch-data";
import ProductList from "@/components/products/ProductList";
import { cn } from "@/utils";

const HomeCategoryProducts = async () => {
	const [transRes] = await Promise.allSettled([
		fetchData({ api: "translations" }),
	]);
	const translations =
		transRes.status === "fulfilled" ? transRes.value?.data || {} : {};
	const data = await fetchData({
		api: "homepage-category?no_child=1",
	});
	const categoryWiseProducts = data?.data || [];


	return categoryWiseProducts?.length
		? categoryWiseProducts.map(({ category, products }, index) => {
			
			return (
				<div key={index} className="container py-3">
					<div className="py-10 pb-6 flex items-center justify-center">
						<h3 className="font-poppins text-4xl md:text-5xl font-normal">
							{category?.category_name}
						</h3>
					</div>
					
					<ProductList products={products} fixedItems={9} />
					<div className="flex justify-center">
						 <Link 
								href={`/categories/${category?.slug}?sort_type=stock_high_low`}
								className={cn("inline-block border rounded capitalize px-6 py-2 mt-2 font-semibold font-title transition-all duration-200 hover:opacity-80")}>
								{translations["see-all"] || "See All"}
							</Link>
					</div>
				</div>
		  )
		})
		: null;
};

export default HomeCategoryProducts;
