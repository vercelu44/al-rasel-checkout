'use client';
import React, { useState } from 'react'
import LoadMore from '../utility/LoadMore'
import NoProducts from './NoProducts'
import ProductList from './ProductList';

const ProductsComponent = ({products:getProducts, translations, totalProducts, meta, customSearchParams, params}) => {
   const [products, setProducts] = useState([...getProducts]);
   
  return (
    <React.Fragment>
       <ProductList products={products} translations={translations} customSearchParams={customSearchParams} />
      {totalProducts > 0 ? (
					 	<LoadMore  
								products={products}
								translations={translations}
								meta={meta}
								endpoint={`${params.toString()}`}
								customSearchParams={customSearchParams}
                setProducts={setProducts}
							/>
					) : (
						<NoProducts />
					)}
    </React.Fragment>
  )
}

export default ProductsComponent