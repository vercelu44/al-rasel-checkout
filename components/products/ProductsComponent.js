"use client";
import React, { useState } from "react";
import ProductList from "./ProductList";
import LoadMore from "../utility/LoadMore";
import PaginationWithSummery from "../PaginationWithSummery";

const ProductsComponent = ({
  products: getProducts,
  translations,
  totalProducts,
  meta,
  customSearchParams,
  apiUrl,
}) => {
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
