'use client';
import React from "react";
import SortSelect from "@/components/elements/SortSelect";
// import { fetchData } from "@/lib/fetch-data";
import FilterMenu from "../elements/FilterMenu";
import ProductFilters from "./ProductFilters";
import FilterPanel from "../side-drawers/FilterPanel";
import PageSize from "../elements/PageSize";
import ColumnIcons from "./ColumnIcon";
import ProductsComponent from "./ProductsComponent";
import FallbackUI from "../elements/fallback-ui";
import NoProducts from "./NoProducts";
import { buildProductQueryParams } from "@/utils/query-params";
import { useGetFilterProductsQuery } from "@/store/api/searchAPI";
import ProductLoadingSkeleton from "./LoadingSkeleton";

const ProductsWithFilter =  ({
  customSearchParams = {},
  category,
  translations = {},
}) => {
  const params = buildProductQueryParams(customSearchParams, 30);


	const {data,isLoading} = useGetFilterProductsQuery({params:params.toString()})

	const products = data?.data || [];

	
	
	

  const apiUrl = `${params.toString()}`;
	//  const apiUrl = `${process.env.API_BASE_URL}/products?${params.toString()}`;
  // const productResponse = await fetchData({
  // 	api: apiUrl,
  // });
  // const response = await fetch(apiUrl, {
  //   method: "GET",
  //   headers: {
  //     AmsPublickey: process.env.AMS_PUBLIC_KEY,
  //     lang: "en",
  //   },
  //   next: {
  //     revalidate: 1200,
  //   },
  // });

  // if (!response.ok) {
  //   const errorText = await response.text();
  //   console.error("Products API Error:", {
  //     status: response.status,
  //     url: apiUrl,
  //     message: response.message,
  //     errorText,
  //   });

  //   return (
  //     <FallbackUI message="Failed to load some data. Please refresh the page." />
  //   );
  // }

  // const productResponse = await response.json();

  // const products = productResponse?.data;

  // console.log({ ProductLimit: products?.length || "0" });

  // console.log({ apiUrl, productResponse });

  if (!products) {
    return (
      <FallbackUI message="Failed to load some data. Please refresh the page." />
    );
  }

  const meta = data?.meta || {};
  const totalProducts = meta.total;
  const selectedParams = customSearchParams.sort_type || "";


  return (
    <>
     
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
            { isLoading ? <ProductLoadingSkeleton /> :  totalProducts === 0 ? (
              <NoProducts />
            ) : (
              <ProductsComponent
                key={params}
                products={products}
                translations={translations}
                meta={meta}
                customSearchParams={customSearchParams}
                totalProducts={totalProducts}
                apiUrl={apiUrl}
              />
            )}
          </div>
        </div>
      </div>
      <FilterPanel category={category} />
    </>
  );
};
export default ProductsWithFilter;
