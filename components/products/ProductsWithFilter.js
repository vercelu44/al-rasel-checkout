import React from "react";
import SortSelect from "@/components/elements/SortSelect";
import ProductList from "./ProductList";
import { fetchData } from "@/lib/fetch-data";
import PaginationWithSummery from "../PaginationWithSummery";
import NoProducts from "./NoProducts";
import FilterMenu from "../elements/FilterMenu";
import ProductFilters from "./ProductFilters";
import FilterPanel from "../side-drawers/FilterPanel";
import PageSize from "../elements/PageSize";
import ColumnIcons from "./ColumnIcon";

const ProductsWithFilter = async ({ customSearchParams = {}, category }) => {
	const params = new URLSearchParams(customSearchParams);
	const productResponse = await fetchData({
		api: `products?per_page=30&${params.toString()}`,
	});
	const products = productResponse?.data || [];
	const meta = productResponse?.meta || {};

	return (
		<>
		<h1 className="sr-only">Detail category</h1>
			<div className="container mb-3 md:mb-20 pt-4">
				<div className="actions-bar flex justify-between items-center mb-3 md:mb-8">
					<div className="flex items-center gap-48 w-1/2">
						<div>
							<FilterMenu /> 
						</div>
						<div className="hidden lg:block">
							<PageSize />
						</div>
					</div>
					<ColumnIcons />
					<div className="">
						<SortSelect />
					</div>
				</div>
				
				<div className="lg:flex gap-4">
					<div className="hidden md:block">
						<ProductFilters category={category} /> 
					</div>
					{products?.length ? (
						<ProductList products={products} customSearchParams={customSearchParams} />
					) : (
						<NoProducts />
					)}
				</div>
				<PaginationWithSummery
					meta={meta}
					totalItemsShowing={products?.length}
				/>
			</div>
			<FilterPanel category={category} />
		</>
	);
};
export default ProductsWithFilter;
