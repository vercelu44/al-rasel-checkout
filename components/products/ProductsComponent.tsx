"use client";
import React, { useState } from "react";
import ProductList from "./ProductList";
import LoadMore from "../utility/LoadMore";
import PaginationWithSummery from "../PaginationWithSummery";

import type { PaginationMeta, Product, ProductSearchParams, Translations } from "@/types";

interface ProductsComponentProps {
  products: Product[];
  translations?: Translations;
  totalProducts?: number;
  meta: Partial<PaginationMeta>;
  customSearchParams?: ProductSearchParams;
  /** Query string used by infinite scroll to load the next pages */
  apiUrl: string;
}

const ProductsComponent = ({
  products: getProducts,
  translations,
  totalProducts,
  meta,
  customSearchParams,
  apiUrl,
}: ProductsComponentProps) => {
  const [products, setProducts] = useState([...getProducts]);
  const isInfinityScroll = process.env.NEXT_PUBLIC_INFINITY_SCROLL === "YES";

  return (
    <React.Fragment>
      <ProductList
        products={products}
        translations={translations}
        customSearchParams={customSearchParams}
      />
      {!isInfinityScroll ? (
        <PaginationWithSummery
          meta={meta}
          totalItemsShowing={products?.length}
        />
      ) : null}

      {isInfinityScroll && totalProducts > 30 ? (
        <LoadMore
          translations={translations}
          meta={meta}
          setProducts={setProducts}
          apiUrl={apiUrl}
        />
      ) : null}
    </React.Fragment>
  );
};

export default ProductsComponent;
