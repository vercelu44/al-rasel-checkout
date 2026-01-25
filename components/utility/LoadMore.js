"use client";

import { useEffect, useState, useCallback } from "react";
import { useInView } from "react-intersection-observer";
import Loader from "../elements/loaders/Loader";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { fetchProducts } from "../actions/fetch-products";


 function LoadMore({  meta, endpoint,setProducts }) {

  const [pagesLoaded, setPagesLoaded] = useState(1);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const { ref, inView } = useInView();

  // FETCH API call for reload more products
  const loadMoreProducts = useCallback(async () => {
    const nextPage = pagesLoaded + 1;
    const url = `products?per_page=30&page=${nextPage}&${endpoint}`;
    const data = await fetchProducts(nextPage, { api: url }) || [];
    const newProducts = data?.data || [];
    setProducts((prevProducts) => [...prevProducts, ...newProducts]);
    setPagesLoaded(nextPage);
  }, [pagesLoaded, endpoint]);


  useEffect(() => {
    if (inView) {
        // Call reload product method
        loadMoreProducts();
    }
  }, [inView, loadMoreProducts]);

  return (
    <>
      {pagesLoaded > meta.last_page ? null : (
        <div
           className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 overflow-hidden"
          ref={ref}
        >
         {isMobile ? (
            <div className="col-span-full">
              <Loader />
            </div>
          ) : (
            <>
              <Loader />
              <Loader />
              <Loader />
              <Loader />
              <Loader />
            </>
          )}
        </div>
      )}
    </>
  );
}


export default LoadMore;
