'use client';
import React, { useState } from 'react'
import LoadMore from '../utility/LoadMore'
import NoProducts from './NoProducts'
import ProductList from './ProductList';

const ProductsComponent = ({products:getProducts, translations, totalProducts, meta, customSearchParams,apiUrl}) => {
   const [products, setProducts] = useState([...getProducts]);
   
  return (
    <React.Fragment>
       <ProductList products={products} translations={translations} customSearchParams={customSearchParams} />
      {totalProducts > 0 ? (
					 	<LoadMore  
								translations={translations}
								meta={meta}
                setProducts={setProducts}
								apiUrl={apiUrl}
							/>
					) : (
						<NoProducts />
					)}
    </React.Fragment>
  )
}

export default ProductsComponent