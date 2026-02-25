"use client";
import React, { useState } from "react";
import LoadMore from "../utility/LoadMore";
import ProductList from "./ProductList";

const ProductsComponent = ({
  products: getProducts,
  translations,
  totalProducts,
  meta,
  customSearchParams,
  apiUrl,
}) => {
  const [products, setProducts] = useState([...getProducts]);

  return (
    <React.Fragment>
      <ProductList
        products={products}
        translations={translations}
        customSearchParams={customSearchParams}
      />
      {totalProducts > 30 ? (
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
