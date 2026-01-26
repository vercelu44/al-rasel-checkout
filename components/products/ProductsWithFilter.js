import React from "react";
import SortSelect from "@/components/elements/SortSelect";
import { fetchData } from "@/lib/fetch-data";
import FilterMenu from "../elements/FilterMenu";
import ProductFilters from "./ProductFilters";
import FilterPanel from "../side-drawers/FilterPanel";
import PageSize from "../elements/PageSize";
import ColumnIcons from "./ColumnIcon";
import ProductsComponent from "./ProductsComponent";

const ProductsWithFilter = async ({ customSearchParams = {}, category, translations = {}, }) => {
	const params = new URLSearchParams(customSearchParams);
	const apiUrl = `products?per_page=30&${params.toString()}`;
	const productResponse = await fetchData({
		api: apiUrl,
	});
	const products = productResponse?.data || [];
	const meta = productResponse?.meta || {};
	const totalProducts = meta.total;
	const selectedParams = customSearchParams.sort_type || '';
	

	return (
		<>
		<h1 className="sr-only">Detail category</h1>
			<div className="container mb-3 md:mb-20 pt-4">
				<div className="actions-bar flex justify-between items-center mb-3 pb-4 md:mb-8 border-b">
					<div className="flex items-center gap-48 w-1/2">
						<div>
							<FilterMenu /> 
						</div>
						<div className="hidden lg:block">
							<PageSize />
						</div>
					</div>
					<div className=" flex gap-4 items-center">
					<ColumnIcons />
						<SortSelect selectedParams={selectedParams} />
					</div>
				</div>
				
				<div className="lg:flex gap-4 ">
					<div className="hidden md:block">
						<ProductFilters category={category} /> 
					</div>
					<div className=" w-full">
						<ProductsComponent 
							key={params} 
							products={products} 
							translations={translations} 
							meta={meta} 
							customSearchParams={customSearchParams} 
							totalProducts={totalProducts}
							apiUrl={apiUrl}
						 />
					</div>
				</div>
				
			</div>
			<FilterPanel category={category} />
		</>
	);
};
export default ProductsWithFilter;
