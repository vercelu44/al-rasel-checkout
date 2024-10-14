import Link from "next/link";
import { fetchData } from "@/lib/fetch-data";
// import ProductSlider from "@/components/ProductSlider";
import ProductList from "@/components/products/ProductList";
// import { useSelector } from "react-redux";

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
		? categoryWiseProducts.map(({ category, products }, index) => (
				<div key={index} className="container">
					<div className="py-10 flex items-center justify-between">
						<h2 className="sec-title pb-3">{category?.category_name}</h2>
						<Link
							href={`/categories/${category?.slug}?sort_type=new`}
							className="text-lg hover:text-secondary"
						>
							{translations["see-all"] || "See All"}{" "}
						</Link>
					</div>
					{/* <div className="">
            <ProductSlider products={products} sliderId={index} />
          </div> */}
					<ProductList products={products?.slice(0, 5)} fixedItems={true} />
				</div>
		  ))
		: null;
};

export default HomeCategoryProducts;
