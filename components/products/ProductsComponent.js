'use client';
import React, { useState } from 'react'
import ProductList from './ProductList';
import LoadMore from '../utility/LoadMore';
import NoProducts from './NoProducts';
import PaginationWithSummery from '../PaginationWithSummery';

const ProductsComponent = ({products:getProducts, translations, totalProducts, meta, customSearchParams,apiUrl}) => {
   const [products, setProducts] = useState([...getProducts]);
   
   
  return (
    <React.Fragment>
       
      {totalProducts > 0 ? (
        <>
          <ProductList products={products} translations={translations} customSearchParams={customSearchParams} />
          {
            process.env.NEXT_PUBLIC_INFINITY_SCROLL !== 'YES' ? 
            <PaginationWithSummery
              meta={meta}
              totalItemsShowing={products?.length}
            /> : <LoadMore  
              translations={translations}
              meta={meta}
              setProducts={setProducts}
              apiUrl={apiUrl}
            />
          }
        </>
      ) : (
        <NoProducts />
      )}
    </React.Fragment>
  )
}

export default ProductsComponent