import React from "react";
import SortSelect from "@/components/elements/SortSelect";
import { fetchData } from "@/lib/fetch-data";
import PaginationWithSummery from "../PaginationWithSummery";
import NoProducts from "./NoProducts";
import FilterMenu from "../elements/FilterMenu";
import ProductFilters from "./ProductFilters";
import FilterPanel from "../side-drawers/FilterPanel";
import PageSize from "../elements/PageSize";
import ColumnIcons from "./ColumnIcon";
import LoadMore from "../utility/LoadMore";
import ProductList from "./ProductList";

const ProductsWithFilter = async ({ customSearchParams = {}, category, translations = {}, }) => {
	const params = new URLSearchParams(customSearchParams);
	const apiUrl = `products?per_page=30&${params.toString()}`;
	const productResponse = await fetchData({
		api: apiUrl,
	});
	const products = productResponse?.data || [];
	const meta = productResponse?.meta || {};
	const totalProducts = meta.total;
	// console.log({totalProduct: productResponse});
	

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
						<SortSelect />
					</div>
				</div>
				
				<div className="lg:flex gap-4 ">
					<div className="hidden md:block">
						<ProductFilters category={category} /> 
					</div>
					<div className=" w-full">
					{totalProducts > 0 ? (
						<React.Fragment>
							
							{
								process.env.NEXT_PUBLIC_INFINITY_SCROLL !== 'YES' ? <>
								 <ProductList products={products} translations={translations} customSearchParams={customSearchParams} />
								<PaginationWithSummery
									meta={meta}
									totalItemsShowing={products?.length}
								/>
								</> : <LoadMore  
										products={products}
										translations={translations}
										meta={meta}
										endpoint={`${params.toString()}`}
										customSearchParams={customSearchParams}
									/>
							}
							
							
						</React.Fragment>
					) : (
						<NoProducts />
					)}

					</div>
				</div>
				
			</div>
			<FilterPanel category={category} />
		</>
	);
};
export default ProductsWithFilter;
