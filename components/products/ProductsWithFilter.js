import React from "react";
import SortSelect from "@/components/elements/SortSelect";
import ProductList from "./ProductList";
import { fetchData } from "@/lib/fetch-data";
import PaginationWithSummery from "../PaginationWithSummery";
import NoProducts from "./NoProducts";
import FilterPanel from "../side-drawers/FilterPanel";
import FilterMenu from "../elements/FilterMenu";
import SortMenu from "../navigation/bottom-navigation/SortMenu";

const ProductsWithFilter = async ({
	customSearchParams = {},
	category,
	translations = {},
}) => {
	const params = new URLSearchParams(customSearchParams);
	const productResponse = await fetchData({
		api: `products?per_page=20&${params.toString()}`,
	});
	const products = productResponse?.data || [];
	const meta = productResponse?.meta || {};

	return (
		<>
			<div className="lg:mb-20">
				<div className="lg:container toolbar lg:grid grid-cols-5 gap-5 mb-5">
					<div className="relative col-span-1 hidden lg:block">
						<FilterMenu />
					</div>

					<div className="md:hidden sort-filter-actions rounded-t-xl flex gap-3 items-center p-3">
						<SortMenu />
						<FilterMenu />
					</div>

					{/* only for mobile view category products  */}
					{category && (
						<h3 className="lg:hidden font-title pt-1 font-bold text-2xl px-4">
							{category?.category_name}
						</h3>
					)}

					<div
						className={`${
							category ? "hidden lg:block" : ""
						} col-span-4 lg:flex justify-between items-center lg:bg-slate-50 lg:rounded-xl px-4 py-3 border-b lg:border-b-0 border-slate-200`}
					>
						<p>
							{params.get("text") ? `"${params.get("text")}" ` : ""}
							{`${products?.length} ${translations["items"]}` ||
								`এখানে ${products?.length} টি প্রডাক্ট আছে`}
						</p>

						<div className="hidden lg:block">
							<SortSelect />
						</div>
					</div>
				</div>
				<div className="container">
					{products?.length ? (
						<>
							<ProductList products={products} translations={translations} />
							<PaginationWithSummery
								meta={meta}
								totalItemsShowing={products?.length}
							/>
						</>
					) : (
						<NoProducts />
					)}
				</div>
			</div>
			<FilterPanel category={category} />
		</>
	);
};
export default ProductsWithFilter;
